"use strict";
var clients = [];
exports.init=(app,io)=>{
    app.get('/graphio',(req,res)=>{
        res.sendFile(__dirname+'/client/client.js');
    });
    
    io.on('connection',(soc)=>{
        //console.log('Graphio: Connected!');
        soc.on('gio.register', ()=>{
            datasetsSetup.forEach(setup=>{
                soc.emit('gio.dataset.new',setup);
            });
            Object.keys(datasetBuffer).forEach(setID=>{
                soc.emit('gio.dataset.all',datasetBuffer[setID]);
            })
            soc.emit('gio.draw');
            clients.push(soc);
        });
    });
}


//TODO better interface for node server
var datasetIDs = [];
var datasetsSetup = [];
var datasetBuffer = {};
exports.newDataset = (id, limit=-1, dim=2,label=id,data=[]) =>{
    if(datasetIDs.includes(id)) throw 'id already in use.';
    datasetIDs.push(id);
    datasetsSetup.push({id,limit,dim,label,data});
    clients.forEach(soc=>{
        soc.emit('gio.dataset.new',{id,limit,dim,label,data});
    });
}
exports.redraw = () =>{
    clients.forEach(soc=>{
        soc.emit('gio.draw');
    });
}
exports.sendPoints = (id, points)=>{
    if(!datasetIDs.includes(id)) throw 'no set with that id';
    datasetBuffer[id] = {datasetID:id, points};
    clients.forEach(soc=>{
        soc.emit('gio.dataset.all', datasetBuffer[id]);
    });
}

exports.sendPoint = (id, point, pos=false)=>{
    if(!datasetIDs.includes(id)) throw 'no set with that id';
    clients.forEach(soc=>{
        soc.emit('gio.dataset.single', {datasetID:id, point,pos});
    });
}