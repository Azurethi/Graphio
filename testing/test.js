const graphio = require('../npm_public/index'); //require('graphio');
const app = require('express')();
//const server = require('http').Server(app);

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/client/index.html');
});
app.get('/mainjs', (req,res)=>{
    res.sendFile(__dirname+'/client/main.js');
});

graphio.init(app);

app.listen(80);

console.log("server started!");