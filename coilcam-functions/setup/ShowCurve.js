function showCurve(curvePath, isVertical, position, initialRadius, layerHeight, nbLayers, nbPointsInLayer){
    let path = [];
    if(isVertical){
        for(let i = 0; i < nbLayers; i++){
            path.push(position[0] + curvePath[i], position[1], position[2] + (layerHeight*i), 0);
        }
    } else{
        let normterm = Math.max(...curvePath); //keep size manageable compared to radius
        console.log(normterm);
        for(let i = 0; i < nbPointsInLayer; i++){
            let angle = 2 * i * Math.PI / nbPointsInLayer;
            path.push(position[0] + (2*curvePath[i]*initialRadius/normterm * Math.cos(angle))); //check
            path.push(position[1] + (2*curvePath[i]*initialRadius/normterm * Math.sin(angle)));
            path.push(0, 0);
        }
    }
    console.log("curvepath", path);
    return path;
}