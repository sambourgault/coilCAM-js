// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon, Segment} = Flatten;
const {intersect} = Flatten.BooleanOperations;

// function triangularize(path){
//     let trianglePath = [];
//     for(let i = 0; i < path.length-4;i+=4){
//       //vertical triangles
//       let thicknessP1 = 1.5 + path[i+3];
//       let thicknessP2 = 1.5 + path[i+7];
  
//       let p1 = [path[i], path[i+1], path[i+2]];
//       let p2 = [path[i+4], path[i+5], path[i+6]];
  
//       trianglePath.push(path[i], path[i+1], path[i+2]+thicknessP1);
//       trianglePath.push(path[i], path[i+1], path[i+2]-thicknessP1);
//       trianglePath.push(path[i+4], path[i+5], path[i+6]-thicknessP2);
  
//       trianglePath.push(path[i+4], path[i+5], path[i+6]+thicknessP2);
//       trianglePath.push(path[i+4], path[i+5], path[i+6]-thicknessP2);
//       trianglePath.push(path[i], path[i+1], path[i+2]+thicknessP1);
//     }
//     return trianglePath;
//   }

export function baseSpiral(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius, rotate=0){ 
    let basePoints = [];
    let basePath = [];
    let height = layerHeight;
    for(let i = 0; i < nbPointsInLayer; i+=3){
        basePoints.push(path[i], path[i+1], path[i+2], 0);
    }

    let diameter = radius*2;
    let layers = (nbPointsInLayer*diameter/(nozzle_diameter*4));
    let scale = nozzle_diameter/Math.PI;
    let bias = .0001;
    let step = 2 * Math.PI / nbPointsInLayer;
    let offset = nbPointsInLayer % 2 == 0 ? 0 : Math.PI/(nbPointsInLayer); //offset slightly if odd # of points

    for (let angle = -layers * step; angle < layers * step; angle += step) {
        let spiralRadius = scale * angle;
        if (angle < 0) { //inwards spiral
            let x = bias + position[0] + spiralRadius * Math.cos(angle-offset);
            let y = bias + position[1] + spiralRadius * Math.sin(angle-offset);
            basePath.push(x, y, height, 0);
        }

        else { //outwards spiral
            let x = bias + position[0] + spiralRadius * Math.sin(angle+Math.PI/2);
            let y = bias + position[1] + spiralRadius * Math.cos(angle+Math.PI/2);
            basePath.push(x, y, height, 0);
        }
        
    }
    return basePath;
}


export function baseFill(position, path, nbPointsInLayer, layerHeight, nozzle_diameter, radius){
    let basePath = [];
    let height = layerHeight;
    for(let i = 0; i < nbPointsInLayer*4; i+=4){
        basePath.push(point(path[i], path[i+1]));
    }

    let baseCircle = new Polygon(basePath);
    
    let diameter = radius*2;
    let start = [position[0] - diameter, position[1] - diameter, layerHeight*2];
    let newPoints = [];

    for (let i = 0; i < (diameter*2); i+=nozzle_diameter){
        let line = new Segment(point([start[0]+(i), start[1]]), point([start[0]+(i), start[1]+(diameter*2)]));
        let intersectionPoints = (line.intersect(baseCircle).map(pt => [pt.x, pt.y])).flat();
        if(intersectionPoints.length == 4){
            if(i % (2*nozzle_diameter) == 0){
                newPoints.push(intersectionPoints[0], intersectionPoints[1]);
                newPoints.push(height, 0);
                newPoints.push(intersectionPoints[2], intersectionPoints[3]);
                newPoints.push(height, 0);
            } else{
                newPoints.push(intersectionPoints[2], intersectionPoints[3]);
                newPoints.push(height, 0);
                newPoints.push(intersectionPoints[0], intersectionPoints[1]);
                newPoints.push(height, 0);
            }
        } 
    }
    return newPoints;
}

export function base(position, path, nbPointsInLayer, layerHeight, nozzleDiameter, radius){
    let bottomBase = baseFill(position, path, nbPointsInLayer, layerHeight, nozzleDiameter, radius);
    let topBase = baseSpiral(position, path, nbPointsInLayer, layerHeight*2, nozzleDiameter, radius);
    let newPath = bottomBase.concat(topBase);
    return newPath;
    console.log("basepath fill", bottomBase);
    // return triangularize(baseFill);
}

export function addBase(b, path){
    return b.concat(path);
}

window.baseSpiral = baseSpiral;
window.baseFill = baseFill;
window.base = base;