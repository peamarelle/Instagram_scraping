const express = require('express');
const app = express();
const request = require('request');

let end_cursor,
pre_end_cursor,
usuarios = [];

app.use(express.urlencoded({extended: false}));

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/send', (req,res) => {  
  let link_Inicial = req.body.url + '?__a=1';
  res.send(`Se esta ejecutando el programa...en Url: ${link_Inicial}`);
  resolucion(link_Inicial,usuarios);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

function resolucion_v2(path,listaDeUsuarios) {
  request(path, function(err, res, body) {
      let edges = getEdges(body);
      guardarDatos(edges,listaDeUsuarios);
      if (hasNextPage(body)) {
          if(end_cursor!="undefine") {
            pre_end_cursor = end_cursor;
          }
          resolucion_v2(generarUrl(path, body, pre_end_cursor),listaDeUsuarios);
      } else {
        mostrarDatos(listaDeUsuarios);
        console.log('FIN');
      }
  })
}

function mostrarDatos(listaDeUsuarios) {
    let count=1;
    listaDeUsuarios.forEach(element => {
      console.log(`********Usuario ${count++}********`);
      console.log(`User name: ${element.username}`);
      console.log(`Full Name: ${element.full_name}`);
      console.log(`Is Private: ${element.is_private}`);
  });
}

function getEnd_cursor(body) {
  return JSON.parse(body).data.shortcode_media.edge_liked_by.page_info.end_cursor;
}

function hasNextPage(body) {
  return JSON.parse(body).data.shortcode_media.edge_liked_by.page_info.has_next_page;
}

function getEdges(body) {
  return JSON.parse(body).data.shortcode_media.edge_liked_by.edges;
}

const generarUrl = (path, body, pre_end_cursor) => {
end_cursor = getEnd_cursor(body);
if(path.includes('"after":"')) {
    path = path.replace(pre_end_cursor, end_cursor);
}else {
    subcadena = ',"after":"'+ end_cursor +'"}';
    path = path.replace('}', subcadena);
}
return path;
}

const guardarDatos = (edges,listaDeUsuarios) => {
    edges.forEach(element => {
        listaDeUsuarios.push(element.node);
    });
}

function getShortcode(body) {
  return JSON.parse(body).graphql.shortcode_media.shortcode;
}

const resolucion = (link_Inicial,usuarios) => {
  request(link_Inicial, function(err, res, body) {
    shortcode = getShortcode(body);
    let path = queryHash(shortcode);
    resolucion_v2(path,usuarios);
  });
}

const queryHash = (shortcode) => {
  let values = {"shortcode":"","include_reel":true,"first":50};
  let urlInstagram = 'https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables=';
  values.shortcode = shortcode;
  return urlInstagram + JSON.stringify(values);
}