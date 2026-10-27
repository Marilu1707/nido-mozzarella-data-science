# 🧀 Nido Mozzarella: qué mueve la oferta y el precio del queso

**Data Science II: Machine Learning para la Ciencia de Datos · Coderhouse**  
**Primera entrega:** obtención de insights a partir de visualizaciones  
**Entrega Final:** entrenamiento y optimización de modelos de Machine Learning  
**Autora:** María Luján Massironi

---

## De qué se trata

**Nido Mozzarella** es una pyme que elabora y vende mozzarella. Este proyecto analiza el mercado en el que opera el negocio. Se cruzan datos oficiales de **producción de quesos** y **precios al consumidor** con **clima**, **feriados** e **inflación**, y se buscan respuestas para planificar la producción, las compras y los precios.

El proyecto retoma el dataset del [portfolio interactivo Nido Mozzarella](https://github.com/Marilu1707/portfolio_interactivo), de la pre-entrega anterior, y lo enriquece con datos de APIs públicas.

**Audiencia:** dueños y gerencia, compras y comercial de Nido Mozzarella.

## Contenido del repositorio

| Archivo | Qué es |
|---------|--------|
| `Nido_Mozzarella_EDA.ipynb` | **Primera entrega.** Contiene el abstracto, las preguntas, la descarga desde las APIs, el análisis de nulos (missingno), la limpieza, el EDA, los insights y el modelado. |
| `Nido_Mozzarella_Entrega_Final.ipynb` | **Entrega Final.** Pronóstico de producción mensual (regresión): ingeniería de atributos, validación cruzada temporal, optimización de hiperparámetros, selección de modelo, SHAP y pronóstico. |
| `Nido_Mozzarella_Presentacion.pdf` | Presentación ejecutiva de la primera entrega (12 slides). |
| `data/raw/` | Datos crudos, tal como los devuelven las APIs. |
| `data/processed/dataset_nido_mozzarella.csv` | Dataset mensual final: 138 filas × 22 columnas, de 01/2015 a 06/2026. |
| `images/` | Gráficos que exporta el notebook. |
| `requirements.txt` | Librerías necesarias para correr el notebook. |

## Fuentes de datos (APIs públicas)

| Fuente | API | Datos |
|--------|-----|-------|
| INDEC / Ministerio de Economía | [apis.datos.gob.ar/series](https://apis.datos.gob.ar/series/api/) | Producción mensual de quesos, yogur, manteca y dulce de leche |
| INDEC (IPC-GBA, precios medios) | apis.datos.gob.ar/series | Precio del kg de queso cremoso y del litro de leche fresca |
| INDEC (IPC Nacional) | apis.datos.gob.ar/series | Índice de precios para deflactar |
| Open-Meteo (respaldo: NASA POWER) | [open-meteo.com](https://open-meteo.com/) / [power.larc.nasa.gov](https://power.larc.nasa.gov/) | Temperatura y lluvia diaria en Buenos Aires |
| ArgentinaDatos | [api.argentinadatos.com](https://api.argentinadatos.com/) | Feriados nacionales (desde 2021) |
| Portfolio Nido Mozzarella | GitHub raw | Participación de la mozzarella en el consumo de quesos |

## Preguntas e hipótesis

| # | Hipótesis | Resultado |
|---|-----------|-----------|
| H1 | La producción de quesos es estacional | ✅ Octubre produce el doble que abril. La primavera concentra el 31% del año. |
| H2 | La producción es volátil año a año | ✅ Mínimo en 2016, máximo en 2021 y +16% en 2025. |
| H3 | El calor baja la producción | ❌ Correlación cercana a 0. |
| H4 | El queso le perdió a la inflación | ✅ El precio real cayó un 11%. |
| H5 | Queso y leche se mueven juntos | ✅ r = 0,81. 1 kg de queso equivale a unos 7 litros de leche. |
| H6 | El queso es más caro cuando hay menos producción | ✅ +4 a 5% de abril a julio, -5% en diciembre y enero. |
| H7 | Los feriados restan producción | ❌ El efecto desaparece al controlar por el mes. |

## Cómo correrlo

```bash
pip install -r requirements.txt
jupyter notebook Nido_Mozzarella_EDA.ipynb
```

También se puede abrir en Google Colab. Con `DESCARGAR = True` el notebook descarga los datos de las APIs. Con `False` usa los CSV de `data/raw/`.

## Modelado: pronóstico de producción mensual

Siguiendo la estructura del notebook de la Datathon del curso (`Colab_final_datathon_David.ipynb`), el notebook entrena **4 modelos de ensamble** y los compara con una línea de base. La base es la regla "igual que el mismo mes del año anterior". Para evaluar se separan los últimos 24 meses (división temporal).

| Modelo | R² | RMSE (miles de t) |
|--------|---:|------------------:|
| AdaBoost | 0,65 | 3,38 |
| XGBoost | 0,64 | 3,39 |
| GradientBoosting | 0,60 | 3,58 |
| LightGBM | 0,58 | 3,67 |
| Base: mismo mes del año anterior | 0,44 | 4,25 |

El mejor modelo (AdaBoost) reduce el error un 20% frente a la base. Con él se pronostican julio a diciembre de 2026 (`data/processed/pronostico_2026.csv`), con un pico de unos 26,8 mil t en octubre.

## Entrega Final: modelo optimizado

**Problema:** predecir cuántas miles de toneladas de queso se van a producir el mes siguiente (regresión).

- **Ingeniería de atributos:** rezagos (1, 2, 3 y 12 meses), promedios móviles, variación interanual, rezagos de dulce de leche y precio de la leche, encoding cíclico del mes, One Hot Encoding de la estación y estandarización con `StandardScaler` dentro de un `Pipeline`.
- **Modelos:** Ridge, Random Forest, Gradient Boosting, XGBoost y un ensamble que promedia los cuatro.
- **Validación:** `TimeSeriesSplit` (5 folds) en el entrenamiento y test con los últimos 24 meses.
- **Optimización:** `GridSearchCV` para Ridge y `RandomizedSearchCV` para los modelos de árboles.

| Modelo | RMSE validación cruzada | RMSE test | R² test |
|--------|------------------------:|----------:|--------:|
| **Ensamble (promedio de los 4 optimizados)** | **3,68** | **3,53** | **0,61** |
| XGBoost optimizado | 3,75 | 3,79 | 0,55 |
| Random Forest optimizado | 3,80 | 3,51 | 0,62 |
| Ridge optimizado | 3,84 | 3,75 | 0,56 |
| Gradient Boosting optimizado | 3,85 | 3,49 | 0,62 |
| Base: mismo mes del año anterior | 3,87 | 4,25 | 0,44 |

El modelo elegido (por menor RMSE en validación cruzada) reduce el error un **17%** en test frente a la regla simple. SHAP muestra que las variables que más pesan son el mismo mes del año anterior, el mes anterior y el mes del año.

## Próximo paso

Sumar la leche cruda que reciben las industrias (OCLA), el precio de la leche al productor y las lluvias en la cuenca lechera, y reentrenar el modelo cada mes con el dato nuevo del INDEC.
