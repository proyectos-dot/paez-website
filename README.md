# Grupo PÁEZ — Sitio web

Experiencia de scroll inmersiva para **PÁEZ Desarrollo Inmobiliario**. Sin dependencias, sin build: HTML, CSS y JavaScript nativo.

## Correr en local

```bash
python3 -m http.server 4801 -d .
```

Luego abrir `http://localhost:4801`.

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Las seis secciones del recorrido: hero, manifiesto, legado, proyectos, método, contacto |
| `styles.css` | Sistema visual completo (paleta, tipografía, animaciones, responsive) |
| `main.js` | Motor de scroll: revelados, parallax, contadores, iluminación del manifiesto |
| `assets/` | Renders de proyecto a 1920px |

## Sistema visual — "Papel & Oro"

- **Papel** `#f5f3ee` — el fondo operacional, la mayor parte del sitio
- **Navy** `#0a0e1c` — usado como fondo sagrado en manifiesto y método
- **Oro** `#a8853b` — con avaricia: acentos en itálica, un CTA, una cifra
- Tipografía: **Fraunces** (editorial, títulos) + **Inter** (cuerpo, UI)

## Reglas de contenido (no negociables)

Estas reglas vienen del *Contexto Maestro 360°* y del SOP de marketing. Romperlas crea riesgo regulatorio real.

1. **Nunca prometer rendimiento** en una pieza pública. Prohibido: "retorno del X%", "plusvalía garantizada", "renta asegurada", "invierta y reciba".
2. **Nunca usar léxico de oferta de valores**: "participación fiduciaria", "derechos fiduciarios", "fondo de retiro". Eso pertenece al circuito privado bajo NDA, no a la web (Ley 249-17, arts. 3 y 48 — la SIMV autoriza toda oferta pública).
3. **PÁEZ es marca de origen y respaldo de ejecución física.** No presentarla como operador clínico, empresa tecnológica ni garante de rendimiento.
4. **No publicar imágenes de documentos financieros.** Se eliminó una lámina con ROI, ADR, ocupación y logos de terceros que venía en la carpeta de presentación.
5. **Distinguir lo construido de lo proyectado.** Vista está en obra; el Hub Médico está en estructuración. Decirlo así.

## Verificado

Consola sin errores, sin desbordes horizontales de 375px a 1440px, los cuatro contadores y los cuatro proyectos se revelan incluso navegando por anclas o con la pestaña en segundo plano.

## Pendiente de confirmar con la dirección

- Forma correcta del nombre del fundador (las fuentes internas usan cuatro variantes distintas).
- Conteo de unidades por proyecto: hay cifras en conflicto entre el modelo financiero y el material comercial.
- Datos de contacto reales (teléfono, dirección física, redes).
