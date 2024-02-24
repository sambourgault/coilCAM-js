import {BABY_POTTERBOT, SUPER_POTTERBOT, createPreset} from "../coilcam-functions/PrinterPresets.js";

//Helper functions for generateGCode
function extrude(nozzleDiameter, layerHeight, segmentLen){
    let points = [];
    let extrusion_multiplier = (nozzleDiameter/1.91)^2 //extrusion multiplier for correct filament thickness
    for(var i = 0; i < segmentLen; i++){
        points.push(i*layerHeight/nozzleDiameter * (4/math.pi + layerHeight/nozzleDiameter) * extrusion_multiplier);
    }
    return points;
}

let round2pt = (value) => Math.floor(value*100)/100.0;
let euclideanDist = (p1, p2) => Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2 + (p1[2]-p2[2])**2);


//GCode Generator for preset values
function generateGCode(path, preset){
    // if(preset.name == "BABY_POTTERBOT" || preset.name == "SUPER_POTTERBOT"){
    //     return generateGCode(path, preset.nozzleDiameter, preset.printSpeed, preset.layerHeight);
    // }
    return generateGCode(path, preset.nozzleDiameter, preset.printSpeed, preset.layerHeight);
}

//Main functions to generate GCode, calculate clay height, calculate number of tubes
function generateGCode(path, nozzleDiameter, printSpeed, layerHeight){ //main function
    // printSpeed, nozzleDiameter, LayerHeight: float
    // path: array of point3
    let printSpeeds = [10000]; //First move should be 10000
    let segmentLen = [];
    
    for(var i = 1; i < len(path); i++){
        segmentLen.push(euclideanDist(path[i], path[i-1]));
        printSpeeds.push(Math.floor(printSpeed[i]*60));
    };
    
    let extrude = extrude(nozzleDiameter, layerHeight, segmentLen);
    
    let startGcodePrefix = ';;; START GCODE ;;;\nM82 ;absolute extrusion mode\nG28 ;Home\nG1 X207.5 Y202.5 Z20 F10000 ;Move X and Y to center, Z to 20mm high\nG1 E2000 F20000 ; !!Prime Extruder\nG92 E0\nG1 F30000 E-150\n;;; ======';
    let endGcodePostfix = ";;; === END GCODE ===\nM83 ;Set to Relative Extrusion Mode\nG28 Z ;Home Z\n; === DEPRESSURIZE ===\nG91\nG91\nG1 E-1300 F4000\nG90\nG90";
    let gcode = [startGcodePrefix];
    gcode.push(startGcodePrefix);
    
    for(var i = 0; i < len(path); i++){
        x = round2pt(path[i][0]);
        y = round2pt(path[i][1]);
        z = round2pt(path[i][2]);
        gcode.push("G1 F" + printSpeeds[i]+ " X"+ x +" Y" + y + " Z" + z + " E" + extrude[i]);
    }
   
    gcode.push(endGcodePostfix);
    return gcode;
}

//using preset values
function getNumTubes(path, preset){ 
    return getNumTubes(path, preset.nozzleDiameter, preset.layerHeight);
}

//Not fully implemented in Rhino, may not be correct
function getNumTubes(path, nozzleDiameter, layerHeight){ 
    let segmentLen = [];
    for(var i = 1; i < len(path); i++){
        segmentLen.push(euclideanDist(path[i], path[i-1]));
    }    
    let extrusions = extrude(nozzleDiameter, layerHeight, segmentLen);
    let totalExtrusion = extrusions[extrusions.length - 1];
    return ((nozzleDiameter/2)^2*totalExtrusion)/((95.5/2)^2)/430; //multiplier from original gcode
}

//Stub: using preset values
function calculateClayHeight(path, preset){ 
    return calculateClayHeight(path, preset.nozzleDiameter, preset.layerHeight);
}

//Stub: not fully implemented in Rhino, not sure what the value of multiplier should be
function calculateClayHeight(nozzleDiameter, path, layerHeight, extrusionMultiplier){ 
    let extrusionMultiplier = 0; //Extrusion multiplier exists for Super Potterbot but is unused
    return getNumTubes(nozzleDiameter, path, layerHeight)*extrusionMultiplier;
}