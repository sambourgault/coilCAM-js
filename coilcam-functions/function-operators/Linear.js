function linear(amplitude, offset, nbPoints, values0, mode) {
    const values = [];
    
    if(offset.length === 0){
        offset = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offset)){
        offset = new Array(nbPoints).fill(offset);
    } else if(offset.length !== nbPoints){
        throw new Error("Length of offset in Linear must be 0 or 1 or equal to nbPoints");
    }

    if(values0.length === 0){
        values0 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(values0)){
        values0 = new Array(nbPoints).fill(values0);
    } else if(values0.length !== nbPoints){
        throw new Error("Length of values0 in Linear must be 0 or 1 or equal to nbPoints");
    }

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
    
    // updatePath(path);
    return values;
}
