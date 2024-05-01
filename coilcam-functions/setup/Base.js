// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon, Segment} = Flatten;
const {intersect} = Flatten.BooleanOperations;


export function baseSpiral(position, path, nbPointsInLayer, layerHeight, layerWidth, radius){ 
    let basePoints = [];
    let basePath = [];
    // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    let height = layerHeight;
    console.log(height);
    for(let i = 0; i < nbPointsInLayer; i+=3){
        basePoints.push(path[i], path[i+1], path[i+2]);
    }

    let scale = .3; 
    let x = radius * Math.PI * (1/scale);
    let y = radius* Math.PI * (1/scale);
    
    for (let i = radius - 1; i > 0; i--){
        for (let j = nbPointsInLayer - 1; j > 0; j--){
            let theta =  (j*2*Math.PI/nbPointsInLayer); 
            let outer = (2* Math.PI * i); 
            x = (x +(outer + theta) * Math.cos(theta)) * scale;
            y = (y +(outer + theta) * Math.sin(theta)) * scale;
            basePath.push(x, y, height);
        }
    }
    for (let i = 1; i < radius; i++){
        for (let j = 1; j < nbPointsInLayer; j++){
            let theta =  (j*2*Math.PI/nbPointsInLayer); 
            let outer = (2* Math.PI * i); 
            x = (x +(outer + theta) * Math.cos(180 + theta)) * scale;
            y = (y +(outer + theta) * Math.sin(180 + theta)) * scale;
            basePath.push(x, y, height);
        }
    }
    return basePath;
}


export function baseFill(position, path, nbPointsInLayer, layerHeight, layerWidth, radius){
    let basePath = [];
    // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    let height = layerHeight;
    console.log(height);
    for(let i = 0; i < nbPointsInLayer*3; i+=3){
        basePath.push(point(path[i], path[i+1]));
    }
    let baseCircle = new Polygon(basePath);
    
    let diameter = radius*4; //radius values off, check correctness
    let start = [position[0] - diameter, position[1] - diameter, layerHeight*2];
    let newPoints = [];

    for (let i = 0; i < (diameter*2); i+=layerWidth){
        let line = new Segment(point([start[0]+(i), start[1]]), point([start[0]+(i), start[1]+(diameter*2)]));
        let intersectionPoints = (line.intersect(baseCircle).map(pt => [pt.x, pt.y])).flat();
        if(intersectionPoints.length == 4){
            if(i % (2*layerWidth) == 0){
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
    console.log("gp", newPoints);
    return newPoints;
}

export function base(position, path, nbPointsInLayer, layerHeight, layerWidth, radius){
    console.log("build base");
    let bottomBase = baseSpiral(position, path, nbPointsInLayer, layerHeight, layerWidth, radius);
    let middleBase = baseFill(position, path, nbPointsInLayer, layerHeight*7, layerWidth, radius);
    let topBase = baseSpiral(position, path, nbPointsInLayer, layerHeight*14, layerWidth, radius);
    let newPath = topBase.concat(middleBase.concat(bottomBase));
    console.log(middleBase);
    console.log("newpath", newPath);
    return newPath;
}

//baseFill doesn't work unless function base is commented out
window.baseSpiral = baseSpiral;
window.baseFill = baseFill;
window.base = base;
