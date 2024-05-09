// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon, Segment} = Flatten;
const {intersect} = Flatten.BooleanOperations;


export function baseSpiral(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius, rotate=0){ 
    let basePoints = [];
    let basePath = [];
    // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    let height = layerHeight;
    console.log(height);
    for(let i = 0; i < nbPointsInLayer; i+=3){
        basePoints.push(path[i], path[i+1], path[i+2]);
    }

    let diameter = radius*2; //change to be relative to base
    let layers = .8*(nbPointsInLayer*diameter/(nozzle_diameter*Math.PI));
    let scale = nozzle_diameter/Math.PI;
    let bias = .0001;
    let step = 2 * Math.PI / nbPointsInLayer;

    for (let angle = -layers * step; angle < layers * step; angle += step) {
        let factor = (angle < 0) ? 0 : Math.PI/2;
        let spiralRadius = scale * angle;
        if (angle < 0) {
            let x = bias + position[0] + spiralRadius * Math.cos(angle);
            let y = bias + position[1] + spiralRadius * Math.sin(angle);
            basePath.push(x, y, height);
        }
        else {
            let x = bias + position[0] + spiralRadius * Math.sin(angle + factor);
            let y = bias + position[1] + spiralRadius * Math.cos(angle + factor);
            basePath.push(x, y, height);
        }
    }

    console.log("spiral base path", basePath);
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


// p5fab solution
// let diameter = radius*2;
// let r = diameter + 2;
// let step = 2 * Math.PI/nbPointsInLayer; //fix
// for(let angle = 0; angle < 8 * 2 * Math.PI; angle+=step){
//     let x = r * Math.cos(angle);
//     let y = r * Math.sin(angle);
//     let z = height;
//     basePath.push(x + position[0], y + position[1], z);
//     r -= 0.6;
//     if (r < 0){
//         break;
//     }
// }












// let basePoints = [];
// let basePath = [];
// // let height = path[2]; //assuming toolpath is sorted with smallest height listed first
// let height = layerHeight;
// console.log(height);
// for(let i = 0; i < nbPointsInLayer; i+=3){
//     basePoints.push(path[i], path[i+1], path[i+2]);
// }

// let diameter = radius*2; //change to be relative to base
// // let layers = (diameter/nbPointsInLayer * nozzle_diameter);
// let layers = (radius/nozzle_diameter) + (1/2*nozzle_diameter);
// // let scale = layers*(1/nbPointsInLayer);
// let scale = 0.01;
// let x = diameter + (position[0]);
// let y = diameter + (position[1]);

// for (let i = layers; i >= 0; i--){ //inwards spiral
//     for (let j = nbPointsInLayer; j >= 0; j--){
//         let theta =  (j*2*Math.PI/nbPointsInLayer); 
//         let outer = (2* Math.PI * i)*scale; 
//         x = ((x +(outer) + Math.sin(theta))) + (position[0]);
//         y = ((y +(outer) + Math.cos(theta))) + (position[1]);
        
//         basePath.push(x, y, height);
//     }
// }

// for (let i = 0; i <= layers; i++){ //outwards spiral
//     for (let j = 0; j <= nbPointsInLayer; j++){
//         // let rotate = -45; //for 30 nbPoints
//         let rotate = 1.5*nbPointsInLayer;
//         let theta =  (j*2*Math.PI/nbPointsInLayer); 
//         let outer = (2* Math.PI * i); 
//         let newX = ((x +(outer + theta) * Math.sin(theta + rotate))*scale);
//         let newY = ((y +(outer + theta) * Math.cos(theta + rotate))*scale);
//         x = newX + (position[0]);
//         y = newY + (position[1]);
//         basePath.push(x, y, height);
//     }
// }