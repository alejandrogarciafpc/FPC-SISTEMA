# 🏗 GRUPO FPC — Sistema de Control de Instalaciones

## Sistema de Compensaciones, Scorecard & Control Operativo
### Versión 2.0 — Marzo 2026

---

## ¿Qué es este sistema?

Una aplicación web profesional para controlar:
- **Ingreso de metros** instalados por equipo (instalador + ayudante)
- **Scorecard** de cumplimiento del Manual Operativo (14 criterios)
- **Clasificación A/B** de técnicos con tablas de pago diferenciadas
- **Dashboard** con gráficas y KPIs en tiempo real
- **Pagos e incentivos** (solo visible para gerencia)

---

## Usuarios del Sistema

| Usuario   | Contraseña    | Qué puede hacer                                    |
|-----------|---------------|-----------------------------------------------------|
| admin     | fpc2026       | Todo: ver montos, editar, scorecard, clasificar      |
| gerente   | gerente2026   | Todo: ver montos, editar, scorecard, clasificar      |
| diana     | diana2026     | Ingresar metros, evaluar scorecard (NO ve montos Q)  |
| Sin login | —             | Solo ver: dashboard, resúmenes, scorecard, categorías |

---

## Cómo montarlo en internet (GRATIS)

### Opción 1: Vercel (Recomendada — más fácil)

1. Ve a **https://github.com** y crea una cuenta (si no tienes)
2. Crea un repositorio nuevo llamado `fpc-sistema`
3. Sube todos los archivos de esta carpeta al repositorio
4. Ve a **https://vercel.com** e inicia sesión con tu cuenta de GitHub
5. Haz clic en **"New Project"**
6. Selecciona el repositorio `fpc-sistema`
7. Haz clic en **"Deploy"**
8. ¡Listo! Tu sistema estará en una URL como: `fpc-sistema.vercel.app`

### Opción 2: Netlify (Alternativa igual de fácil)

1. Ve a **https://netlify.com** y crea una cuenta
2. Haz clic en **"Add new site" → "Deploy manually"**
3. Primero necesitas construir el proyecto:
   - Instala Node.js desde https://nodejs.org
   - Abre terminal/cmd en la carpeta del proyecto
   - Ejecuta: `npm install`
   - Ejecuta: `npm run build`
4. Arrastra la carpeta `build/` a Netlify
5. ¡Listo!

### Opción 3: GitHub Pages (100% gratis para siempre)

1. Sube el proyecto a GitHub
2. Instala Node.js, abre terminal en la carpeta
3. Ejecuta: `npm install`
4. Ejecuta: `npm run build`
5. En GitHub, ve a Settings → Pages → selecciona la carpeta /build
6. Tu sitio estará en: `tu-usuario.github.io/fpc-sistema`

---

## Estructura de archivos

```
fpc-project/
├── public/
│   └── index.html          ← Página base
├── src/
│   ├── index.js             ← Punto de entrada
│   └── App.js               ← TODO el sistema (app completa)
├── package.json             ← Dependencias
├── vercel.json              ← Configuración de Vercel
└── README.md                ← Este archivo
```

---

## Módulos del Sistema

### 1. Dashboard Ejecutivo
- Total de equipos activos
- Categoría A vs B con porcentaje
- Total de instalaciones y metros
- Ranking de instaladores por metros
- Ranking de productos por metros
- Scorecard visual de todo el equipo con semáforos

### 2. Ingreso de Metros
- Desplegable de equipo (instalador + ayudante)
- Desplegable de los 32 productos
- Campo de metros y unidades
- Cálculo automático según categoría A o B
- Cotización y cliente opcionales
- Vista previa antes de guardar

### 3. Resumen por Instalador
- Tabla con todos los instaladores
- Cantidad de instalaciones
- Metros lineales totales
- (Solo gerente) Montos Q por instalador y ayudante

### 4. Resumen por Producto
- Tabla con todos los productos instalados
- Cantidad y metros por producto
- (Solo gerente) Montos Q

### 5. Scorecard
- 14 criterios del Manual Operativo:
  - Errores de medición
  - Errores de instalación
  - Retrabajos
  - Garantías
  - Reclamos de cliente
  - Llamadas de atención
  - Proceso de llamadas
  - Evidencia fotográfica
  - Constancia firmada
  - Liquidación de viáticos
  - Disciplina y orden
  - Servicio al cliente
  - Revisión de material
  - Checklist de instalación
- Semáforo: 🟢 Verde (cumple) 🟡 Amarillo (riesgo) 🔴 Rojo (incumplimiento)
- Score global de 0 a 100

### 6. Clasificación A/B
- Ver categoría actual de cada técnico
- Score de cumplimiento
- Botón para subir/bajar de categoría
- Cat A = 125% de la tabla de metros
- Cat B = 100% de la tabla de metros

### 7. Equipos
- Lista de todos los equipos instalador + ayudante
- Agregar nuevos equipos
- Activar/desactivar equipos

### 8. Tablas de Pago
- Los 32 productos con precio por metro
- Comparación Cat A vs Cat B
- Para instalador y ayudante

### 9. Pagos & Incentivos (Solo gerente/admin)
- Total pagado a instaladores
- Total pagado a ayudantes
- Gran total
- Detalle por equipo
- Desglose por producto por instalador

---

## Reglas de negocio implementadas

### Categoría A (Técnico Elite)
- Pago: 125% de la tabla base
- Requisitos: Cero errores, cero reclamos, cumplimiento total
- Evidencia: inmediata
- Viáticos: 24 horas

### Categoría B (Técnico Estándar)
- Pago: 100% de la tabla base
- Tolerancia: hasta 3 errores menores
- Evidencia: mismo día
- Viáticos: 48 horas

### Movimiento entre categorías
- Ascenso B→A: 3 meses consecutivos sin incumplimientos
- Descenso A→B: 1 evento crítico

### Reglas especiales
- Garantía: NO paga metros
- Conexión eléctrica: NO paga metros
- Planchar: solo si el cliente contrató planchado como servicio
- Motor y Canaleta: solo para motorización de cortina existente
- Productos motorizados nuevos: ya incluyen motor en su rubro

---

## Soporte

Sistema desarrollado para Grupo FPC — Guatemala
Cualquier duda o modificación, contactar al equipo de sistemas.
