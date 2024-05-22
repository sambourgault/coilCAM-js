// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon, Segment} = Flatten;
const {intersect} = Flatten.BooleanOperations;


export function baseSpiral(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius, rotate=0){ 
    let basePoints = [];
    let basePath = [];
    let height = layerHeight;
    for(let i = 0; i < nbPointsInLayer; i+=3){
        basePoints.push(path[i], path[i+1], path[i+2]);
    }

    let diameter = radius*2;
    let layers = .8*(nbPointsInLayer*diameter/(nozzle_diameter*Math.PI));
    let scale = nozzle_diameter/Math.PI;
    let bias = .0001;
    let step = 2 * Math.PI / nbPointsInLayer;
    var rotate = 2*Math.PI - ((-layers * step) % (2 * Math.PI));


    for (let angle = -layers * step; angle < layers * step; angle += step) {
        let factor = Math.PI/2; //still not sure what this # should be, adjust manually?
        let spiralRadius = scale * angle;
        if (angle < 0) {
            let x = bias + position[0] + spiralRadius * Math.cos(angle + rotate);
            let y = bias + position[1] + spiralRadius * Math.sin(angle + rotate);
            basePath.push(x, y, height);
            if(angle == -layers * step){
                console.log("starting point", x, y, height);
            }
        }

        else {
            let x = bias + position[0] + spiralRadius * Math.sin(angle + factor - rotate);
            let y = bias + position[1] + spiralRadius * Math.cos(angle + factor - rotate);
            basePath.push(x, y, height);
        }
        
    }
    return basePath;
}


export function baseFill(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius){
    let basePath = [];
    // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    let height = layerHeight;
    // console.log(height);
    for(let i = 0; i < nbPointsInLayer*3; i+=3){
        basePath.push(point(path[i], path[i+1]));
    }

    let baseCircle = new Polygon(basePath);
    
    let diameter = radius*2; //change to be relative to base
    let start = [position[0] - diameter, position[1] - diameter, layerHeight*2];
    let newPoints = [];

    for (let i = 0; i < (diameter*2); i+=nozzle_diameter*1.8){
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
    let newPath = bottomBase.concat(middleBase.concat(topBase));
    // console.log(middleBase);
    return newPath;
}

export function addBase(b, path){
    return b.concat(path);
}

window.baseSpiral = baseSpiral;
window.baseFill = baseFill;
window.base = base;
