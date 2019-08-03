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

    //create datasets
    for(var j = -4; j<3; j++){
        var samples = [];
        for(var i = 0; i<8; i+=0.05){
            samples.push(Math.sin(i)+Math.sin(10*i)/5+Math.random()/10+j/10);
        }
        var points = graphio.tools.arrayToPoints1D(samples,0,0.05);
        graphio.addDataset('sinSamples'+j,points);
        graphio.assignDataset('sinSamples'+j, plot);// , style='--');
    }

    plot.draw[2].style = '--';
    plot.draw[3].style = '--';
    plot.draw[4].style = ':';
    plot.draw[5].style = '-.';

    //add plot
    console.log("Adding plot:",plot);
    graphio.addPlot(plot);

    //allow server connection (not required for clientside only things like above)
    graphio.connect(io());

    //draw everything
    graphio.draw();
}