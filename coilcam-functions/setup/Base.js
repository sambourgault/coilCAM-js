// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon, Segment} = Flatten;
const {intersect} = Flatten.BooleanOperations;


export function baseSpiral(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius){ 
    let basePoints = [];
    let basePath = [];
    // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    let height = layerHeight;
    console.log(height);
    for(let i = 0; i < nbPointsInLayer; i+=3){
        basePoints.push(path[i], path[i+1], path[i+2]);
    }

    let diameter = radius*2;
    // let layers = Math.floor(radius / (nozzle_diameter));
    let layers = (diameter/nbPointsInLayer * nozzle_diameter);
    let scale = (Math.PI*nozzle_diameter/(radius));
    let x = Math.sin(diameter) + (position[0]);
    let y = Math.cos(diameter) + (position[1]);
    // console.log("diameter", diameter);
    // console.log("layers", layers);

    for (let i = layers; i > 0; i--){ //inwards spiral
        for (let j = nbPointsInLayer - 1; j >= 0; j--){
            let theta =  (j*2*Math.PI/nbPointsInLayer); 
            let outer = (2* Math.PI * i); 
            x = ((x +(outer + theta) * Math.sin(theta))*scale) + (position[0]);
            y = ((y +(outer + theta) * Math.cos(theta))*scale) + (position[1]);
            basePath.push(x, y, height);
        }
    }
    for (let i = 0; i <= layers; i++){ //outwards spiral
        for (let j = 0; j < nbPointsInLayer; j++){
            // 4*nbPointsInLayer/(Math.PI))
            let theta =  (j*2*Math.PI/nbPointsInLayer); 
            let outer = (2* Math.PI * i); 
            let newX = ((x +(outer + theta) * Math.sin(theta+Math.PI*2))*scale) + (position[0]);
            let newY = ((y +(outer + theta) * Math.cos(theta+(Math.PI*2)))*scale) + (position[1]);
            x = newX;
            y = newY;
            basePath.push(x, y, height);
        }
    }
    // console.log("spiral base path", basePath);
    return basePath;
}


export function baseFill(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius){
    let basePath = [];
    // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    let height = layerHeight;
    console.log(height);
    for(let i = 0; i < nbPointsInLayer*3; i+=3){
        basePath.push(point(path[i], path[i+1]));
    }
    let baseCircle = new Polygon(basePath);
    
    let diameter = radius*4; //change to be relative to base
    let start = [position[0] - diameter, position[1] - diameter, layerHeight*2];
    let newPoints = [];

    for (let i = 0; i < (diameter*2); i+=nozzle_diameter){
        let line = new Segment(point([start[0]+(i), start[1]]), point([start[0]+(i), start[1]+(diameter*2)]));
        let intersectionPoints = (line.intersect(baseCircle).map(pt => [pt.x, pt.y])).flat();
        if(intersectionPoints.length == 4){
            if(i % (2*nozzle_diameter) == 0){
                newPoints.push(intersectionPoints[0], intersectionPoints[1]);
                newPoints.push(height);
                newPoints.push(intersectionPoints[2], intersectionPoints[3]);
                newPoints.push(height);
            } else{
                newPoints.push(intersectionPoints[2], intersectionPoints[3]);
                newPoints.push(height);
                newPoints.push(intersectionPoints[0], intersectionPoints[1]);
                newPoints.push(height);
            }
        }
        
    }
    return newPoints;
}

export function base(position, path, nbPointsInLayer, layerHeight, nozzleDiameter, radius){
    let bottomBase = baseSpiral(position, path, nbPointsInLayer, layerHeight, nozzleDiameter, radius);
    let middleBase = baseFill(position, path, nbPointsInLayer, layerHeight*2, nozzleDiameter, radius);
    let topBase = baseSpiral(position, path, nbPointsInLayer, layerHeight*3, nozzleDiameter, radius);
    let newPath = topBase.concat(middleBase.concat(bottomBase));
    console.log(middleBase);
    return newPath;
}

window.baseSpiral = baseSpiral;
window.baseFill = baseFill;
window.base = base;
