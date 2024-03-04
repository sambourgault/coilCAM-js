function sinusoidal(amplitude, period, offset, nbPoints, values0, mode){
    let values = [];

    offset = [0] * nbPoints || offset;
    values0 = [0] * nbPoints || values0;
    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }
    
    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive"){
            values.push(amplitude * Math.pow(Math.sin(period*i + offset[i]), 2) + values0[i]);
        } else if (mode == "multiplicative"){
            values.push(amplitude * Math.pow(Math.sin(period*i + offset[i]), 2) * values0[i]);
        }
    }
    return values;
}
