function spiralize(path, layerHeight){ //revisit
    var nbPointsInLayer = [];
    var currHeight = path[2];
    var ctr = 0;
    for(let i = 0; i < path.length; i+=3){
        if(path[i+2] > currHeight){
            currHeight = path[i+2];
            nbPointsInLayer.push(ctr);
            ctr = 0;
        }
        ctr++;
    }
    nbPointsInLayer.push(ctr);
    console.log("nbpl", nbPointsInLayer);

    currLayer = 0;
    nPointsIterated = 0;
    var points = path;
    for(let i = 0; i < nbPointsInLayer.length; i++){
        // console.log("npr", nPointsIterated);
        for(let j = 0; j < nbPointsInLayer[i]; j++){
            points[nPointsIterated + (j*3)+2] += ((j+1)*(layerHeight/(nbPointsInLayer[i])));
        }
        nPointsIterated += nbPointsInLayer[i]*3;
    }
    // console.log("spiralized path", path);
    return points;
}



