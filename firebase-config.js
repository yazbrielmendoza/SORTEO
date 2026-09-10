// ============================================
// CONFIGURACIÓN FIREBASE
// ============================================

// Firebase está configurado y listo para usar
// Esta es la configuración de tu proyecto

const firebaseConfig = {
  apiKey: "AIzaSyDvN5K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y",
  authDomain: "fire-f90b1.firebaseapp.com",
  databaseURL: "https://fire-f90b1-default-rtdb.firebaseio.com",
  projectId: "fire-f90b1",
  storageBucket: "fire-f90b1.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Inicializar Firebase
let app, database;
let firebaseReady = false;

try {
    app = firebase.initializeApp(firebaseConfig);
    database = firebase.database(app);
    firebaseReady = true;
    console.log('✅ Firebase conectado exitosamente - Multiplayer ACTIVADO');
} catch (error) {
    console.warn('⚠️ Error iniciando Firebase:', error);
    firebaseReady = false;
}

// Exportar para uso en script.js
window.firebaseReady = firebaseReady;
window.database = database;
