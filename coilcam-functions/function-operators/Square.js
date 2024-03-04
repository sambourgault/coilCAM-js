function square(amplitude, period, bumps, offset, nbPoints, values0, mode){
    let values = [];
    
    offset = [0] * nbPoints || offset;
    values0 = [0] * nbPoints || values0;
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
