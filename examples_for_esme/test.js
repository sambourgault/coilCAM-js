function test() {
    console.log('Hello from test()');
    let path = [];
    let nbPoints= 5;
    let nbLayers = 100;
    let layerHeight = 60;
    let radius = 100;
    for (let j = 0; j < nbLayers; j++){
        for (let i = 0; i < nbPoints; i++){
            let angle = i*2*Math.PI/nbPoints;
            path.push(radius*Math.cos(angle), radius*Math.sin(angle), j*layerHeight);
        }
    }
    console.log(path);
    updatePath(path);
}

function test() {
    console.log('Hello from test()');
    let path = [];
    let nbPoints= 3;
    let nbLayers = 2;
    let layerHeight = 6;
    let radius = 100;
    for (let j = 0; j < nbLayers; j++){
        for (let i = 0; i < nbPoints; i++){
            let angle = i*2*Math.PI/nbPoints;
            path.push(radius*Math.cos(angle), radius*Math.sin(angle), j*layerHeight);
        }
    }
    console.log(path);
    updatePath(path);
}