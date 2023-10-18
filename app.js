const express = require('express');
const { getApps, initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { getDocs, query } = require('firebase/firestore');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var firebaseConfig = {
    apiKey: "AIzaSyC13JX_QzJ_L-e35VwOuu11Z_7Y2rUYKl0",
    authDomain: "autenticacao-51378.firebaseapp.com",
    projectId: "autenticacao-51378",
    storageBucket: "autenticacao-51378.appspot.com",
    messagingSenderId: "996517295927",
    appId: "1:996517295927:web:f0a6fbc030379ac5070cb2"
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.post('/login', async (req, res) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        console.log('Usuário autenticado:', userCredential.user.uid);

        res.redirect('/cadastro');
    } catch (error) {
        console.error('Erro de autenticação:', error.message);
        res.send('Erro de autenticação: ' + error.message);
    }
});


app.post('/cadastro', async (req, res) => {
    try {
        const jogador = {
            nome: req.body.nome,
            idade: req.body.idade,
            posicao: req.body.posicao,
            clube: req.body.clube
        };

        const docRef = await addDoc(collection(db, 'jogadores'), jogador);
        console.log('Jogador cadastrado com ID: ', docRef.id);

        res.redirect('/home');
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/cadastro', (req, res) => {
    const user = auth.currentUser;
    console.log(user);
    if (user) {
        res.render('cadastro', { user: user });
    } else {
        res.redirect('/');
    }
});

app.get('/home', async (req, res) => {
    const q = query(collection(db, 'jogadores'));
    const querySnapshot = await getDocs(q);
    const jogadores = querySnapshot.docs.map(doc => doc.data());
    res.render('home', { jogadores: jogadores });
});


app.listen(3000, () => console.log('Server started on port 3000'));
