// import {point, Segment, Polygon, intersect} from '@flatten-js';

function baseSpiral(position, basePath, radius, layerThickness){ 
    let path = [];
    let contour = [];
    let nbPointsInLayer = basePath.length;
    let numSpirals = 5;
    for(let i = 0; i < numSpirals; i++){
        let angle = 2 * i * Math.PI / nbPointsInLayer;
        path.push(position[0] + (radius-(layerThickness*numSpirals)) * Math.cos(angle), position[1] + (radius-(layerThickness*numSpirals))* Math.sin(angle), position[2]+numSpirals*10);
        // contour.push(path[path.length - 1][0] - position[0], path[path.length - 1][1] - position[1], 0);
    }
    // console.log("Path:", path);
    // path.push(path[0]);
    // contour.push(path[path.length - 1]);
    return path;
}

var basePath = [57.14, 0, 7, -55.569999999999986, 65.07314884036272, 7, -55.570000000000036, -65.0731488403627, 7, 60.44, 0, 8, -57.219999999999985, 67.93103267285137, 8, -57.220000000000034, -67.93103267285134, 8, 63.739999999999995, 0, 9, -58.869999999999976, 70.78891650534001, 9, -58.87000000000003, -70.78891650533998, 9]
var bs = baseSpiral([5.4, 2.4, 5.4], basePath, 60.0, 2.0);
updatePath(bs);

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

// function base(position, nbPointsInLayer, layerHeight, layerThickness, radius){
//     //Circular base
//     path = [];
// }