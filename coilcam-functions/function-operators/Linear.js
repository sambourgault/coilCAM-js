function linear(amplitude, offset, nbPoints, values0, mode) {
    const values = [];
    
    offset = offset.length === 0 ? new Array(nbPoints).fill(0) : offset;
    values0 = values0.length === 0 ? new Array(nbPoints).fill(1) : values0;
    if(mode != "additive" && mode != "multiplicative"){ 
        mode = "additive"; 
    }

    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive"){
            values.push(((amplitude * i) + offset[i]) + values0[i]);
        } else if (mode == "multiplicative"){
            values.push(((amplitude * i) + offset[i]) * values0[i]);
        }
    }
    updatePath(path);
    return values;
}
