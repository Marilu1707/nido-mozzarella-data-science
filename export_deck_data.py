"""Calcula, desde el dataset procesado, los números y series que usa la presentación."""
import json
import pandas as pd
from scipy import stats

df = pd.read_csv('data/processed/dataset_nido_mozzarella.csv', parse_dates=['fecha'])
MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
out = {}

out['filas'], out['columnas'] = df.shape
out['desde'], out['hasta'] = f'{df.fecha.min():%m/%Y}', f'{df.fecha.max():%m/%Y}'
out['num_cols'] = int(df.select_dtypes('number').shape[1])

pm = df.groupby('mes').prod_quesos_kt.mean()
out['prod_mes'] = [round(v, 1) for v in pm.values]
out['mes_pico'], out['mes_bajo'] = MESES[pm.idxmax() - 1], MESES[pm.idxmin() - 1]
out['pico_vs_bajo'] = round(pm.max() / pm.min(), 1)
part = df.groupby('estacion').prod_quesos_kt.sum() / df.prod_quesos_kt.sum()
out['share_primavera'] = round(part['Primavera'] * 100)
out['share_otono'] = round(part['Otoño'] * 100)

anual = df[df.anio <= 2025].groupby('anio').prod_quesos_kt.sum()
out['anios'] = [str(a) for a in anual.index]
out['prod_anual'] = [round(v) for v in anual.values]
out['var_2025'] = round((anual[2025] / anual[2024] - 1) * 100)
out['ult12_vs_prev'] = round((df.prod_quesos_kt.tail(12).sum() / df.prod_quesos_kt.iloc[-24:-12].sum() - 1) * 100)

x = df.dropna(subset=['temp_media']).copy()
out['r_temp'] = round(stats.pearsonr(x.temp_media, x.prod_quesos_kt)[0], 2)
h = df[df.anio >= 2021].copy()
h['desvio'] = h.prod_quesos_kt - h.groupby('mes').prod_quesos_kt.transform('mean')
out['r_fer_directo'] = round(stats.pearsonr(h.feriados_habiles, h.prod_quesos_kt)[0], 2)
out['r_fer'] = round(stats.pearsonr(h.feriados_habiles, h.desvio)[0], 2)

pr = df.dropna(subset=['precio_queso_real']).copy()
out['mes_base'] = f'{pr.fecha.max():%m/%Y}'
q = pr.set_index('fecha').precio_queso_real.resample('QS').mean()
out['precio_trim_labels'] = [f'{d:%Y}' if d.month == 1 else '' for d in q.index]
out['precio_trim'] = [round(v) for v in q.values]
ini, fin = pr.precio_queso_real.head(12).mean(), pr.precio_queso_real.tail(12).mean()
out['queso_real_var'] = round((fin / ini - 1) * 100)
out['queso_ini'], out['queso_fin'] = round(ini), round(fin)

out['r_queso_leche'] = round(stats.pearsonr(pr.precio_queso_cremoso.pct_change().dropna(),
                                            pr.precio_leche_sachet.pct_change().dropna())[0], 2)
out['ratio_prom'] = round(pr.ratio_queso_leche.mean(), 1)
out['ratio_min'], out['ratio_max'] = round(pr.ratio_queso_leche.min(), 1), round(pr.ratio_queso_leche.max(), 1)
rq = pr.set_index('fecha').ratio_queso_leche.resample('QS').mean()
out['ratio_trim'] = [round(v, 2) for v in rq.values]
out['ratio_trim_labels'] = [f'{d:%Y}' if d.month == 1 else '' for d in rq.index]

pr['qt'] = pr.precio_queso_real / pr.precio_queso_real.rolling(12, center=True, min_periods=6).mean() - 1
est = pr.groupby('mes').qt.mean() * 100
out['precio_estacional'] = [round(v, 1) for v in est.values]

moz = df[df.anio == 2025].mozzarella_estimada_kt.sum()
out['mozza_2025'] = round(moz)

json.dump(out, open('deck_data.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in out.items() if not isinstance(v, list)}, ensure_ascii=False, indent=1))
