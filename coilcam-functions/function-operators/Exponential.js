function exponential(amplitude, base, ampExp, offset, nbPoints, values0, mode){
    let values = [];
    offset = [0] * nbPoints || offset;
    values0 = [0] * nbPoints || values0;
    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }
    for(let i = 0; i < nbPoints; i++){
        if(mode == "additive"){
            values.push(amplitude * Math.pow(base, ampExp*i + offset[i]) + values0[i]);
        } else if(mode == "multiplicative"){
            values.push(amplitude * Math.pow(base, ampExp*i + offset[i]) * values0[i]);
        }
    }
}