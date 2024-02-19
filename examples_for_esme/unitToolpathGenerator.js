function toolpathGenerator(position = [0,0, 0], initialRadius = 20, layerHeight = 2, nbLayers = 10, nbPointsInLayer = 10, radiusShapingParameter = []){
    
    
    let path = [];
    for (let i = 0; i < nbLayers; i++){
        for (let j = 0; j < nbPointsInLayer; j++){
            let angle = 2*pi/nbPointsInLayer;
            let x = position[0] + (initialRadius+radiusShapingParameter[j])*cos(angle*j);
            let y = initialRadius*sin(angle*j);
            let z = position[2] + i*layerHeight;
            path.push([x,y,z]);

        }
    }

    return path;
}