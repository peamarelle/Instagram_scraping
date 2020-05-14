const express = require('express');
const app = express();
const request = require('request');
const bodyPaser = require('body-parser');

let path,
count=1,
end_cursor,
pre_end_cursor;

//middlewares
app.use(express.urlencoded({extended: false}));

//router
app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/send', (req,res) => {
  path = req.body.url;
  res.send(`Se esta ejecutando el programa...`)

  resolucion_v2(path);
});

//starting server
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

function resolucion_v2(path) {
  request(path, function(err, res, body) {
      let edges = getEdges(body);
      mostrarDatos(edges);
      if (hasNextPage(body)) {
          if(end_cursor!="undefine"){
            pre_end_cursor = end_cursor;
          }
          resolucion_v2(generarUrl(path, body, pre_end_cursor));
      } else {
          console.log('FIN');
      }
  })
}




//declaracion de funciones
let mostrarDatos = edges => {
  edges.forEach(element => {
      console.log(`********Usuario ${count++}********`);
      console.log(`User name: ${element.node.username}`);
      console.log(`Full Name: ${element.node.full_name}`);
      console.log(`Is Private: ${element.node.is_private}`);
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