function toolpathUnitGenerator(position, initialRadius, layerHeight, nbLayers, nbPointsInLayer,
                              radiusShapingParameter, scalingRadiusShapingParameter, scaleShapingParameter, 
                              translateShapingParameter, rotateShapingParameter){
    let path = [];
    let radsp = radiusShapingParameter.length === 0 ? new Array(nbPointsInLayer).fill(0) : radiusShapingParameter;
    let ssp = scaleShapingParameter.length === 0 ? new Array(nbLayers).fill(0) : scaleShapingParameter;
    let rsp = rotateShapingParameter.length === 0 ? new Array(nbLayers).fill(0) : rotateShapingParameter;
    let tsp = translateShapingParameter.length === 0 ? new Array(nbLayers).fill([0, 0, 0]) : translateShapingParameter;
    let srsp = scalingRadiusShapingParameter.length === 0 ? new Array(nbLayers).fill(1) : scalingRadiusShapingParameter;
    for(let j = 0; j < nbLayers; j++){
        for(let i = 0; i < nbPointsInLayer; i++){
            let angle = 2 * i * Math.PI / nbPointsInLayer;
            path.push(
                position[0] + (initialRadius + srsp[j] * radsp[i] + ssp[j]) * Math.cos(angle + (rsp[j] * Math.PI/180)) + tsp[j][0],
                position[1] + (initialRadius + srsp[j] * radsp[i] + ssp[j]) * Math.sin(angle + (rsp[j] * Math.PI/180)) + tsp[j][1],
                position[2] + layerHeight * j
            );
            // console.log("X:", position[0] + (initialRadius + srsp[j] * radsp[i] + ssp[j]) * Math.cos(angle + (rsp[j] * Math.PI/180)) + tsp[j][0])
        }
    }
    updatePath(path);
    return path;
}

//toolpathUnitGenerator([0.0, 4.0, 0.0], 88.0, 3.2, 3.0, 5.0, [], [], [], [], []); //works

// var tp = toolpathUnitGenerator([0.0, 4.0, 0.0], 53.0, 3.2, 3.0, 5.0, [], [], [], [], []); //does not
// console.log("TP:", tp.length);
// updatePath(tp);