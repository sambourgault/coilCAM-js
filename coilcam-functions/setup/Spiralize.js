function spiralize(path){
    var layerHeight = path[2];
    var nbPointsInLayer = [];
    var currHeight = path[2];
    var ctr = 0;
    for(let i = 0; i < path.length; i+=4){
        if(path[i+2] > currHeight){
            currHeight = path[i+2];
            nbPointsInLayer.push(ctr);
            ctr = 0;
        }
        ctr++;
    }
    nbPointsInLayer.push(ctr);

    currLayer = 0;
    nPointsIterated = 0;
    var points = path;
    for(let i = 0; i < nbPointsInLayer.length; i++){
        // console.log("npr", nPointsIterated);
        for(let j = 0; j < nbPointsInLayer[i]; j++){
            points[nPointsIterated + (j*4)+2] += ((j+1)*(layerHeight/(nbPointsInLayer[i])));
        }
        nPointsIterated += nbPointsInLayer[i]*4;
    }
    return points;
}



// function deleteDuplicatePoints(path){
//     const allPoints = new Set();
//     var newPath = [];
//     for(let p = 0; p < path.length; p+=3){
//         if (!allPoints.has([path[p], path[p+1], path[p+2]])){
//             newPath.push(path[p], path[p+1], path[p+2]);
//             allPoints.add([path[p], path[p+1], path[p+2]]);
//         }
//     }
//     return newPath;
//     // console.log("newPath", newPath);
// }