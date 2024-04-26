function setParameter(input, parameter_name, nb){
     // let radsp = radiusShapingParameter.length === 0 ? new Array(nbPointsInLayer).fill(0) : radiusShapingParameter;
    let parameter;
    if(input.length === 0){
        if(parameter_name === "scalingRadiusShapingParameter"){
            parameter = new Array(nb).fill(1);
        }
        if(parameter_name === "translateShapingParameter"){
            parameter = new Array(nb).fill([0, 0, 0]);
        }
        if(parameter_name === "rotateShapingParameter" || parameter_name === "scaleShapingParameter" || parameter_name === "radiusShapingParameter"){
            parameter = new Array(nb).fill(0);
        }
    } else if(!Array.isArray(input)){
        parameter = new Array(nb).fill(input);
    } else if(input.length == nb){
        console.log("chilling");
        return input;
    }
    else{
        if(parameter_name === "radiusShapingParameter"){
            var error_str = "Length of values in shaping parameter " + parameter_name + " must be 0, 1 or equal to nbPointsInLayer";
            throw new Error(error_str);
        } else{
            var error_str = "Length of values in shaping parameter " + parameter_name + " must be 0, 1 or equal to nbPointsInLayer";
            throw new Error(error_str);
        }
    }
    console.log("parameter", parameter_name, parameter);
    return parameter;
}

function toolpathUnitGenerator(position, initialRadius, layerHeight, nbLayers, nbPointsInLayer,
                              radiusShapingParameter, scaleShapingParameter, scalingRadiusShapingParameter,
                              translateShapingParameter, rotateShapingParameter){
    let path = [];
    let radsp = setParameter(radiusShapingParameter, "radiusShapingParameter", nbPointsInLayer);
    let ssp = setParameter(scaleShapingParameter, "scaleShapingParameter", nbLayers);
    let rsp = setParameter(rotateShapingParameter, "rotateShapingParameter", nbLayers);
    let tsp = setParameter(translateShapingParameter, "translateShapingParameter", nbLayers);
    let srsp = setParameter(scalingRadiusShapingParameter, "scalingRadiusShapingParameter", nbLayers);
    console.log("ssp", ssp)

    for(let j = 0; j < nbLayers; j++){
        for(let i = 0; i < nbPointsInLayer; i++){
            let angle = 2 * i * Math.PI / nbPointsInLayer;
            path.push(position[0] + (initialRadius + srsp[j] * radsp[i] + ssp[j]) * Math.cos(angle + (rsp[j] * Math.PI/180)) + tsp[j][0]);
            path.push(position[1] + (initialRadius + srsp[j] * radsp[i] + ssp[j]) * Math.sin(angle + (rsp[j] * Math.PI/180)) + tsp[j][1]);
            path.push(position[2] + layerHeight * j);
        }
    }
    console.log("path in tug", path);
    return path;
}