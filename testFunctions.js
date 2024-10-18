// Testing functions before adding to coilCAM library

// Export these as a 2D array of polar coordinates: offset from radius plus angle offset
// The reason for this being that TUG currently interprets radial offset as a polar coordinate
// This should work because TUG no longer takes in a 2D array for radius to account for a nbpoints * nblayers array
// one issue is that there's no way to screen out radius from accepting a linear2D array 
// all this nonsense shouldn't (should?) be int the coilcam library???


// import { toolpathUnitGenerator } from ".";

function setSingleParameter(input, parameter_name, nbLayers, nbPointsInLayer){
    let parameterLength = nbLayers;
    let useNbPointsInLayer = (parameter_name == "radiusShapingParameter" || parameter_name == "thicknessShapingParameter");
    if(useNbPointsInLayer){
        parameterLength *= nbPointsInLayer;
    }

    if(!input?.length){ // Input not provided or input == []
        if (parameter_name == "scalingRadiusShapingParameter"){
            return new Array(parameterLength).fill(1);
        }
        return new Array(parameterLength).fill(0);
    } else if(!Array.isArray(input)){ // Parameter is a single number
        return new Array(parameterLength).fill(input);
    } else if(input.length == parameterLength){ // Parameter is a full array
        return input;
    } else if(useNbPointsInLayer){
        if(input.length == nbPointsInLayer){ // Pad values for 1D values that require 2D input
            return new Array(nbPointsInLayer*nbLayers).fill(input).flat();
        }
        var error_str = "Length of values for parameter " + parameter_name + " is currently " + 
                input.length + ", must be 0, 1, equal to nbPointsInLayer: " + nbPointsInLayer + 
                " or nbPointsInLayer*nbLayers: " + (nbPointsInLayer*nbLayers);
        throw new Error(error_str);
    }
    var error_str = "Length of values for parameter " + parameter_name + " is currently " + 
            input.length + ", must be 0, 1 or equal to nbLayers: " + nbLayers;
    throw new Error(error_str);
}

function setParameter(input, parameter_name, nbLayers, nbPointsInLayer){
    if(parameter_name == "radiusShapingParameter"){ 
        console.log("setting rad2d");
        let radsp = [[], []];
        
        if(input?.length && Array.isArray(input[0])){ // radsp is a 2D array (radial offset, angular)
            radsp[0] = setSingleParameter(input[0], parameter_name, nbLayers, nbPointsInLayer);
            radsp[1] = input[1];
        } else{ //radsp is a 1d array (radial+angular offset)
            radsp[0] = setSingleParameter(input, parameter_name, nbLayers, nbPointsInLayer);
            radsp[1] = new Array(nbPointsInLayer).fill(0);
        } 
        return radsp;
    }
    if(parameter_name == "translateShapingParameter"){ // Call setSingleParameter twice, once for x position, once for y position
        let tsp = [[], []];
        if(input == null || input == []){
            return new Array(2).fill(new Array(nbLayers).fill(0));
        }
        tsp[0] = setSingleParameter(input[0], parameter_name, nbLayers, nbPointsInLayer);
        tsp[1] = setSingleParameter(input[1], parameter_name, nbLayers, nbPointsInLayer);
        return tsp;
    }
    return setSingleParameter(input, parameter_name, nbLayers, nbPointsInLayer);
}

export default function tug(position, initialRadius, layerHeight, nbLayers, nbPointsInLayer,
    radiusShapingParameter=[], scaleShapingParameter=[], scalingRadiusShapingParameter=[],
    translateShapingParameter=[], rotateShapingParameter=[], thicknessShapingParameter=[]){
    let path = [];
    let radsp = setParameter(radiusShapingParameter, "radiusShapingParameter", nbLayers, nbPointsInLayer);
    let ssp = setParameter(scaleShapingParameter, "scaleShapingParameter", nbLayers, nbPointsInLayer);
    let rsp = setParameter(rotateShapingParameter, "rotateShapingParameter", nbLayers, nbPointsInLayer);
    let tsp = setParameter(translateShapingParameter, "translateShapingParameter", nbLayers, nbPointsInLayer);
    let srsp = setParameter(scalingRadiusShapingParameter, "scalingRadiusShapingParameter", nbLayers, nbPointsInLayer);
    let thsp = setParameter(thicknessShapingParameter, "thicknessShapingParameter", nbLayers, nbPointsInLayer);
    console.log("RADSP", radsp.length);

    var ctr = 0;
    for(let j = 0; j < nbLayers; j++){
        for(let i = 0; i < nbPointsInLayer; i++){
            let angle = 2 * i * Math.PI / nbPointsInLayer;
            const newPoint = { // Store points in toolpath as objects for greater readability: (x coordinate, y coordinate, z coordinate, thickness)
                x: (position[0] + (initialRadius + srsp[j] * radsp[0][ctr] + ssp[j]) * Math.cos(angle + (radsp[1][i]) + (rsp[j] * Math.PI/180)) + tsp[0][j]),
                y: (position[1] + (initialRadius + srsp[j] * radsp[0][ctr] + ssp[j]) * Math.sin(angle + (radsp[1][i]) + (rsp[j] * Math.PI/180)) + tsp[1][j]),
                z: (position[2] + layerHeight * j),
                t: (thsp[ctr])
            }
            path.push(newPoint);
            ctr++;
        }
    }
    return path;
}

window.tug = tug;