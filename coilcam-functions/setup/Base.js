// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon} = Flatten;
const {intersect} = Flatten.BooleanOperations;

export function baseSpiral(position, path, nbPointsInLayer, radius){ 
    console.log("test! path:", path);
    let basePoints = [];
    let basePath = [];
    let height = path[2]; //assuming toolpath is sorted with smallest height listed first
    console.log(height);
    for(let i = 0; i < nbPointsInLayer; i+=3){
        basePoints.push(path[i], path[i+1], path[i+2]);
    }

    let x = position[0];
    let y = position[1];
    for (let i = 0; i < 10; i+=3){
        for (let j = 0; j < nbPointsInLayer; j++){
            let theta =  (j*2*Math.PI/nbPointsInLayer); 
            let outer = ((2/3) * Math.PI * i); 
            let scale = .9; 
            x = (x + (outer + theta) * Math.cos(theta)) * scale;
            y = (y + (outer + theta) * Math.sin(theta)) * scale;
            basePath.push(x, y, height);
        }
    }

    console.log("base Path:", basePath);
    return basePath;
}

// var basePath = [57.14, 0, 7, -55.569999999999986, 65.07314884036272, 7, -55.570000000000036, -65.0731488403627, 7, 60.44, 0, 8, -57.219999999999985, 67.93103267285137, 8, -57.220000000000034, -67.93103267285134, 8, 63.739999999999995, 0, 9, -58.869999999999976, 70.78891650534001, 9, -58.87000000000003, -70.78891650533998, 9]
// var bs = baseSpiral([5.4, 2.4, 5.4], basePath, 60.0, 2.0);
// updatePath(bs);

// function baseZigzag(position, basePath, nbLayers, nbPointsInLayer, layerHeight, layerThickness, radius){
//     let lines = [];
//     let intersectPoints = [];
//     let points = basePath.map(p => point([p[0], p[1]]));
//     let baseCircle = new Polygon(points);

//     start = [position[0] - radius, position[1] - radius, layerHeight*2];
//     for (let i = 0; i*layerThickness < radius*2; i++){
//         let line = new Segment(point([start[0]+(i*layerThickness), start[1]],
//                     point([start[0]+(i*layerThickness), start[1]+radius*2])));
//         lines.push(line);
//     }
//     for(let i = 0; i < lines.length; i++){
//         intersectPoints.push(intersect(lines[i], baseCircle));
//     }
//     return intersectPoints;
// }

window.baseSpiral = baseSpiral;