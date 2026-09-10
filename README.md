# 🎰 SORTEO - Marcador Interactivo de Números en Vivo

Una aplicación web moderna y responsiva para marcar números ganadores en rifas y sorteos **con soporte multiplayer en tiempo real**. 

## ✨ Características Principales

### 🎪 Funcionalidades Interactivas
- ✅ **Grid interactivo de 90 números** - Click para marcar/desmarcar
- ✅ **Modo En Vivo (Multiplayer)** - Sincronización en tiempo real con Firebase
- ✅ **Código de Sesión Único** - Comparte el link para que otros se unan
- ✅ **Contador de Participantes** - Ve quién está marcando en vivo
- ✅ **Guardado Automático** - LocalStorage para persistencia local
- ✅ **Exportación PNG** - Descarga una imagen de tu selección

### 🎨 Diseño Profesional
- Gradientes modernos (púrpura, azul, rosa)
- Animaciones fluidas y efectos visuales
- Interfaz completamente responsiva (móvil, tablet, desktop)
- Indicador "En Vivo" con efecto pulse

### 🚀 Tecnologías
- **HTML5** - Estructura semántica
- **CSS3** - Grid, Flexbox, Animaciones
- **JavaScript Vanilla** - Sin dependencias
- **Firebase Realtime Database** - Sincronización en vivo
- **Canvas API** - Exportación de imágenes

---

## 🌐 Acceso Online

**Ya está disponible en:** https://yazbrielmendoza.github.io/SORTEO/

Abre el link en tu navegador y ¡comienza a usar!

---

## 🚀 Cómo Usar

### Opción 1: Online Directo (Modo Local) - SIN CONFIGURACIÓN
El sitio funciona automáticamente en modo local:
1. Abre: https://yazbrielmendoza.github.io/SORTEO/
2. ¡Comienza a marcar números!
3. Los números se guardan automáticamente en tu navegador

### Opción 2: Con Firebase (Multiplayer en Vivo) 🔴
Para habilitar el modo multiplayer donde varios jugadores ven los números en tiempo real:

#### Paso 1: Crear Proyecto Firebase
1. Ve a [Firebase Console](https://firebase.google.com/)
2. Crea un nuevo proyecto gratuito
3. En el menú izquierdo, ve a **Build > Realtime Database**
4. Crea una base de datos en modo **"Iniciar en modo de prueba"**

#### Paso 2: Obtener Configuración
1. Ve a **Project Settings** (ícono de rueda ⚙️)
2. En la sección **"Your apps"**, selecciona tu app web
3. Copia toda la configuración Firebase

#### Paso 3: Actualizar firebase-config.js
1. Clona o descarga este repositorio
2. Edita `firebase-config.js`
3. Reemplaza los valores con tu configuración:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "https://your-project-default-rtdb.firebaseio.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
4. Guarda y sube los cambios a tu repositorio

#### Paso 4: ¡Listo! 🎉
1. Recarga tu sitio GitHub Pages
2. Ahora el sitio funcionará en modo **En Vivo**
3. Comparte el código de sesión o el link con otros jugadores
4. ¡Verán tus números marcados en tiempo real!

---

## 📋 Guía Rápida

### Para Marcar Números
- Haz **click en cualquier número** para marcarlo
- Vuelve a **click para desmarcar**
- Los números se guardan automáticamente

### Botones de Control
| Botón | Función |
|-------|---------|
| 🔄 **Reiniciar** | Borra todos tus números marcados |
| 📥 **Descargar** | Descarga una imagen PNG de tu selección |
| 📋 **Copiar** | Copia el link de la sesión para compartir |

### Modo Multiplayer (con Firebase)
- **Código de Sesión** - Código único para esta ronda (ej: ABC123)
- **Participantes** - Número de jugadores en línea
- **Indicador En Vivo** - Punto verde parpadeante

---

## 💾 Persistencia de Datos

### Modo Local (sin Firebase)
- Los números se guardan en **LocalStorage** del navegador
- Se mantienen aunque recargues la página
- Se pierden si limpias el cache/cookies

### Modo Multiplayer (con Firebase)
- Los números se sincronizan en la **nube en tiempo real**
- Todos los jugadores ven cambios instantáneamente
- Persisten mientras la sesión esté activa

---

## 🎨 Paleta de Colores

| Elemento | Colores | Uso |
|----------|---------|-----|
| Primario | Gradiente #667eea → #764ba2 | Header, números no marcados |
| Secundario | Gradiente #f093fb → #f5576c | Números marcados, botones |
| Acentos | #43e97b (verde) | Indicador "En Vivo", contador |
| Fondos | #f8f9fa | Secciones alternas |

---

## 📱 Responsividad

La app se adapta automáticamente:
- **Escritorio (>768px):** Grid de 10 columnas
- **Tablet (768px):** Grid adaptativo
- **Móvil (<480px):** Grid de 5-6 columnas, botones apilados

---

## ⚙️ Configuración Avanzada

### Cambiar Cantidad de Números
En `script.js`, línea 7:
```javascript
const TOTAL_NUMBERS = 90; // Cambia este número
```

### Cambiar Colores
En `styles.css`, busca los gradientes y edita los valores hex:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Personalizar Nombres
Los nombres se generan automáticamente, pero puedes cambiarlos editando `script.js`:
```javascript
let playerName = localStorage.getItem('playerName') || `Tu Nombre Aquí`;
```

---

## 📁 Archivos del Proyecto

```
SORTEO/
├── index.html           # Página principal HTML
├── styles.css           # Estilos CSS
├── script.js            # Lógica JavaScript
├── firebase-config.js   # Configuración Firebase (editable)
└── README.md           # Este archivo
```

---

## 🔒 Seguridad Firebase

Para producción, asegúrate de:
1. **No compartir tu API Key públicamente**
2. Configurar **reglas de seguridad** en Firebase:
   ```json
   {
     "rules": {
       "sessions": {
         "$sessionId": {
           ".read": true,
           ".write": true
         }
       }
     }
   }
   ```

---

## 📊 Estructura de Datos Firebase

```
sessions/
├── ABC123/
│   ├── players/
│   │   ├── player_123/
│   │   │   ├── name: "Jugador 1"
│   │   │   ├── joinedAt: timestamp
│   │   │   └── lastSeen: timestamp
│   │   └── player_456/...
│   └── markedNumbers/
│       ├── 1/
│       │   ├── player_123: { playerName, markedAt }
│       │   └── player_456: { playerName, markedAt }
│       └── 2/...
```

---

## 🐛 Troubleshooting

### "Firebase no configurado"
✅ El sitio funciona normalmente en modo local
- Si quieres activar multiplayer, edita `firebase-config.js` con tu configuración

### Los números no se sincronizan
- Verifica que `firebase-config.js` tenga valores válidos (sin "TU_")
- Comprueba que tu Realtime Database esté en modo "Prueba"
- Abre la consola del navegador (F12) para ver errores

### Los datos se pierden
- Modo local: Los datos se borran al limpiar cache
- Modo Firebase: Consulta la base de datos en Firebase Console

---

## 📄 Licencia

MIT - Libre para usar y modificar

---

## 👨‍💻 Desarrollado por

**yazbrielmendoza** - Septiembre 2026

---

## 💡 Próximas Mejoras

- [ ] Autenticación con Google/GitHub
- [ ] Historial de sorteos
- [ ] Estadísticas de participantes
- [ ] Temas oscuro/claro
- [ ] Notificaciones en tiempo real
- [ ] Exportación a PDF
- [ ] Números personalizados

---

## 🤝 Contribuir

Si encuentras algún problema o tienes sugerencias:
1. Abre un issue en GitHub
2. Proporciona detalles del problema
3. Sugiere mejoras

---

**¡Gracias por usar SORTEO! 🎉**

**Repositorio:** https://github.com/yazbrielmendoza/SORTEO

**Sitio en vivo:** https://yazbrielmendoza.github.io/SORTEO/
