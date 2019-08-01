"use strict";
const fs = require('fs');
var ioinit=false;

exports.init=(app)=>{
    app.get('/graphio',(req,res)=>{
        res.sendFile(__dirname+'/client/client.js');
    });
}

/*
Idea:
    take plots = [
        {canvas:'canvasId', posMode:'topLeft', posX:50%, posY:0, width:500px, height:100%, minx:0, maxx:100, miny:0, maxy:100, gridx:10, gridy:20}
    ];

    optional clientside/serverside data processing


*/