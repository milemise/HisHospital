const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.isAuthenticated = false; 
    res.locals.user = null; 
    res.locals.success = [];
    res.locals.error = [];   
    next();
});

app.get('/', (req, res) => {
  console.log('Renderizando inicio.pug desde:', path.join(__dirname, 'views', 'inicio.pug'));
  res.render('inicio', { title: 'Inicio Debug' });
});

app.listen(3001, () => console.log('Servidor debug en http://localhost:3001'));