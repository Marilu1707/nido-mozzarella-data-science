# 🧀 Nido Mozzarella: oferta, precio y pronóstico de la producción de queso

**Data Science II: Machine Learning para la Ciencia de Datos · Coderhouse**

**Autora:** María Luján Massironi

---

## De qué se trata

**Nido Mozzarella** es una pyme que elabora y vende mozzarella. Este proyecto analiza el mercado en el que opera el negocio y arma un modelo para anticipar la oferta de queso. Cruza datos oficiales de **producción de quesos** y **precios al consumidor** con **clima**, **feriados** e **inflación**, y busca respuestas para planificar la producción, las compras y los precios.

El proyecto retoma el dataset del [portfolio interactivo Nido Mozzarella](https://github.com/Marilu1707/portfolio_interactivo) y lo enriquece con datos de APIs públicas.

**Audiencia:** dueños y gerencia, compras y comercial de Nido Mozzarella.

## Estructura del repositorio

```
├── 1-pre-entrega/                      Obtención de insights a partir de visualizaciones
│   ├── Nido_Mozzarella_EDA.ipynb       Notebook: APIs, limpieza, nulos, EDA, insights y primer modelado
│   ├── Nido_Mozzarella_Presentacion.pdf Presentación ejecutiva (12 slides)
│   ├── data/raw/                       Datos crudos, tal como los devuelven las APIs
│   ├── data/processed/                 Dataset mensual final (138 filas × 22 columnas) y resultados
│   └── images/                         Gráficos del notebook
├── 2-entrega-final/                    Entrenamiento y optimización de modelos de Machine Learning
│   ├── Nido_Mozzarella_Entrega_Final.ipynb  Notebook: ingeniería de atributos, CV temporal, optimización, SHAP y pronóstico
│   ├── data/processed/                 Dataset de entrada (copia de la pre-entrega) y pronóstico
│   └── images/                         Gráficos del notebook
├── requirements.txt
└── README.md
```

## Fuentes de datos (APIs públicas)

| Fuente | API | Datos |
|--------|-----|-------|
| INDEC / Ministerio de Economía | [apis.datos.gob.ar/series](https://apis.datos.gob.ar/series/api/) | Producción mensual de quesos, yogur, manteca y dulce de leche |
| INDEC (IPC-GBA, precios medios) | apis.datos.gob.ar/series | Precio del kg de queso cremoso y del litro de leche fresca |
| INDEC (IPC Nacional) | apis.datos.gob.ar/series | Índice de precios para deflactar |
| Open-Meteo (respaldo: NASA POWER) | [open-meteo.com](https://open-meteo.com/) / [power.larc.nasa.gov](https://power.larc.nasa.gov/) | Temperatura y lluvia diaria en Buenos Aires |
| ArgentinaDatos | [api.argentinadatos.com](https://api.argentinadatos.com/) | Feriados nacionales (desde 2021) |
| Portfolio Nido Mozzarella | GitHub raw | Participación de la mozzarella en el consumo de quesos |

## 1. Pre-entrega: insights a partir de visualizaciones

| # | Hipótesis | Resultado |
|---|-----------|-----------|
| H1 | La producción de quesos es estacional | ✅ Octubre produce el doble que abril. La primavera concentra el 31% del año. |
| H2 | La producción es volátil año a año | ✅ Mínimo en 2016, máximo en 2021 y +16% en 2025. |
| H3 | El calor baja la producción | ❌ Correlación cercana a 0. |
| H4 | El queso le perdió a la inflación | ✅ El precio real cayó un 11%. |
| H5 | Queso y leche se mueven juntos | ✅ r = 0,81. 1 kg de queso equivale a unos 7 litros de leche. |
| H6 | El queso es más caro cuando hay menos producción | ✅ +4 a 5% de abril a julio, -5% en diciembre y enero. |
| H7 | Los feriados restan producción | ❌ El efecto desaparece al controlar por el mes. |

## 2. Entrega Final: pronóstico de la producción mensual

**Problema:** predecir cuántas miles de toneladas de queso se van a producir el mes siguiente (regresión).

- **Ingeniería de atributos:**
  - Rezagos de 1, 2, 3 y 12 meses, promedios móviles y variación interanual.
  - Rezagos de la producción de dulce de leche y del precio de la leche.
  - Encoding cíclico del mes y One Hot Encoding de la estación.
  - Estandarización con `StandardScaler` dentro de un `Pipeline`.
- **Modelos:** Ridge, Random Forest, Gradient Boosting, XGBoost y un ensamble que promedia los cuatro.
- **Validación:** `TimeSeriesSplit` de 5 folds en el entrenamiento, y test con los últimos 24 meses.
- **Optimización:** `GridSearchCV` para Ridge y `RandomizedSearchCV` para los modelos de árboles.

| Modelo | RMSE validación cruzada | RMSE test | R² test |
|--------|------------------------:|----------:|--------:|
| **Ensamble (promedio de los 4 optimizados)** | **3,68** | **3,53** | **0,61** |
| XGBoost optimizado | 3,75 | 3,79 | 0,55 |
| Random Forest optimizado | 3,80 | 3,51 | 0,62 |
| Ridge optimizado | 3,84 | 3,75 | 0,56 |
| Gradient Boosting optimizado | 3,85 | 3,49 | 0,62 |
| Base: mismo mes del año anterior | 3,87 | 4,25 | 0,44 |

El modelo se eligió por el menor RMSE en validación cruzada. En el test reduce el error un **17%** frente a la regla simple. Según SHAP, las variables que más pesan son el mismo mes del año anterior, el mes anterior y el mes del año. El pronóstico para la segunda mitad de 2026 marca un pico de unos 27 mil toneladas en septiembre.

## Cómo correrlo

```bash
pip install -r requirements.txt
cd 1-pre-entrega && jupyter notebook Nido_Mozzarella_EDA.ipynb
cd 2-entrega-final && jupyter notebook Nido_Mozzarella_Entrega_Final.ipynb
```

También se pueden abrir en Google Colab. En la pre-entrega, con `DESCARGAR = True` el notebook descarga los datos de las APIs, y con `False` usa los CSV de `data/raw/`.

## Próximo paso

Sumar la leche cruda que reciben las industrias (OCLA), el precio de la leche al productor y las lluvias en la cuenca lechera, y reentrenar el modelo cada mes con el dato nuevo del INDEC.
