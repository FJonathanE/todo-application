const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());

app.get('/api/randomuuid', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    const { v4: uuidv4} = require('uuid');
    res.send('' + uuidv4());    
});

app.get('/todo', (req, res) => {
    res.render('todo');
});

app.get('/', (req, res) => {
    res.redirect('/todo');
});


// \/----------------- Have to be last -------------------\/
app.use((req, res, next) => {
    res.render('404', {res: res});
});

app.listen(port, () => {
    console.log('Listening on port ' + port + '...');
});
// /\----------------- Have to be last -------------------/\

