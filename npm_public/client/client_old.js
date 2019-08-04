var graphio = {}
//graphio.processors = [];    //{priority:0, input:'dataset', output:'dataset', process:(input)=>{ return output.data}}
graphio.plots = [
    /*{
        name:'test', 
        canvas:{
            id: 'canvas',
            ref: false,
            ctx: false
        }, 
        position: {
            mode:'center',
            x:0.5,
            y:0.5, 
            width:0.7, 
            height:0.7
        },
        axis:{
            x:{max:50,min:0,gridlines:10,numbered:true},
            y:{max:50,min:0,gridlines:20,numbered:true},
            autorange:true  //TODO NYI
        },
        draw:[
            {datasetID: 'test', style:'.', color:'#123456', dim:{x:'x',y:'y',z:'z'}},        //style: matlab plot style string
            {datasetID: 'test2', style:'-', color:'#123456'},                               
        ],
        colors:[]   //defalt colours to use if a dataset has no assigned color, (graphio.defaultColors() are assigned by default)
    }*/
];

graphio.defaultPlot = ()=>({
    name:'unnamed', 
    canvas:{
        id: 'canvas',
        ref: false,
        ctx: false
    }, 
    position: {
        mode:'center',
        x:0.5,
        y:0.5, 
        width:0.7, 
        height:0.7
    },
    axis:{
        x:{max:0,min:0,gridlines:10,numbered:true},
        y:{max:0,min:0,gridlines:10,numbered:true},
        autorange:true
    },
    draw:[]
});

graphio.defaultColors = ()=>({
    border:'#000',  //black
    gridx:'#888',   //grey
    gridy:'#888',   //grey
    datasets:[      //matlab default graph colors
        '#0072BD',
        '#D75319',
        '#EDB120',
        '#7E2F8E',
        '#77AC30',
        '#4DBEEE',
        '#A2142F'
    ]
});


graphio.assignDataset=(plot, datasetID,style='-',color=false,dim={x:'x',y:'y',z:'z'})=> {
    plot.draw.push({
        datasetID,style,color,dim
    });
}

graphio.datasets = {
    /*test: {label:'test', dim:'',limit:-1,data:[           //dim(entions): 2, 3
        {x:0,y:14},                              Tan
        {x:10,y:100},                                       //  >  2 - [{x,y},{x,y}]   
        {x:20,y:66},                                        //  >  3 - [{x,y,z},{x,y,z}]    
        {x:30,y:110},
        {x:40,y:0},
        {x:50,y:61},
        {x:60,y:7},
        {x:70,y:124}
    ]},
    test2: {label:'test2',limit:-1,data:[
        {x:70,y:14},
        {x:60,y:100},
        {x:50,y:66},
        {x:40,y:110},
        {x:30,y:42},
        {x:20,y:61},
        {x:10,y:7},
        {x:0,y:126}
    ]}*/
};

graphio.getPlot = (name) => {
    var ret = null;
    graphio.plots.forEach((plot)=>{
        if(name == plot.name) ret = plot;
    });
    return ret;
}

graphio.arrayToPoints1D = (array=[],offset=0,step=1,switchxy=false,proc=false)=>{
    var points = [];
    array.forEach((a)=>{
        var cur = offset;
        if(proc) cur = proc(cur);
        if(switchxy){
            points.push({x:a,y:cur});
        }else{
            points.push({x:cur,y:a});
        }
        offset+=step;
    });
    return points;
}

graphio.addDataset=(id,data,dim=2,label=id,limit=-1)=>{
    if(graphio.datasets[id]) throw 'id taken';
    if(dim<2 || dim>3) throw 'dim out of range!'
    graphio.datasets[id] = {
        label,limit,data,dim
    };
}

graphio.connect = (socket)=>{
    socket.on('graphio.update', (updateInfo)=>{
        console.log('got update!  '+updateInfo);
    });
}

graphio.draw = ()=>{
    var c,col,cw,ch,px,py,pw,ph,gx,gy,rx,ry;
    graphio.plots.forEach(plot=>{
        //check ref's & colors
        if(!plot.canvas.ref) plot.canvas.ref = document.getElementById(plot.canvas.id);
        if(!plot.canvas.ctx) plot.canvas.ctx = plot.canvas.ref.getContext('2d');
        if(!plot.colors) plot.colors = graphio.defaultColors();

        //get info & context
        c  = plot.canvas.ctx;
        col= plot.colors;
        cw = plot.canvas.ref.width;
        ch = plot.canvas.ref.height;
        px = plot.position.x,
        py = plot.position.y,
        pw = plot.position.width,
        ph = plot.position.height,
        gx = plot.axis.x.gridlines,
        gy = plot.axis.y.gridlines;

        /*TODO AUTORANGING //autorange if enabled
        if(plot.axis.autorange){
            plot.draw.forEach((datasetInfo,datasetIndex)=>{
                var set = graphio.datasets[datasetInfo.datasetID];

                if(set.data.length>0){
                    if(set.info){
                        if(set.info.x.max>plot.axis.x.max) plot.axis.x.max = set.info.x.max;
                        if(set.info.x.min<plot.axis.x.min) plot.axis.x.min = set.info.x.min;
                        if(set.info.y.max>plot.axis.y.max) plot.axis.y.max = set.info.y.max;
                        if(set.info.y.min<plot.axis.y.min) plot.axis.y.min = set.info.y.min;
                    } else {
                        var info={
                            x:{min: set.data[0].x, max:set.data[0].x},
                            y:{min: set.data[0].y, max:set.data[0].y}
                        }
                        set.data.forEach(point=>{
                            if(point.x>plot.axis.x.max) plot.axis.x.max = point.x;
                            if(point.x<plot.axis.x.min) plot.axis.x.min = point.x;
        
                            if(point.y>plot.axis.y.max) plot.axis.y.max = point.y;
                            if(point.y<plot.axis.y.min) plot.axis.y.min = point.y;

                            if(point.x>info.x.max) info.x.max = point.x;
                            if(point.x<info.x.min) info.x.min = point.x;
        
                            if(point.y>info.y.max) info.y.max = point.y;
                            if(point.y<info.y.min) info.y.min = point.y;
                        });
                        set['info'] = info;
                    }
                }
                
                
            });
        }*/

        rx = plot.axis.x.max - plot.axis.x.min;
        ry = plot.axis.y.max - plot.axis.y.min; 
        
        //convert plotsizes to pixels if given as fractions
        if(px<=1) px*=cw;   //TODO add properties to tell if fractional or not
        if(py<=1) py*=ch;
        if(pw<=1) pw*=cw;
        if(ph<=1) ph*=ch;
        
        //convert gridline spacings to fractional
        gx/=rx;    //TODO add properties to tell if fractional or not
        gy/=ry;
        
        //shift to topLeft positioning
        switch(plot.position.mode){   //TODO add more posmodes
            case 'center':
                px-=pw/2;
                py-=ph/2;
                break;
            case 'topLeft':
                //already good to go
        }

        //clear graph area
        c.beginPath();
        c.rect(px,py,pw,ph);
        c.strokeStyle = '#FFF';
        c.stroke();

        //draw gridlines
        c.beginPath();
        for(var x = 0; x<=1; x+=gx){
            c.moveTo(x*pw+px,py);
            c.lineTo(x*pw+px,py+ph);
            if(plot.axis.x.numbered){
                c.font = '10px Arial';
                c.textAlign = 'center';
                c.fillText(Math.round((x*rx+plot.axis.x.min)*1000)/1000, x*pw+px,py+ph+10, gx*pw/2);
            }
        }
        c.strokeStyle = col.gridx;
        c.stroke();

        c.beginPath();
        for(var y = 1; y>0; y-=gy){
            c.moveTo(px,    y*ph+py);
            c.lineTo(px+pw, y*ph+py);
            if(plot.axis.y.numbered){
                c.font = '10px Arial';
                c.textAlign = 'right';
                c.fillText(Math.round(((1-y)*ry+plot.axis.y.min)*1000)/1000, px,y*ph+py, gx*pw/2);
            }
        }
        c.strokeStyle = col.gridy;
        c.stroke();

        //draw plot frame
        c.beginPath();
        c.rect(px,py,pw,ph);
        c.strokeStyle = col.border;
        c.stroke();

        //draw datasets
        plot.draw.forEach((datasetInfo,datasetIndex)=>{
            c.strokeStyle = graphio.datasets[datasetInfo.datasetID].col || datasetInfo.color || col.datasets[datasetIndex%col.datasets.length];
            c.beginPath();
            if(graphio.datasets[datasetInfo.datasetID].data.length>0){
                c.moveTo((graphio.datasets[datasetInfo.datasetID].data[0].x+plot.axis.x.min)/rx*pw+px,(1-(graphio.datasets[datasetInfo.datasetID].data[0].y-plot.axis.y.min)/ry)*ph+py);
            }
            graphio.datasets[datasetInfo.datasetID].data.forEach((point,pointIndex)=>{
                c.lineTo((point.x+plot.axis.x.min)/rx*pw+px,(1-(point.y-plot.axis.y.min)/ry)*ph+py);
            });
            c.stroke();
        });
    });
}