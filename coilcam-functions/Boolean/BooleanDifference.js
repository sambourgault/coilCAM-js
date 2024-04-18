// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon} = Flatten;
const { subtract, intersect, outerClip} = Flatten.BooleanOperations;

export function difference(path0, path1){ //revise
  let path = [];
  let points0 = [];
  let points1 = [];
  let layers = new Set();
  for(let i = 2; i <= path0.length; i+=3){
    points0.push(path0.slice(i-2, i+1))
  }
  for(let i = 2; i <= path1.length; i+=3){
    points1.push(path1.slice(i-2, i+1))
  }
  points0.sort((a, b) => a[2] - b[2]);
  points1.sort((a, b) => a[2] - b[2]);
  points0.forEach(point => layers.add(point[2]));
  points1.forEach(point => layers.add(point[2]));
  layers = [97];
  for(let layer of layers){
    let layer_points0 = points0.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let layer_points1 = points1.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let polygon0 = new Polygon(layer_points0);
    let polygon1 = new Polygon(layer_points1);
    
    let combinedPolygon = subtract(polygon0, polygon1);
    let points = [];
    let regex = /(?<=L)-?\d+(\.\d+)?,-?\d+(\.\d+)?/g; //regex to extract points from the svg path
    let polygonSVG = combinedPolygon.svg(); //convert to svg to rely on flatten-js's even-odd algorithm
    let shapes = polygonSVG.match(/M[^M]*/g);
    console.log("Shapes", shapes);
    console.log("polygonSVG", polygonSVG);
    for (let shape of shapes){
      shape.match(regex).map(point => { //convert from svg to list of points
        let [x, y] = point.split(',');
        points.push(parseInt(x));
        points.push(parseInt(y));
        points.push(layer);
      });
    }
    path.push(...points);
  }
  console.log("path", path);
  return path;
}

window.difference = difference;