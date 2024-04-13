import {BABY_POTTERBOT, SUPER_POTTERBOT, createPreset} from "../coilcam-functions/PrinterPresets.js";

let vect2Pt = (p1, p2) => [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]];

function centerPrint(path, preset){
    return centerPrint(path, [preset.bed.x, preset.bed.y, preset.bed.z]);
}

function centerPrint(path, bedSize){
    //Rewriting this function, since centerPrint in Grasshopper relied on this "box" node I'm not sure about
    //We find the center, creating a vector between the center of the print and the bed center
    //then moving the path by that vector

    let bedCenter = [bedSize[0]/2, bedSize[1]/2, 0];
    let centerMin_x = 0;
    let centerMax_x = bedSize[0];
    let centerMin_y = 0;
    let centerMax_y = bedSize[1];
    for(var i = 0; i < path.length; i++){
        centerMin_x = Math.min(centerMin_x, path[i][0]);
        centerMax_x = Math.max(centerMax_x, path[i][0]);
        centerMin_y = Math.min(centerMin_x, path[i][1]);
        centerMax_y = Math.max(centerMax_x, path[i][1]);
    }
    let center = [(centerMin_x + centerMax_x)/2, (centerMin_y + centerMax_y)/2, 0];
    let vector = vect2Pt(center, bedCenter);
    for(var i = 0; i < path.length; i++){
        for(var j = 0; j < 3; j++){
            path[i][j] += vector[j];
        }
    }
}



//work in progress