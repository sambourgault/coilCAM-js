function linear(amplitude, offset, nbPoints, values0, mode) {
    let values = [];
    
    offset = [0] * nbPoints || offset; //if offset is null/undefined, set to 0*nbPoints
    values0 = [0] * nbPoints || values0;
    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }

    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive"){
            values.push((amplitude * i + offset[i]) + values0[i]);
        } else if (mode == "multiplicative"){
            values.push((amplitude * i + offset[i]) * values0[i]);
        }
    }
    return values;
}
