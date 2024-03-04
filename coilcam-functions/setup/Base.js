// (Point3D) Position: Point (x, y, z) to position the form’s center 
// (int) nbLayers: number of layers in the form
// (int) nbPointsInLayer: number of points per layer
// (float) Layer Height: layer height, should be around half the nozzle size
// (float) Layer thickness: layer thickness, should be around the nozzle size used to print.
// (float) Radius: The radius of the base. 
import Flatten from '@flatten-js/core'
const {point, Polygon} = Flatten;
const { intersect } = Flatten.BooleanOperations;

function baseSpiral(radius){
    let path = [];
    let contour = [];
    for(let i = 0; i < nbPoints; i++){
        let angle = 360/nbPoints;
        path.push([position[0] + radius * Math.cos(i*angle), position[1] + radius * Math.sin(i*angle), position[2]]);
        contour.push([path[path.length - 1][0] - position[0], path[path.length - 1][1] - position[1], 0]);
    }
    path.push(path[0]);
    contour.push(path[path.length - 1]);
    path.fillet(radius); 
}

function baseZigzag(basePath, nbLayers, nbPointsInLayer, layerHeight, layerThickness, radius){
   
}

function convexBase(position, nbPointsInLayer, layerHeight, layerThickness, radius){
    path = []

}