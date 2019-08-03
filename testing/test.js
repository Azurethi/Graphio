const graphio = require('../npm_public/index'); //require('graphio');
const app = require('express')();
const srv = require('http').Server(app);
const io = require('socket.io').listen(srv);

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/client/index.html');
});
app.get('/mainjs', (req,res)=>{
    res.sendFile(__dirname+'/client/main.js');
});

graphio.init(app, io);

srv.listen(80);

console.log("server started!");