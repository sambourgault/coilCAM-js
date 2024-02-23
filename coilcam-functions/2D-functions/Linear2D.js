function linear2D(amplitudeX1, offsetX1, amplitudeX2, offsetX2, nbPoints, values0, mode){
    let values = [];

    offsetX1 = [0] * nbPoints || offsetX1;
    offsetX2 = [0] * nbPoints || offsetX2;
    values0 = [0] * nbPoints || values0;
    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }
    let newPoint = [0, 0, 0];
    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive" || mode == ""){
            newPoint[0] = amplitudeX1 * i + offsetX1[i];
            newPoint[1] = amplitudeX2 * i + offsetX2[i];
            values.push(newPoint + values0[i]);
        } else if (mode == "multiplicative"){
            newPoint[0] = amplitudeX1 * i + offsetX1[i];
            newPoint[1] = amplitudeX2 * i + offsetX2[i];
            values.push(newPoint * values0[i]);
        }
    }
    return values;
}