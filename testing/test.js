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

//create datasets
for(var j = -4; j<3; j++){
    var samples = [];
    for(var i = 0; i<8; i+=0.05){
        samples.push({x:i,y:Math.sin(i)+Math.sin(10*i)/5+Math.random()/10+j/10});
    }
    graphio.newDataset('sinSamples'+j, Math.floor(8/0.05));
    graphio.sendPoints('sinSamples'+j, samples);
}

var i = 0;
var p = 0;
setInterval(()=>{
    var point = {x:i, y:Math.sin(i)+Math.sin(10*i)/5+Math.random()/10};
    i+=0.05;
    p++;
    if(Math.round(i)>=8){
        i = 0;
        p = 0;
    } 
    graphio.sendPoint('sinSamples0', point, p); 
},10);
setInterval(graphio.redraw,20);

srv.listen(80);

console.log("server started!");