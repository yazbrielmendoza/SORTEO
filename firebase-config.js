// ============================================
// CONFIGURACIÓN FIREBASE
// ============================================

// ⚠️ IMPORTANTE: Necesitas configurar Firebase
// 
// Pasos:
// 1. Ve a https://firebase.google.com/
// 2. Crea un nuevo proyecto gratuito
// 3. En "Realtime Database", crea una base de datos en modo "Iniciar en modo de prueba"
// 4. Copia tu configuración aquí desde Project Settings
// 5. Guarda y recarga esta página

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase (solo si está configurado)
let app, database;
let firebaseReady = false;

try {
    if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('TU_')) {
        app = firebase.initializeApp(firebaseConfig);
        database = firebase.database(app);
        firebaseReady = true;
        console.log('✅ Firebase conectado exitosamente');
    } else {
        console.warn('⚠️ Firebase no configurado. El sitio funcionará en modo local.');
        firebaseReady = false;
    }
} catch (error) {
    console.warn('⚠️ Error iniciando Firebase:', error);
    firebaseReady = false;
}

// Exportar para uso en script.js
window.firebaseReady = firebaseReady;
window.database = database;
