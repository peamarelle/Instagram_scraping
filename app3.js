const express = require('express');
const app = express();
const request = require('request');
const bodyPaser = require('body-parser');
let path,
    count = 1;

//middlewares
app.use(express.urlencoded({ extended: false }));

//router
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send', (req, res) => {
    path = req.body.url;

    resolucion_v2(path);

    // resolucion(path)
    //   .then(obj => {
    //     return resolucion('https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={"shortcode":"B_8ORfzJjkT","include_reel":true,"first":50,"after":"QVFBWDdVb3VxUExQbkNMdUQ3RmVGdGpsMDlhaF9YaFFjY2tIVnBSTnZPc2ZMS1pOQVNYbHBvU3RsQzUwUTBvanhSaTJkZHp4TVdDRmI3M05qbnlQbm5LdA=="}');
    //   })
    //   .then(obj => {
    //     return resolucion('https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={"shortcode":"B_8ORfzJjkT","include_reel":true,"first":50,"after":"QVFDaGk5eEUxWlBhMGVTSktoSzlEdEtEc3hBUHc2elF0TFA5eVRtMHlONml0cUV4ejJFT2p2djRDV19MekZTRndKWk9XQUpzaEkzcHFiVG1BXzR3TVkyaQ=="}');
    //   })
    //   .then(obj => {
    //     return resolucion('https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={"shortcode":"B_8ORfzJjkT","include_reel":true,"first":50,"after":"QVFBa25oWGFVNWdIcmRiLTBuakxNYzZBaEpqU3RCZHZJZ3dMc01zUnBUWm90VEw4QXZYQkRKS25rdjIxcFJ3X28xZFVwNGJybzFkdnAyek1leFVweVljbQ=="}');
    //   })
    //   .then(obj => {
    //     return resolucion('https://www.instagram.com/graphql/query/?query_hash=d5d763b1e2acf209d62d22d184488e57&variables={"shortcode":"B_8ORfzJjkT","include_reel":true,"first":50,"after":"QVFETWgwdHVJM1gyaFcyTEFpa1g3cGt2MkFycFBkWGxaOGNGY1ZBSUJPbUFBamdwUXlEWnd1bEVYSW1nZFE3dVdrOXZlUVlSWVJIeXh5X000aDdoRWYweg=="}');
    //   })
    //   .catch(err => console.log(err))
});

//starting server
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

//Promise
const resolucion = path => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(
                request(path, function(error, response, body) {
                    let edges = getEdges(body);
                    mostrarDatos(edges);
                    let end_cursor = getEnd_cursor(body);
                })
            )
        }, 0 | Math.random * 100);
    })
}

function resolucion_v2(path) {
    request(path, function(err, res, body) {
        let edges = getEdges(body);
        mostrarDatos(edges);
        if (hasNextPage(body)) {
            resolucion(getEnd_cursor(body))
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

/*
const generarUrl = (path, end_cursor, pre_end_cursor) => {
  if(path.includes('"after":"')) {
    subcadena = '"after":"'+ end_cursor +'"';
    path = path.replace('"after":""', subcadena);
  }else {
    path = path.replace(pre_end_cursor, end_cursor);
  }
  return path;
}
*/

/*const getHas_next = body => {
  return has_next = JSON.parse(body).data.shortcode_media.edge_liked_by.page_info.has_next_page;
}
const getLikes = body => {
  return likes = JSON.parse(body).data.shortcode_media.edge_liked_by.count;
}*/