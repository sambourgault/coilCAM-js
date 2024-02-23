function staircase(stepWidth, stepHeight, offset, nbPoints, values0, mode){
    let values = [];
    let index = 0;

    offset = new Array(nbPoints).fill(0) || offset;
    values0 = new Array(nbPoints).fill(0) || values0;
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