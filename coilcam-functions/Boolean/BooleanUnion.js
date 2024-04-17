// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
// import Flatten from '@flatten-js/core';
const {point, Polygon} = Flatten;
const { unify } = Flatten.BooleanOperations;


export function union(path0, path1, radius){ //revise
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

  console.log(layers);
  // layers = [97];
  for(let layer of layers){
    let layer_points0 = points0.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let layer_points1 = points1.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let polygon0 = new Polygon(layer_points0);
    let polygon1 = new Polygon(layer_points1);
    
    let combinedPolygon = unify(polygon0, polygon1);
    // console.log("P0", polygon0.vertices);
    // console.log("P1", polygon1.vertices);
    // console.log("CP", combinedPolygon.vertices);
    let combinedLayerPoints = combinedPolygon.vertices.flatMap(vertex => [vertex.x, vertex.y, layer]);
    // console.log('combinedLayerPoints', combinedLayerPoints);
    path.push(...combinedLayerPoints);
  }
  return path;
}

window.union = union;
// console.log("union test:", union([20.0, 12.2, 34.0], [20.0, 12.2, 34.2], 3.0));