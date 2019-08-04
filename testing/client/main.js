function onload(){
    //fullscreen canvas
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    //create a plot
    var plot = graphio.createPlot();
    plot.colors.background = '#FEFEFE';
    plot.position.width = 0.9;
    plot.position.height = 0.9;
    plot.axis = {
        x:{min:0,max:8,gridlines:0.5,numbered:true},
        y:{min:-3,max:3,gridlines:0.1,numbered:true},
        autorange:false
    };
    
    graphio.assignDataset('sinSamples2',plot);
    graphio.assignDataset('sinSamples1',plot);
    graphio.assignDataset('sinSamples0',plot);
    graphio.assignDataset('sinSamples-1',plot);
    graphio.assignDataset('sinSamples-2',plot);
    graphio.assignDataset('sinSamples-3',plot);
    graphio.assignDataset('sinSamples-4',plot);
    
    //add plot
    console.log("Adding plot:",plot);
    graphio.addPlot(plot);

    //allow server connection (not required for clientside only things like above)
    graphio.connect(io());

    //draw everything       No need since the server will send the draw command after the datasets!
    //graphio.draw();
}