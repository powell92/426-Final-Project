const firebaseConfig = {
    apiKey: "AIzaSyC_rtvNF2jssMvpK0PZD9mkVIqujyY3PJ0",
    authDomain: "comp-426-sp21-project.firebaseapp.com",
    databaseURL: "https://comp-426-sp21-project-default-rtdb.firebaseio.com",
    projectId: "comp-426-sp21-project",
    storageBucket: "comp-426-sp21-project.appspot.com",
    messagingSenderId: "252331375817",
    appId: "1:252331375817:web:dc2e040cb284c9abd1e118",
    measurementId: "G-LBF4X995R1"
};

let db = firebase.initializeApp(firebaseConfig)

export function centralDataBase () {
    return db;
}