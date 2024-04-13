function sinusoidal2D(amplitudeX1, amplitudeX2, periodX1, periodX2, offset, nbPoints, values0x, values0y, mode) {
    let values = []

    if(offset.length === 0){
        offset = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offset)){
        offset = new Array(nbPoints).fill(offset);
    } else if(offset.length !== nbPoints){
        throw new Error("Length of offset in Sinusoidal2D must be 0 or 1 or equal to nbPoints");
    }

    if(values0x.length === 0){
        values0x = new Array(nbPoints).fill(0);
    } else if(values0x.length === 1){
        values0x = new Array(nbPoints).fill(values0x[0]);
    } else if(values0x.length !== nbPoints){
        throw new Error("Length of values0 in Sinusoidal2D must be 0 or 1 or equal to nbPoints");
    }

    if(values0y.length === 0){
        values0y = new Array(nbPoints).fill(0);
    } else if(values0y.length === 1){
        values0y = new Array(nbPoints).fill(values0y[0]);
    } else if(values0y.length !== nbPoints){
        throw new Error("Length of values0 in Sinusoidal2D must be 0 or 1 or equal to nbPoints");
    }

    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }
    
    for (let i = 0; i < nbPoints; i++) {
        if (mode == "additive" || mode == "") {
            values.push(amplitudeX1 * Math.cos(2 * Math.PI * i / periodX1 + offset[i]) + values0x);
            values.push(amplitudeX2 * Math.sin(2 * Math.PI * i / periodX2 + offset[i]) + values0y);
        } else if (mode == "multiplicative") {
            values.push(amplitudeX1 * Math.cos(2 * Math.PI * i / periodX1 + offset[i]) * values0x);
            values.push(amplitudeX2 * Math.sin(2 * Math.PI * i / periodX2 + offset[i]) * values0y);
        }
    }
    return values
}

