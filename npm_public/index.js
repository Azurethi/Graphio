"use strict";
exports.init=(app,io)=>{
    app.get('/graphio',(req,res)=>{
        res.sendFile(__dirname+'/client/client.js');
    });
    
    io.on('connection',(soc)=>{
        console.log('Client Connected!');
        setInterval(()=>{soc.emit('graphio.update', {type:'ignore'})}, 100)
    });
}

/*
Idea:
    take plots = [
        {canvas:'canvasId', posMode:'topLeft', posX:50%, posY:0, width:500px, height:100%, minx:0, maxx:100, miny:0, maxy:100, gridx:10, gridy:20}
    ];

    optional clientside/serverside data processing


*/