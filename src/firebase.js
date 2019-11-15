import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCgY2rZnTc2cqprHOYkhIcl8F2CAj8PnJs",
    authDomain: "nba-fs-79795.firebaseapp.com",
    databaseURL: "https://nba-fs-79795.firebaseio.com",
    projectId: "nba-fs-79795",
    storageBucket: "nba-fs-79795.appspot.com",
    messagingSenderId: "144062154480",
    appId: "1:144062154480:web:f57b6417526115cecca435"
};

firebase.initializeApp(firebaseConfig);

const firebaseDB = firebase.database();
const firebaseArticles = firebaseDB.ref('articles');
const firebaseTeams = firebaseDB.ref('teams');
const firebaseVideos = firebaseDB.ref('videos');

const firebaseLooper = (snapshot) => {
    const data = [];

    snapshot.forEach((childSnapshot) => {
        data.push({
            ...childSnapshot.val(),
            id: childSnapshot.key
        })
    })

    return data;
}

export {
    firebase,
    firebaseDB,
    firebaseArticles,
    firebaseTeams,
    firebaseVideos,
    firebaseLooper
}