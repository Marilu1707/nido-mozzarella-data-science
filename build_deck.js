// Presentación ejecutiva de la entrega (máx. 12 slides), en tonos rosas.
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const { applyTheme } = require('/root/.claude/skills/synced/1ca5560c-5ec4-4b81-a850-b78985707987_fd425a67-a66c-4b5d-81b4-4d4bd48e4d0f/pptx/scripts/apply_theme.js');

const D = JSON.parse(fs.readFileSync('deck_data.json', 'utf8'));
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const fmt = (n) => n.toLocaleString('es-AR');
const dec = (n) => String(n).replace('.', ',');

// Paleta
const HEX = { rosa: 'C2185B', rosaOsc: '880E4F', rosaClaro: 'F8BBD0', rosaFondo: 'FDF0F5', azul: '1E88E5', tinta: '3A2A30', gris: '6B5E64', blanco: 'FFFFFF' };
const THEME = {
  name: 'Nido Mozzarella', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1: HEX.tinta, lt1: HEX.blanco, dk2: HEX.rosaOsc, lt2: HEX.rosaFondo,
    accent1: HEX.rosa, accent2: HEX.azul, accent3: HEX.rosaClaro, accent4: HEX.gris, accent5: 'AD1457', accent6: 'F06292',
    hlink: HEX.rosa, folHlink: HEX.rosaOsc },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';  // 10 x 5.625 in
pres.title = 'Nido Mozzarella - Primera entrega';
pres.author = 'María Luján Massironi';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: 'OSCURO', background: { color: HEX.rosaOsc },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.5, w: 8.8, h: 1.5, fontSize: 40, bold: true, color: C.background1, fontFace: THEME.headFontFace, valign: 'bottom' }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.15, w: 8.8, h: 1.4, fontSize: 18, color: HEX.rosaClaro, valign: 'top' }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENIDO', background: { color: HEX.blanco },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 26, bold: true, color: C.text2, fontFace: THEME.headFontFace, valign: 'middle', margin: 0 }, text: '' } },
    { text: { text: 'Nido Mozzarella · Primera entrega · Data Science II', options: { x: 0.5, y: 5.2, w: 6, h: 0.3, fontSize: 9, color: HEX.gris, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontSize: 9, color: HEX.gris, align: 'right' },
});

// ---------- Helpers ----------
const chartBase = (extra = {}) => Object.assign({
  catAxisLabelColor: HEX.gris, valAxisLabelColor: HEX.gris, catAxisLabelFontSize: 11, valAxisLabelFontSize: 10,
  catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', dataLabelFontFace: '+mn-lt',
  valGridLine: { color: 'F3E0E8', size: 0.75 }, catGridLine: { style: 'none' },
  catAxisLineShow: true, catAxisLineColor: 'D9C4CD', valAxisLineShow: false, showLegend: false,
  dataLabelColor: HEX.tinta, dataLabelFontSize: 10,
}, extra);

function card(s, x, y, w, h, fill = HEX.rosaFondo) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12 });
}
function stat(s, x, y, w, big, label, color = HEX.rosa) {
  s.addText(big, { x, y, w, h: 0.75, fontSize: 40, bold: true, color, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
  s.addText(label, { x, y: y + 0.75, w, h: 0.6, fontSize: 13, color: HEX.tinta, margin: 0, valign: 'top', isTextBox: true });
}
function circleNum(s, x, y, n, fill = HEX.rosa) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color: fill }, line: { color: fill } });
  s.addText(String(n), { x, y, w: 0.42, h: 0.42, fontSize: 13, bold: true, color: HEX.blanco, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
}
function takeaway(s, text, y = 4.45) {
  card(s, 0.5, y, 9, 0.62);
  s.addText(text, { x: 0.7, y, w: 8.6, h: 0.62, fontSize: 14, color: HEX.rosaOsc, bold: true, valign: 'middle', margin: 0, isTextBox: true });
}
const addContent = (section) => pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: section });

// ---------- 1. Portada ----------
pres.addSection({ title: 'Introducción' });
let s = pres.addSlide({ masterName: 'OSCURO', sectionTitle: 'Introducción' });
s.addText('Nido Mozzarella: qué mueve la oferta y el precio del queso', { placeholder: 'title' });
s.addText([
  { text: 'Primera entrega · Obtención de insights a partir de visualizaciones', options: { breakLine: true } },
  { text: 'María Luján Massironi · Data Science II, Coderhouse', options: { fontSize: 14, color: HEX.blanco } },
], { placeholder: 'body' });

// ---------- 2. Abstracto ----------
s = addContent('Introducción');
s.addText('Por qué miramos estos datos y para quién', { placeholder: 'title' });
card(s, 0.5, 1.3, 4.3, 2.9);
s.addText('Motivación', { x: 0.75, y: 1.45, w: 3.8, h: 0.45, fontSize: 20, bold: true, color: HEX.rosa, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
s.addText([
  { text: 'Nido Mozzarella elabora y vende mozzarella.', options: { bullet: true, breakLine: true } },
  { text: 'Su margen depende de cuánta leche hay, cuánto cuesta y a cuánto se vende el queso.', options: { bullet: true, breakLine: true } },
  { text: 'Con inflación alta, es fácil perder precio sin notarlo.', options: { bullet: true } },
], { x: 0.75, y: 1.95, w: 3.85, h: 2.1, fontSize: 14, color: HEX.tinta, paraSpaceAfter: 8, valign: 'top', margin: 0, isTextBox: true });
card(s, 5.2, 1.3, 4.3, 2.9);
s.addText('Audiencia', { x: 5.45, y: 1.45, w: 3.8, h: 0.45, fontSize: 20, bold: true, color: HEX.rosa, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
s.addText([
  { text: 'Dueños y gerencia: ', options: { bold: true } }, { text: 'plan anual de producción.', options: { breakLine: true } },
  { text: 'Compras: ', options: { bold: true } }, { text: 'cuándo asegurar leche.', options: { breakLine: true } },
  { text: 'Comercial: ', options: { bold: true } }, { text: 'cuándo subir precios y cuándo hacer promociones.' },
], { x: 5.45, y: 1.95, w: 3.85, h: 2.1, fontSize: 14, color: HEX.tinta, paraSpaceAfter: 10, valign: 'top', margin: 0, isTextBox: true });
takeaway(s, 'La pregunta de fondo: cuándo producir más, cuándo subir precios y cómo cuidar el margen.');

// ---------- 3. Metadata ----------
s = addContent('Introducción');
s.addText('Cinco fuentes públicas, un solo dataset', { placeholder: 'title' });
stat(s, 0.5, 1.3, 2.1, String(D.filas), 'meses analizados');
stat(s, 2.75, 1.3, 2.1, String(D.columnas), `columnas (${D.num_cols} numéricas)`);
stat(s, 5.0, 1.3, 2.1, '5', 'fuentes vía API');
stat(s, 7.25, 1.3, 2.3, String(Number(D.hasta.slice(3)) - Number(D.desde.slice(3))) + ' años', `de ${D.desde} a ${D.hasta}`);
const fuentes = [
  ['INDEC / Min. Economía', 'Producción de quesos y otros lácteos'],
  ['INDEC (precios GBA)', 'Precio del kg de queso y del litro de leche'],
  ['INDEC (IPC Nacional)', 'Inflación, para pasar precios a pesos de hoy'],
  ['Open-Meteo / NASA POWER', 'Temperatura y lluvia en Buenos Aires'],
  ['ArgentinaDatos + portfolio', 'Feriados y participación de la mozzarella'],
];
s.addTable([
  [{ text: 'Fuente', options: { bold: true, color: HEX.blanco, fill: { color: HEX.rosa } } }, { text: 'Qué aporta', options: { bold: true, color: HEX.blanco, fill: { color: HEX.rosa } } }],
  ...fuentes.map((f, i) => f.map((t) => ({ text: t, options: { fill: { color: i % 2 ? HEX.blanco : HEX.rosaFondo } } }))),
], { x: 0.5, y: 2.85, w: 9, colW: [3.2, 5.8], fontSize: 12, color: HEX.tinta, border: { type: 'none' }, rowH: 0.36, margin: [2, 8, 2, 8] });

// ---------- 4. Preguntas ----------
s = addContent('Introducción');
s.addText('Siete preguntas para guiar el análisis', { placeholder: 'title' });
const preguntas = [
  '¿La producción de quesos es estacional?', '¿Cómo cambia de un año a otro?', '¿El calor baja la producción?',
  '¿El queso le ganó a la inflación?', '¿El queso acompaña a la leche?', '¿El precio del queso cambia según la época?', '¿Los feriados restan producción?',
];
preguntas.forEach((p, i) => {
  const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
  const x = 0.5 + col * 4.6, y = 1.35 + row * 0.82;
  circleNum(s, x, y, i + 1);
  s.addText(p, { x: x + 0.6, y: y - 0.05, w: 3.85, h: 0.52, fontSize: 15, color: HEX.tinta, valign: 'middle', margin: 0, isTextBox: true });
});

// ---------- 5. Estacionalidad de la producción ----------
pres.addSection({ title: 'Producción' });
s = addContent('Producción');
s.addText(D.pico_vs_bajo >= 1.95 ? 'Octubre produce el doble de queso que abril' : `Octubre produce ${dec(D.pico_vs_bajo)} veces más queso que abril`, { placeholder: 'title' });
s.addChart(pres.charts.BAR, [{ name: 'Miles de t', labels: MESES, values: D.prod_mes }], chartBase({
  x: 0.5, y: 1.15, w: 9, h: 3.2, barDir: 'col', barGapWidthPct: 45, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0',
  chartColors: D.prod_mes.map((v) => (v >= [...D.prod_mes].sort((a, b) => b - a)[2] ? HEX.rosa : HEX.rosaClaro)),
  showTitle: true, title: 'Producción promedio por mes, 2015 a 2026 (miles de toneladas)', titleFontSize: 12, titleColor: HEX.gris, titleFontFace: '+mn-lt',
  valAxisHidden: true, valGridLine: { style: 'none' },
}));
takeaway(s, `La primavera concentra el ${D.share_primavera}% del queso del año y el otoño apenas el ${D.share_otono}%.`);

// ---------- 6. Producción anual ----------
s = addContent('Producción');
s.addText(`La producción es volátil: en 2025 subió ${D.var_2025}%`, { placeholder: 'title' });
const maxA = Math.max(...D.prod_anual), minA = Math.min(...D.prod_anual);
s.addChart(pres.charts.BAR, [{ name: 'Miles de t', labels: D.anios, values: D.prod_anual }], chartBase({
  x: 0.5, y: 1.15, w: 9, h: 3.2, barDir: 'col', barGapWidthPct: 40, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0',
  chartColors: D.prod_anual.map((v, i) => (v === maxA || v === minA || D.anios[i] === '2025' ? HEX.rosa : HEX.rosaClaro)),
  showTitle: true, title: 'Producción anual de quesos (miles de toneladas)', titleFontSize: 12, titleColor: HEX.gris, titleFontFace: '+mn-lt',
  valAxisHidden: true, valGridLine: { style: 'none' },
}));
takeaway(s, `Los últimos 12 meses vienen ${D.ult12_vs_prev}% arriba de los 12 anteriores: más oferta y más competencia.`);

// ---------- 7. Clima y feriados ----------
s = addContent('Producción');
s.addText('Ni el calor ni los feriados explican la producción', { placeholder: 'title' });
card(s, 0.5, 1.3, 4.3, 2.9);
s.addText('Temperatura', { x: 0.75, y: 1.45, w: 3.8, h: 0.4, fontSize: 18, bold: true, color: HEX.rosa, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
s.addText(`r = ${dec(D.r_temp)}`, { x: 0.75, y: 1.9, w: 3.8, h: 0.8, fontSize: 44, bold: true, color: HEX.rosaOsc, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
s.addText('Correlación prácticamente nula entre la temperatura del mes y lo que se produce.', { x: 0.75, y: 2.8, w: 3.85, h: 1.2, fontSize: 14, color: HEX.tinta, valign: 'top', margin: 0, isTextBox: true });
card(s, 5.2, 1.3, 4.3, 2.9);
s.addText('Feriados', { x: 5.45, y: 1.45, w: 3.8, h: 0.4, fontSize: 18, bold: true, color: HEX.rosa, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
s.addText(`r = ${dec(D.r_fer)}`, { x: 5.45, y: 1.9, w: 3.8, h: 0.8, fontSize: 44, bold: true, color: HEX.rosaOsc, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
s.addText(`Parecía haber efecto (r = ${dec(D.r_fer_directo)}), pero desaparece al comparar cada mes con su promedio.`, { x: 5.45, y: 2.8, w: 3.85, h: 1.2, fontSize: 14, color: HEX.tinta, valign: 'top', margin: 0, isTextBox: true });
takeaway(s, 'Para planificar la producción alcanza con el calendario: el clima no aporta.');

// ---------- 8. Precio real ----------
pres.addSection({ title: 'Precios' });
s = addContent('Precios');
s.addText(`El queso perdió ${Math.abs(D.queso_real_var)}% contra la inflación`, { placeholder: 'title' });
s.addChart(pres.charts.LINE, [{ name: 'Precio real', labels: D.precio_trim_labels, values: D.precio_trim }], chartBase({
  x: 0.5, y: 1.15, w: 6.2, h: 3.2, lineSize: 2, lineDataSymbol: 'none', chartColors: [HEX.rosa],
  valAxisLabelFormatCode: '$#,##0', valAxisMinVal: 10000,
  showTitle: true, title: `Precio del kg de queso cremoso en pesos de ${D.mes_base} (promedio trimestral)`, titleFontSize: 11, titleColor: HEX.gris, titleFontFace: '+mn-lt',
}));
stat(s, 7.0, 1.4, 2.5, `$${fmt(D.queso_ini)}`, 'promedio al inicio (2016-17)', HEX.gris);
stat(s, 7.0, 2.85, 2.5, `$${fmt(D.queso_fin)}`, 'promedio de los últimos 12 meses');
takeaway(s, 'Subir precios al ritmo de la inflación no alcanza: el margen hay que cuidarlo por el lado del costo.');

// ---------- 9. Queso vs leche ----------
s = addContent('Precios');
s.addText(`1 kg de queso vale lo mismo que ${dec(D.ratio_prom)} litros de leche`, { placeholder: 'title' });
s.addChart(pres.charts.LINE, [{ name: 'Litros por kg', labels: D.ratio_trim_labels, values: D.ratio_trim }], chartBase({
  x: 0.5, y: 1.15, w: 6.2, h: 3.2, lineSize: 2, lineDataSymbol: 'none', chartColors: [HEX.rosa],
  valAxisMinVal: 5, valAxisMaxVal: 9, valAxisLabelFormatCode: '0',
  showTitle: true, title: 'Litros de leche equivalentes a 1 kg de queso (trimestral)', titleFontSize: 11, titleColor: HEX.gris, titleFontFace: '+mn-lt',
}));
stat(s, 7.0, 1.4, 2.5, dec(D.r_queso_leche), 'correlación entre los aumentos mensuales de queso y leche');
stat(s, 7.0, 2.85, 2.5, `${dec(D.ratio_min)}-${dec(D.ratio_max)}`, 'rango de la relación (litros por kg)');
takeaway(s, 'Indicador de margen: si la relación baja de 7, el precio del queso se está quedando atrás.');

// ---------- 10. Estacionalidad del precio ----------
s = addContent('Precios');
s.addText('En otoño e invierno el queso se paga más caro', { placeholder: 'title' });
s.addChart(pres.charts.BAR, [{ name: '% vs tendencia', labels: MESES, values: D.precio_estacional }], chartBase({
  x: 0.5, y: 1.15, w: 9, h: 3.2, barDir: 'col', barGapWidthPct: 45, showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '+0.0;-0.0',
  chartColors: D.precio_estacional.map((v) => (v > 0 ? HEX.rosa : HEX.rosaClaro)),
  showTitle: true, title: 'Precio real del queso respecto de su tendencia, por mes (%)', titleFontSize: 12, titleColor: HEX.gris, titleFontFace: '+mn-lt',
  valAxisHidden: true, valGridLine: { style: 'none' },
}));
takeaway(s, 'Abril a julio, cuando hay menos queso: mejor momento para el precio. Verano: volumen y promociones.');

// ---------- 11. Insights ----------
pres.addSection({ title: 'Cierre' });
s = addContent('Cierre');
s.addText('Insights: qué confirmamos y qué hacemos', { placeholder: 'title' });
const ok = '✔', no = '✘';
const filas = [
  [ok, 'Producción estacional', `Pico en ${D.mes_pico.toLowerCase()}, mínimo en ${D.mes_bajo.toLowerCase()}`, 'Plan de producción por estación'],
  [ok, 'Volátil año a año', `2025: +${D.var_2025}%`, 'Revisar el plan una vez al año'],
  [no, 'El calor baja la producción', `r = ${dec(D.r_temp)}`, 'Planificar con el calendario'],
  [ok, 'Queso pierde vs inflación', `${D.queso_real_var}% real`, 'Controlar costos'],
  [ok, 'Queso acompaña a la leche', `${dec(D.ratio_prom)} l por kg`, 'Indicador de margen mensual'],
  [ok, 'Precio estacional', '+4 a 5% abril-julio', 'Precios en otoño, promos en verano'],
  [no, 'Feriados restan producción', `r = ${dec(D.r_fer)}`, 'No ajustar por feriados'],
];
const hdr = ['', 'Hipótesis', 'Dato', 'Acción'].map((t) => ({ text: t, options: { bold: true, color: HEX.blanco, fill: { color: HEX.rosa } } }));
s.addTable([hdr, ...filas.map((f, i) => f.map((t, j) => ({ text: t, options: {
  fill: { color: i % 2 ? HEX.blanco : HEX.rosaFondo }, bold: j === 0, align: j === 0 ? 'center' : 'left',
  color: j === 0 ? (t === ok ? HEX.rosa : HEX.gris) : HEX.tinta } })))],
{ x: 0.5, y: 1.2, w: 9, colW: [0.5, 2.8, 2.5, 3.2], fontSize: 12, border: { type: 'none' }, rowH: 0.43, margin: [2, 6, 2, 6] });

// ---------- 12. Próximos pasos ----------
s = pres.addSlide({ masterName: 'OSCURO', sectionTitle: 'Cierre' });
s.addText('Próximo paso: pronosticar con Machine Learning', { placeholder: 'title' });
s.addText([
  { text: 'Modelo para predecir la producción y el precio del mes siguiente.', options: { breakLine: true } },
  { text: 'Variables útiles: mes, estación y meses anteriores. Fuera: clima y feriados.' },
], { placeholder: 'body' });

(async () => {
  await pres.writeFile({ fileName: 'Nido_Mozzarella_Presentacion.pptx' });
  await applyTheme('Nido_Mozzarella_Presentacion.pptx', THEME);
  console.log('ok');
})();
