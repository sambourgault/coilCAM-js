function linear2D(amplitudeX1, offsetX1, amplitudeX2, offsetX2, nbPoints, values0, mode){
    let values = [];

    if(offsetX1.length === 0){
        offsetX1 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offsetX1)){
        offsetX1 = new Array(nbPoints).fill(offsetX1);
    } else if(offsetX1.length !== nbPoints){
        throw new Error("Length of offset in Linear2D must be 0 or 1 or equal to nbPoints");
    }

    if(offsetX2.length === 0){
        offsetX2 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offsetX2)){
        offsetX2 = new Array(nbPoints).fill(offsetX2);
    } else if(offsetX2.length !== nbPoints){
        throw new Error("Length of offsetX2 in Linear2D must be 0 or 1 or equal to nbPoints");
    }

    if(values0.length === 0){
        values0 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(length)){
        values0 = new Array(nbPoints).fill(values0);
    } else if(values0.length !== nbPoints){
        throw new Error("Length of values0 in Linear must be 0 or 1 or equal to nbPoints");
    }

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