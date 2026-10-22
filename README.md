# 🧀 Nido Mozzarella: qué mueve la oferta y el precio del queso

**Data Science II: Machine Learning para la Ciencia de Datos · Coderhouse**  
**Primera entrega: Obtención de insights a partir de visualizaciones**  
**Autora:** María Luján Massironi

---

## De qué se trata

**Nido Mozzarella** es una pyme que elabora y vende mozzarella. Este proyecto analiza el mercado en el que opera el negocio. Se cruzan datos oficiales de **producción de quesos** y **precios al consumidor** con **clima**, **feriados** e **inflación**, y se buscan respuestas para planificar la producción, las compras y los precios.

El proyecto retoma el dataset del [portfolio interactivo Nido Mozzarella](https://github.com/Marilu1707/portfolio_interactivo), de la pre-entrega anterior, y lo enriquece con datos de APIs públicas.

**Audiencia:** dueños y gerencia, compras y comercial de Nido Mozzarella.

## Contenido del repositorio

| Archivo | Qué es |
|---------|--------|
| `Nido_Mozzarella_EDA.ipynb` | Notebook principal. Contiene el abstracto, las preguntas, la descarga desde las APIs, la limpieza, el EDA y los insights. |
| `Nido_Mozzarella_Presentacion.pdf` / `.pptx` | Presentación ejecutiva (12 slides). |
| `data/raw/` | Datos crudos, tal como los devuelven las APIs. |
| `data/processed/dataset_nido_mozzarella.csv` | Dataset mensual final: 138 filas × 22 columnas, de 01/2015 a 06/2026. |
| `images/` | Gráficos que exporta el notebook. |
| `build_notebook.py`, `export_deck_data.py`, `build_deck.js` | Scripts que generan el notebook y la presentación. |

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

## Próximo paso

Entrenar modelos de Machine Learning para **pronosticar la producción y el precio del mes siguiente**, usando como variables el mes, la estación y los rezagos.
