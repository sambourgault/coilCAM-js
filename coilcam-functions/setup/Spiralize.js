function spiralize(path, layerHeight){
    prevHeight = path[0][2];
    layerNbPoints = [];
    for(let i = 0; i < path.length; i++){
        if(Math.abs(prevHeight - path[i][2]) > 0.01){
            layerNbPoints.push(i);
            previousHeight = path[i][2];
        }
    }

    points = [];
    index = 0
    for(let j = 0; j < layerNbPoints.length; j++){
        for(let i = 0; i < layerNbPoints[j].length; j++){
            points.push([path[i][0], path[i][1], 
                path[i][2] + (i-previousLastIndex)*layerHeight/(layerNbPoints[j] - previousLayerNbPoints)])
            }
        previousLayerNbPoints = layerNbPoints[j]
        previousLastIndex = index
    }
    return points; 
}
