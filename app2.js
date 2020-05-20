const express = require('express');
const app = express();
const resolucion = require('./scrap_module.js')
//const ejs = require('ejs');

let usuarios = [];
let users='<h1>***Likes 👍***</h1></br>';

//app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

//app.engine('html', ejs.renderFile);
//app.set('view engine','html');

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req,res) => { 
  let link_Inicial = req.body.url + '?__a=1';
  resolucion.resolucion(link_Inicial,usuarios)
  .then(obj=>{
    let count=1;
      setTimeout(() => {
      usuarios.forEach(element => {
        users+= `<h3>***Usuario ${count++}***</h3>`+ `<h3>Nombre de Usuario: ${element.username} | Nombre Completo: ${element.full_name} | Su cuenta es privada?: ${element.is_private}</h3>`;
      });
      res.send(users);
    }, 5000);
  })
  .catch(err=>{console.log(err)});
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});