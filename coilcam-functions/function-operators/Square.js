function square(amplitude, period, offset, bumps, nbPoints, values0, mode){
    let values = [];
    
    if(offset.length === 0){
        offset = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offset)){
        offset = new Array(nbPoints).fill(offset);
    } else if(offset.length !== nbPoints){
        throw new Error("Length of offset in Square must be 0 or 1 or equal to nbPoints");
    }

    if(values0.length === 0){
        values0 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(values0)){
        values0 = new Array(nbPoints).fill(values0);
    } else if(values0.length !== nbPoints){
        throw new Error("Length of values0 in Square must be 0 or 1 or equal to nbPoints");
    }

    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }
    
    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive"){
            if (bumps && bumps <= (i + offset[i])%period){
                values.push((amplitude * 0) + values0[i]);
            } else {
                values.push((amplitude * 1) + values0[i]);
            }
        } else if (mode == "multiplicative"){
            if (bumps && bumps <= (i + offset[i])%period){
                values.push((amplitude * 0) * values0[i]);
            } else {
                values.push((amplitude * 1) * values0[i]);
            }
        }
    }
    return values;
}
