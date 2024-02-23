function test() {
  console.log('Hello from test()');
    let path = [];
    let nbPoints= 5;
    let nbLayers = 6;
    let layerHeight = 2;
    let radius = 100;
    for (let j = 0; j < nbLayers; j++){
        for (let i = 0; i < nbPoints; i++){
            let angle = i*2*Math.PI/nbPoints;
            path.push(radius*Math.cos(angle), radius*Math.sin(angle), j*layerHeight);
        }
    }
    updatePath(path);
}