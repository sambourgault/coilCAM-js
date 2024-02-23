function sinusoidal2D(amplitudeX1, amplitudeX2, periodX1, periodX2, offset, nbPoints, values0, mode) {
    let values = []

    offset = offset || []
    values0 = values0 || []
    mode = mode || "additive"
    
    let newPoint = [0, 0, 0]
    for (let i = 0; i < nbPoints; i++) {
        if (mode == "additive" || mode == "") {
            newPoint[0] = amplitudeX1 * Math.cos(2 * Math.PI * i / periodX1 + offset[i]) + values0[i].X
            newPoint[1] = amplitudeX2 * Math.sin(2 * Math.PI * i / periodX2 + offset[i]) + values0[i].Y
            values.push(newPoint)
        } else if (mode == "multiplicative") {
            newPoint[0] = amplitudeX1 * Math.cos(2 * Math.PI * i / periodX1 + offset[i]) * values0[i].X
            newPoint[1] = amplitudeX2 * Math.sin(2 * Math.PI * i / periodX2 + offset[i]) * values0[i].Y
            values.push(newPoint)
        }
    }
    return values
}

