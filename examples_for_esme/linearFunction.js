function linearFunction(amp, offset, nbPoints, mode = 'additve', values0 = []){
    let values = [];
    
    // check if offset is an array or not

    // check if values0 is the nbPoints size

    for (let i = 0; i < nbPoints; i++){

        if(values0.length == 0){
            values0[i] = 0;
        }

        if (mode == 'additive'){
            values[i] = (amp*i + offset) + values0[i];
        } else if (mode == 'multiplicative'){
            values[i] = (amp*i + offset) * values0[i];
        }
    }

    return values;

}