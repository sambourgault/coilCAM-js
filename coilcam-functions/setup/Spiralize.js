function spiralize(path, layerHeight){ //revisit
    console.log("Called!");
    prevHeight = path[2];
    layerNbPoints = [];
    for(let i = 0; i < path.length; i+=3){ //only z points (2)
        if(Math.abs(prevHeight - path[i]) > 0.01){
            layerNbPoints.push(i);
            previousHeight = path[i];
        }
    }
    console.log("Layer nb pts:", layerNbPoints);

    points = [];
    index = 0;
    previousLastIndex = 0;
    previousLayerNbPoints = 0;
    for(let j = 0; j < layerNbPoints.length; j++){
        for(let i = 0; i < layerNbPoints[j].length; i++){
            points.push(path[i]);
            points.push(path[i+1]); 
            points.push(path[i+2] + (i-previousLastIndex)*layerHeight/(layerNbPoints[j] - previousLayerNbPoints));
        }
        previousLayerNbPoints = layerNbPoints[j]
        previousLastIndex = index
    }
    console.log("Points:", points)
    return points; 
}


