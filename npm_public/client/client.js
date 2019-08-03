/* Overview:
 *  TODO's:
 *      tidy start of draw function
 *      lots of validation
 *      method return's for errors & info
 *      more throws on stuid mistakes!
 *      optimise validation (validation flag = true, untill object reference requested?)
 *      customised draw functions (seperate from default)   [draw, customdraw].foreach()
 */

var graphio = (()=>{
    var plots = [];
    var datasets = {};

    var draw={///TODO add more draw helper functions?
        //Line types
        '-':(plot)=>{
            plot.canvas.ctx.beginPath();
            var firstPoint = true;
            return{
                point:(conVals)=>{
                    if(firstPoint){
                        plot.canvas.ctx.moveTo(conVals.x, conVals.y);
                        firstPoint = false;
                    } else {
                        plot.canvas.ctx.lineTo(conVals.x, conVals.y);
                    }
                },
                final:()=>{
                    plot.canvas.ctx.stroke();
                }
            };
        },
        'x':(plot)=>(
            {
                point:(c)=>{
                    plot.canvas.ctx.beginPath();
                    plot.canvas.ctx.moveTo(c.x+4,c.y+4);
                    plot.canvas.ctx.lineTo(c.x-4,c.y-4);
                    plot.canvas.ctx.moveTo(c.x-4,c.y+4);
                    plot.canvas.ctx.lineTo(c.x+4,c.y-4);
                    plot.canvas.ctx.stroke();
                },
                final:false,init:false
            }
        ),
    };

    //may need to define fun before setting fun!
    var fun = {
        
        //Defaults
        default:{
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
            draw:[],
            colors:{
                background:'#FFF',
                border:'#000',  //black
                gridx:'#888',   //grey
                gridy:'#888',   //grey
                datasets:[      //matlab default graph colors
                    '#0072BD','#D75319','#EDB120','#7E2F8E','#77AC30','#4DBEEE','#A2142F'
                ]
            }
        },

        //Plot management
        createPlot:(name=fun.default.name,canvasID=fun.default.canvas.id,position=fun.default.position,axis=fun.default.axis)=>{
            //TODO validation
            return {name,canvas:{id: canvasID,ref: false,ctx: false}, position,axis,draw:[], colors:fun.default.colors}
        },
        addPlot:(plot)=>{
            //TODO more validation
            if(!plot.canvas.ref) plot.canvas.ref = document.getElementById(plot.canvas.id);
            if(!plot.canvas.ctx) plot.canvas.ctx = plot.canvas.ref.getContext('2d');
            if(!plot.colors) plot.colors = fun.default.colors;
            plots.push(plot);
        },
        getPlot:(plotName)=>{
            plots.forEach(plot=>{
                if(plot.name==plotName) return plot;
            });
            return null;
        },
        removePlot:(plotName)=>{
            var removed = 0;
            var edit = plots.filter(plot=>{
                if(plot.name==plotName){
                    removed++;
                    return false
                }
                return true;
            });
            plots = edit;
            return removed;
        },
        
        //Datasets/Plots
        assignDataset:(datasetID,plot,style='-',color=false,dim={x:'x',y:'y'})=> {
            //TODO validation
            plot.draw.push({datasetID,style,color,dim});
        },
        unassignDataset:(datasetID,plot='*')=>{
            if(plot=='*'){
                var totrem = 0;
                plots.forEach(plot=>{
                    totrem += fun.tools.removeif(plot.draw, (i)=>(i.datasetID==datasetID));
                });
                return totrem;
            } else {
                var plot;
                if(plot = fun.getPlot(plot)){
                    return fun.tools.removeif(plot.draw, (i)=>(i.datasetID==datasetID));
                }
            }
            return false;
        },

        //Dataset managment
        addDataset:(id,data,dim=2,label=id,limit=-1)=>{
            if(datasets[id]) throw 'id taken';
            if(dim<2 || dim>3) throw 'dim out of range!'
            //TODO more validation
            datasets[id] = {
                label,limit,data,dim
            };
        },
        getDataset:(id)=>(datasets[id]),
        removeDataset:(id)=>{
            //TODO check if dataset is assigned to any plots
            if(datasets[id]) delete datasets[id];
        },
        
        //Tools
        tools:{
            removeif:(editable,condition)=>{
                var removed = 0;
                editable = editable.filter((i)=>{
                    if(condition(i)){
                        removed++;
                        return false;
                    }
                    return true;
                });
            },
            arrayToPoints1D:(array=[],offset=0,step=1,switchxy=false,proc=false)=>{
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
            },
            autorange:(plot) => {
                //TODO implement
            },
            polyPoints:(num,radius,offsets={x:0,y:0})=>{
                var ret = [];
                for(var t = 0; t<Math.PI*2; t+=Math.PI*2/num){
                    ret.push({
                        x:radius*Math.cos(t) + offsets.x,
                        y:radius*Math.sin(t) + offsets.y
                    });
                }
                return ret;
            }
        },

        //autorange all or specific plot using tool above ^
        autorange:(plot='*')=>{
            if(plot=='*'){
                plots.forEach(plot=>{fun.tools.autorange(plot)});
            } else {
                fun.tools.autorange(plot);
            }
        },
        
        //DRAW!!!!!
        draw:()=>{
            var c,col,cw,ch,px,py,pw,ph,gx,gy,drawkeys=Object.keys(draw);    //temp vars
            plots.forEach(plot=>{
                //setup temp vars
                (()=>{
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
                })();//TODO remove tidying thing

                //convert plotsizes to pixels if given as fractions
                if(px<=1)px*=cw;    if(py<=1)py*=ch;    if(pw<=1)pw*=cw;    if(ph<=1)ph*=ch;

                //convert gridline spacings to fractional
                gx/=plot.axis.x.max-plot.axis.x.min;
                gy/=plot.axis.y.max-plot.axis.y.min;    

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
                c.fillStyle = plot.colors.background;
                c.fill();
                c.fillStyle = plot.colors.border;

                //draw x gridlines
                c.beginPath();
                for(var x = 0; x<=1; x+=gx){
                    c.moveTo(x*pw+px,py);
                    c.lineTo(x*pw+px,py+ph);
                    if(plot.axis.x.numbered){
                        c.font = '10px Arial';
                        c.textAlign = 'center';
                        c.fillText(Math.round((x*(plot.axis.x.max-plot.axis.x.min)+plot.axis.x.min)*1000)/1000, x*pw+px,py+ph+10, gx*pw/2);
                    }
                }
                c.strokeStyle = col.gridx;
                c.stroke();

                //draw y gridlines
                c.beginPath();
                for(var y = 1; y>0; y-=gy){
                    c.moveTo(px,    y*ph+py);
                    c.lineTo(px+pw, y*ph+py);
                    if(plot.axis.y.numbered){
                        c.font = '10px Arial';
                        c.textAlign = 'right';
                        c.fillText(Math.round(((1-y)*(plot.axis.y.max-plot.axis.y.min)+plot.axis.y.min)*1000)/1000, px,y*ph+py, gx*pw/2);
                    }
                }
                c.strokeStyle = col.gridy;
                c.stroke();

                //draw plot frame
                c.beginPath();
                c.rect(px,py,pw,ph);
                c.strokeStyle = col.border;
                c.stroke();

                //TODO nicer solution
                var canvasAxis = {
                    'x':{range:pw,offset:px},
                    'y':{range:ph,offset:py},
                }

                //draw datasets
                plot.draw.forEach((datasetInfo,datasetIndex)=>{
                    plot.canvas.ctx.strokeStyle = datasetInfo.color || datasets[datasetInfo.datasetID].col || col.datasets[datasetIndex%col.datasets.length];
                    var style = datasetInfo.style.slice(0);
                    var dim = datasetInfo.dim;
                    var dimkeys = Object.keys(dim);
                    drawkeys.forEach(styleIdent=>{  //TODO optional heatmapdraw
                        if(style.includes(styleIdent)){
                            style = style.replace(styleIdent,'');
                            var drawHelper = draw[styleIdent](plot, datasetIndex);
                            datasets[datasetInfo.datasetID].data.forEach(point => {
                                var pointInside = true;
                                var convertedValues = {};
                                dimkeys.forEach(dimkey=>{
                                    if(point[dim[dimkey]] < plot.axis[dimkey].min || point[dim[dimkey]]>plot.axis[dimkey].max){
                                        pointInside = false;
                                    } else if(canvasAxis[dimkey]){
                                        convertedValues[dim[dimkey]] = (point[dim[dimkey]] - plot.axis[dimkey].min)/(plot.axis[dimkey].max-plot.axis[dimkey].min)*canvasAxis[dimkey].range + canvasAxis[dimkey].offset;
                                    }
                                });
                                if(pointInside) drawHelper.point(convertedValues,point);
                            });
                            if(drawHelper.final)drawHelper.final();
                        }
                    });
                });

            });
        },

        //Server connection
        connect:(socket)=>{
            //TODO imp.
            socket.on('graphio.update', (updateInfo)=>{
                console.log('got update!  '+updateInfo);
            });
        },

        //TODO remove?
        debug:()=>{
            console.log('plots: ',plots);
            console.log('datasets: ',datasets);
        }
    };
    return fun;
})();