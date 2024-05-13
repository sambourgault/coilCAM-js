function centerPrint(path, position, bedDimensions, layerHeight = 2.5){
    let bedXOffset = bedDimensions[0]/2 - position[0];
    let bedYOffset = bedDimensions[1]/2 - position[1];
    let bedZOffset = layerHeight - path[2];
    for (var i = 0; i < path.length; i+=3){
        path[i] += bedXOffset;
        path[i+1] += bedYOffset;
        path[i+2] += bedZOffset;
    }
    return path;
}

function checkOverflow(path, bedDimensions, layerHeight){
    for (var i = 0; i < path.length; i+=3){
        if(path[i] > bedDimensions[0] || path[i] < 0){
            var error_str = "x values exceed printer bed dimensions";
            throw new Error(error_str);
        }
        if(path[i+1] > bedDimensions[1] || path[i+1] < 0){
            var error_str = "y values exceed printer bed dimensions";
            throw new Error(error_str);
        }
        if(path[i+2] > bedDimensions[2] || path[i+2] <= layerHeight){
            var error_str = "z values exceed printer bed dimensions";
            throw new Error(error_str);
        }
    }
    return false;
}

//import {BABY_POTTERBOT, SUPER_POTTERBOT, createPreset} from "../coilcam-functions/PrinterPresets.js";

