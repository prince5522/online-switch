import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyCdenrSZAJj4MtMlIUvF6tk8gugbfgyTEM",

    authDomain:
        "online-switch-a5e69.firebaseapp.com",

    projectId:
        "online-switch-a5e69",

    storageBucket:
        "online-switch-a5e69.firebasestorage.app",

    messagingSenderId:
        "760582912767",

    appId:
        "1:760582912767:web:e5359ccbda3661132beaca",

    measurementId:
        "G-DJE99GM7XK"

};


const app =
    initializeApp(
        firebaseConfig
    );


export {
    app
};