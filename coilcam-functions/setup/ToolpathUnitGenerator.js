function toolpathUnitGenerator(position, initialRadius, layerHeight, nbLayers, nbPointsInLayer,
                              radiusShapingParameter, scalingRadiusShapingParameter = [], scaleShapingParameter = [], 
                              translateShapingParameter = [], rotateShapingParameter = []){
    let path = [];
    let radsp = new Array(nbLayers).fill(0) || radiusShapingParameter;
    let ssp = new Array(nbPointsInLayer).fill(0) || scaleShapingParameter;
    let rsp = new Array(nbPointsInLayer).fill(0) || rotateShapingParameter;
    let tsp = new Array(nbPointsInLayer).fill(0, 0, 0) || translateShapingParameter;
    let srsp = new Array(nbPointsInLayer).fill(0) || scalingRadiusShapingParameter;
    for(let j = 0; j < nbLayers; j++){
        for(let i = 0; i < nbPointsInLayer; i++){
            angle = 360/nbPointsInLayer
            path.push(point3(position.X + (initialRadius+srsp[j]*radsp[i]+ssp[j])*math.cos(i*angle*math.pi/180 + rsp[j]*math.pi/180) + tsp[j].X, 
                               position.Y + (initialRadius + srsp[j]*radsp[i] + ssp[j] )*math.sin(i*angle*math.pi/180 + rsp[j]*math.pi/180) + tsp[j].Y, 
                               position.Z+layerHeight*j))
        }
    }
    return path;
}