function onload(){
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //create a plot
    var plot = graphio.defaultPlot();
    plot.axis = {
        x:{min:0,max:8,gridlines:0.5,numbered:true},
        y:{min:-1.5,max:1.5,gridlines:0.1,numbered:true},
        autorange:false
    };

    //create datasets
    for(var j = 0; j<5; j++){
        var samples = [];
        for(var i = 0; i<8; i+=0.01){
            samples.push(Math.sin(i)+Math.random()/5+Math.sin(10*i)/4);
        }
        var points = graphio.arrayToPoints(samples,0,0.01);
        graphio.addDataset('sinSamples'+j,points);
        plot.datasets.push('sinSamples'+j);
    }

    //draw everything
    graphio.plots.push(plot);
    graphio.draw();
}