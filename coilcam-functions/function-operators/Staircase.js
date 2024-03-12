function staircase(stepWidth, stepHeight, offset, nbPoints, values0, mode){
    let values = [];
    let index = 0;

    if(offset.length === 0){
        offset = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offset)){
        offset = new Array(nbPoints).fill(offset);
    } else if(offset.length !== nbPoints){
        throw new Error("Length of values0 in Staircase must be 0 or 1 or equal to nbPoints");
    }

    if(values0.length === 0){
        values0 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(values0)){
        values0 = new Array(nbPoints).fill(values0);
    } else if(values0.length !== nbPoints){
        throw new Error("Length of values0 in Staircase must be 0 or 1 or equal to nbPoints");
    }

    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }

    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive"){
            if (i % stepWidth == 0 && i != 0){
                index += stepHeight;
            }
            values.push(index + offset[i] + values0[i]);
        }
        if (mode == "multiplicative"){
            if (i % stepWidth == 0 && i != 0){
                index += stepHeight;
            }
            values.push((index + offset[i]) * values0[i]);
        }
    }
    return values;
}