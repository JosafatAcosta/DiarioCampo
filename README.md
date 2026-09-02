# Diario de Campo · Clínica Comunitaria Ágora

Aplicación web para el registro etnográfico de las jornadas del dispositivo de
intervención clínico-comunitaria del Ágora, en Chalco, Estado de México.

Es una aplicación **estática y sin servidor**: no hay base de datos, no hay cuentas
y no hay costo de operación. Cada diario se guarda en el propio teléfono o
computadora de quien lo llena, y se comparte exportándolo.

---

## Qué hace

- **Formulario del instrumento** con sus seis secciones, y campos que cambian
  según el tipo de sesión (acercamiento y sensibilización · intervención formal).
- **Folio automático** con la fecha, las iniciales del operador que llena el
  diario y un consecutivo: `2026-09-03_JA_01`. Evita que los archivos de varios
  observadores de la misma jornada se pisen entre sí.
- **Autoguardado**: el borrador se guarda solo mientras se escribe. Si el
  teléfono se bloquea o se cierra el navegador, al volver a abrir aparece la
  opción de recuperar lo escrito.
- **Diarios guardados** en el dispositivo, con lista para abrirlos o borrarlos.
- **Exportación** a CSV (con BOM, para que Excel lea bien los acentos) y a XML,
  de un diario o de todos juntos.
- **Respaldo JSON e importación**, para consolidar los diarios de varios
  operadores sin duplicar: al importar solo entran los folios que falten.
- **Funciona sin conexión** una vez abierta, e **se instala** en la pantalla de
  inicio como una app.

### Sin valores por defecto

Ningún campo de medición viene precargado. Un campo en **s/r** («sin registro»)
significa que no se observó, y es distinto de un cero, que significa que se buscó
y no ocurrió. Al guardar, la app avisa qué quedó sin llenar.

---

## Estructura

```
index.html              la aplicación completa (formulario + lógica)
manifest.webmanifest    identidad de la app instalable
sw.js                   service worker: permite usarla sin conexión
vercel.json             cabeceras de caché para el despliegue
icons/                  íconos de la app
```

---

## Despliegue en Vercel

El proyecto es estático: **no requiere configuración de framework ni build.**

1. En Vercel, *Add New… → Project* e importar este repositorio.
2. Framework Preset: **Other**.
3. Build Command: *(vacío)* · Output Directory: *(vacío, raíz del repositorio)*.
4. Deploy.

Cada `push` a `main` publica una versión nueva. Las ramas generan un despliegue
de vista previa, útil para probar antes de publicar.

El `vercel.json` ya define que `sw.js`, `index.html` y el manifiesto no se
guarden en caché del navegador, de modo que las actualizaciones lleguen al
equipo en cuanto abran la app con señal. Cuando hay una versión nueva, la app
muestra un aviso con un botón para actualizar; **los diarios guardados no se
pierden al actualizar.**

---

## Instalación en el teléfono

- **Android (Chrome):** al abrir la dirección aparece el aviso «Instala el diario
  en este teléfono». También desde el menú ⋮ → *Instalar aplicación*.
- **iPhone (Safari):** botón *Compartir* → *Añadir a pantalla de inicio*.

Una vez instalada, se abre como cualquier otra app y funciona sin señal.

---

## Dónde viven los datos

Los diarios se guardan en el almacenamiento local del navegador de cada
dispositivo. Eso significa que:

- **No viajan a ningún servidor.** Nadie más los ve hasta que se exportan.
- **No se sincronizan solos** entre teléfonos: cada operador exporta su CSV o su
  respaldo JSON al terminar el día y los envía a coordinación, que los consolida
  con el botón *Importar respaldo*.
- **Borrar los datos del navegador borra los diarios.** Conviene exportar al
  cierre de cada jornada.

---

## Protección de datos

El instrumento registra material clínicamente sensible sobre personas menores de
edad. Los archivos exportados deben tratarse como confidenciales: acceso
restringido al equipo operativo y a la supervisión clínica, y anonimización en
cualquier documento que se comparta con terceros.

---

*Clínica Comunitaria Ágora · Chalco, Estado de México*
