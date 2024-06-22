function setParameter(input, parameter_name, nbLayers=[], nbPointsInLayer=[]){
    if(parameter_name === "radiusShapingParameter"){ //radsp runs calculations using nbPointsInLayer
        if(!Array.isArray(input)){
            return new Array(nbPointsInLayer).fill(input);
        } else if(input.length == nbPointsInLayer){
            return input;
        } else if(input.length == nbPointsInLayer*nbLayers){
            return input;
        }
        else if(input.length === 0){
            return new Array(nbPointsInLayer).fill(0);
        }
        //an error has occurred
        var error_str = "Length of values for parameter " + parameter_name + " is currently " + input.length + ", must be 0, 1 or equal to nbPointsInLayer: " + nbPointsInLayer;
        throw new Error(error_str);
    } else if(parameter_name === "thicknessShapingParameter"){ //should be in range [-1, 1], 0 is default
        if(input.length === 0 || (input.length[0] === 0 && input.length[1] === 0)){
            return new Array(nbPointsInLayer*nbLayers).fill(0);
        }
        if(input[0].length === 1){
            if(input < -1 || input > 1){
                var error_str = "Range of points for thicknessShapingParameter exceeds the range [-1, 1].";
                throw new Error(error_str);
            }
            return new Array(nbPointsInLayer*nbLayers).fill(input);
        }
        if(input[0].length === nbPointsInLayer*nbLayers){
            if(Math.min(input) < -1 || Math.max(input) > 1){
                var error_str = "Range of points for thicknessShapingParameter exceeds the range [-1, 1].";
                throw new Error(error_str);
            }
            return input[0];
        }
        if(input[0].length == nbPointsInLayer){
            let arr = [];
            for(let i = 0; i < nbLayers; i++){
                for(let j = 0; j < nbPointsInLayer; j++){
                    if(input[1].length == 0){
                        arr.push(input[0][j]);
                    }
                    if(input[1].length == 1){
                        arr.push(input[0][j]+input[1][0]);
                    }
                    if(input[1].length == nbLayers){
                        arr.push(input[0][j]+input[1][i]);
                    }
                }
            }
            if (Math.max(arr) > 1 || Math.min(arr) < -1){
                var error_str = "Range of points for thicknessShapingParameter exceeds the range [-1, 1].";
                throw new Error(error_str);
            }
            return arr;
        }
        var error_str = "Length of values for parameter " + parameter_name + " are currently " + input[0].length + " and " + input[1].length + ", must be 0, 1 or equal to nbPointsInLayer: " + nbPointsInLayer + "/nbLayers: " + nbLayers;
        throw new Error(error_str);
    } else{ //ssp, rsp, tsp, rsp, srsp run calculations using nbLayers
        if(input.length === 0){
            if(parameter_name === "scalingRadiusShapingParameter"){
                return new Array(nbLayers).fill(1);
            }
            if(parameter_name === "translateShapingParameter"){
                return new Array(nbLayers).fill([0, 0, 0]);
            }
            if(parameter_name === "rotateShapingParameter" || parameter_name === "scaleShapingParameter"){
                return new Array(nbLayers).fill(0);
            }
        } else if(!Array.isArray(input)){
            return new Array(nbLayers).fill(input);
        } else if(input.length == nbLayers){
            return input;
        } 
    }

    //an error has occured
    var error_str = "Length of values for parameter " + parameter_name + " is currently " + input.length + ", must be 0, 1 or equal to nbLayers: " + nbLayers;
    throw new Error(error_str);
}

function toolpathUnitGenerator(position, initialRadius, layerHeight, nbLayers, nbPointsInLayer,
                              radiusShapingParameter, scaleShapingParameter, scalingRadiusShapingParameter,
                              translateShapingParameter, rotateShapingParameter, thicknessShapingParameter=[]){
    let path = [];
    let radsp = setParameter(radiusShapingParameter, "radiusShapingParameter", nbLayers, nbPointsInLayer);
    let ssp = setParameter(scaleShapingParameter, "scaleShapingParameter", nbLayers);
    let rsp = setParameter(rotateShapingParameter, "rotateShapingParameter", nbLayers);
    let tsp = setParameter(translateShapingParameter, "translateShapingParameter", nbLayers);
    let srsp = setParameter(scalingRadiusShapingParameter, "scalingRadiusShapingParameter", nbLayers);
    let thsp = setParameter(thicknessShapingParameter, "thicknessShapingParameter", nbLayers, nbPointsInLayer);
    let k = 0; //accounting for case where radsp is a 2D array
    for(let j = 0; j < nbLayers; j++){
        if(radsp.length == nbLayers*nbPointsInLayer){
            k++;
        }
        for(let i = 0; i < nbPointsInLayer; i++){
            let angle = 2 * i * Math.PI / nbPointsInLayer;
            // if(i == 0 && j == 0){
            //     console.log("start x:", position[0] + (initialRadius + srsp[j] * radsp[(nbLayers*j*k)+i] + ssp[j]) * Math.cos(angle + (rsp[j] * Math.PI/180)) + tsp[j][0]);
            //     console.log("start y:", position[1] + (initialRadius + srsp[j] * radsp[(nbLayers*j*k)+i] + ssp[j]) * Math.sin(angle + (rsp[j] * Math.PI/180)) + tsp[j][1]);
            // }
            path.push(position[0] + (initialRadius + srsp[j] * radsp[(nbLayers*j*k)+i] + ssp[j]) * Math.cos(angle + (rsp[j] * Math.PI/180)) + tsp[j][0]);
            path.push(position[1] + (initialRadius + srsp[j] * radsp[(nbLayers*j*k)+i] + ssp[j]) * Math.sin(angle + (rsp[j] * Math.PI/180)) + tsp[j][1]);
            path.push(position[2] + layerHeight * j);
            path.push(thsp[(nbLayers*j)+i]);
        }
    }
    return path;
}