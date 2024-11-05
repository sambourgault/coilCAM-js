// Testing functions before adding to coilCAM library

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





















// Helper functions for GCodeGenerator
function extrude(nozzleDiameter, layerHeight, segmentLen, thicknesses){ //noncumulative
    let points = [];
    let extrusionMultiplier = (nozzleDiameter/1.91)**2; // extrusion multiplier for correct filament thickness (printer dependent)
    let totalExtruded = 0;
    points.push(0);
    for(var i = 0; i < segmentLen.length; i++){
        var newPoint = (segmentLen[i]*layerHeight/nozzleDiameter) * (4/Math.PI + layerHeight/nozzleDiameter);
        let pointThicknessOffset = (1 + (0.05 * thicknesses[i])); // 5% offset for extrusion rate
        points.push((newPoint * extrusionMultiplier * pointThicknessOffset).toFixed(3));
        totalExtruded += newPoint;
    }
    return points;
}


let round2pt = (value) => Math.floor(value*100)/100.0;
let euclideanDist = (p1, p2) => Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2 + (p1.z-p2.z)**2);


//Main functions to generate GCode, calculate clay height, calculate number of tubes
export function generateGC(path, layerHeight, nozzleDiameter, printSpeed){
    if(Array.isArray(path) && path.length > 0){ // Path is a valid array
        printSpeed = Math.floor(printSpeed*60);
        let segmentLen = [];
        
        for(var i = 0; i < path.length - 1; i++){
            segmentLen.push(euclideanDist(path[i], path[i+1]));
        };
        let thicknesses = path.map(point => point.t);
        let extr = extrude(nozzleDiameter, layerHeight, segmentLen, thicknesses);
        
        let startGcodePrefix = ";;; START GCODE ;;;\nM83 ;relative extrusion mode\nG28 ;Home\nG1 X207.5 Y202.5 Z20 F10000 ;Move X and Y to center, Z to 20mm high\nG1 E2000 F20000 ; !!Prime Extruder\nG92 E0\n;;; ======\n";
        let endGcodePostfix = ";;; === END GCODE ===\nM83 ;Set to Relative Extrusion Mode\nG28 Z ;Home Z\n; === DEPRESSURIZE ===\nG91\nG91\nG1 E-200 F4000\nG90\nG90\n";
        let gcode = startGcodePrefix;

        for(var i = 0; i < (path.length); i++){
            let x = round2pt(path[i].x);
            let y = round2pt(path[i].y);
            let z = round2pt(path[i].z);
            if(i == 0){ // first move F = 10000 
                gcode += "G1 F10000 X"+ x +" Y" + y + " Z" + z + " E" + extr[i] +"\n";
            } else{
                gcode += "G1 F" + printSpeed+ " X"+ x +" Y" + y + " Z" + z + " E" + extr[i] +"\n";
            }
        }
        gcode += endGcodePostfix;
        return gcode;
    }
    var error_str = "Cannot call generateGCode on an empty path.";
    throw new Error(error_str);
}

export function downloadGCode(gcode_string, fileName="COILCAM_GCODE") {
    const blob = new Blob([gcode_string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; 
    link.style.display = 'none';
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

//Not fully implemented in Rhino, may not be correct
export function getNumTubes(path, nozzleDiameter, layerHeight){ 
    let segmentLen = [];
    for(var i = 1; i < len(path); i++){
        segmentLen.push(euclideanDist(path[i], path[i-1]));
    }    
    let extrusions = extrude(nozzleDiameter, layerHeight, segmentLen);
    let totalExtrusion = extrusions[extrusions.length - 1];
    return ((nozzleDiameter/2)^2*totalExtrusion)/((95.5/2)^2)/430; //multiplier from original gcode
}

window.downloadGCode = downloadGCode;
window.generateGC = generateGC;
window.getNumTubes = getNumTubes;