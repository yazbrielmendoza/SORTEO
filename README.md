# 🎰 SORTEO - Marcador Interactivo de Números

Una aplicación web moderna y responsiva para marcar números ganadores en rifas y sorteos. Diseñada con interfaz intuitiva, efectos visuales atractivos y funcionalidades prácticas.

## 🎯 Características

✨ **Interfaz Moderna**
- Diseño degradado profesional con colores vibrantes
- Transiciones suaves y animaciones fluidas
- Interfaz completamente responsiva (mobile, tablet, desktop)

🎪 **Funcionalidades**
- Marcado interactivo de números del 1 al 90
- Contador en tiempo real de números seleccionados
- Guardado automático en el navegador (LocalStorage)
- Exportación como imagen PNG descargable

🚀 **Experiencia de Usuario**
- Click para marcar/desmarcar números
- Efectos visuales al marcar (animación pulse)
- Confirmación antes de reiniciar
- Botones de acción rápida e intuitivos

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos, gradientes, flexbox y grid
- **JavaScript Vanilla**: Sin dependencias externas
- **Canvas API**: Generación de imágenes descargables

## 📂 Estructura del Proyecto

```
SORTEO/
├── index.html          # Página principal
├── styles.css          # Estilos y temas
├── script.js           # Lógica de la aplicación
└── README.md           # Este archivo
```

## 🚀 Cómo Usar

### Opción 1: Online (Directo)
1. Abre el archivo `index.html` en tu navegador
2. ¡Comienza a marcar números!

### Opción 2: Servidor Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Luego abre http://localhost:8000
```

## 📋 Guía Rápida

1. **Marcar Números**: Haz clic en cualquier número para marcarlo
2. **Desmarcar**: Haz clic nuevamente para desmarcar
3. **Reiniciar**: Botón "🔄 Reiniciar" - limpia todos los números
4. **Descargar**: Botón "📥 Descargar" - guarda una imagen PNG del estado actual

## 💾 Persistencia de Datos

Los números marcados se guardan automáticamente en el navegador usando `LocalStorage`. Tus selecciones se mantendrán aunque:
- Recargues la página
- Cierres el navegador
- Pases horas sin usar la app

## 🎨 Diseño Visual

### Paleta de Colores
- **Primarios**: Gradiente púrpura-azul (#667eea → #764ba2)
- **Secundarios**: Gradiente rosa-rojo (#f093fb → #f5576c)
- **Acentos**: Verde menta (#43e97b → #38f9d7)

### Estados de Números
- **No marcado**: Gradiente púrpura-azul
- **Marcado**: Gradiente rosa-rojo con ✓
- **Hover**: Escala 1.08 y brillo aumentado

## 📱 Responsividad

La aplicación se adapta automáticamente a:
- **Escritorio**: Grid de 10 columnas
- **Tablet**: Grid automático adaptativo
- **Móvil**: Grid optimizado para pantallas pequeñas

## 🔧 Personalización

### Cambiar cantidad de números
En `script.js`, línea 7:
```javascript
const TOTAL_NUMBERS = 90; // Cambia este número
```

### Cambiar colores
En `styles.css`, busca los gradientes y edita los valores hex:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📥 Exportar a Imagen

La función exporta un PNG con:
- Título y fecha
- Todos los números en grid
- Números marcados con gradiente rosa
- Checkmark ✓ en números seleccionados
- Información del conteo total

## ⚙️ Funciones Principales

| Función | Descripción |
|---------|------------|
| `init()` | Inicializa la aplicación |
| `createGrid()` | Crea los números 1-90 |
| `toggleNumber()` | Marca/desmarca un número |
| `exportAsImage()` | Descarga PNG |
| `saveToLocalStorage()` | Guarda en navegador |
| `loadFromLocalStorage()` | Restaura datos guardados |

## 🌐 Compatibilidad

✅ Chrome/Edge (v60+)
✅ Firefox (v55+)
✅ Safari (v11+)
✅ Opera (v47+)
✅ Todos los navegadores modernos

## 📝 Notas

- Los datos se guardan solo en el navegador actual
- Limpiar caché/cookies borrará los datos guardados
- La exportación requiere soporte de Canvas (disponible en todos los navegadores modernos)

## 🎉 Disfruta!

Creado con ❤️ para hacer más fácil y divertido el proceso de marcar números en tu sorteo o rifa.

---

**Versión**: 2.0.0  
**Última actualización**: Septiembre 2026  
**Licencia**: MIT
