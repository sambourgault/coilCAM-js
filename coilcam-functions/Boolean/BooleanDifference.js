// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon} = Flatten;
const { subtract, intersect, outerClip} = Flatten.BooleanOperations;

export function difference(path0, path1, by_layer = true){ //revise
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
  let shapes = new Array();
  let total_num_points = 0;

  for(let layer of layers){
    let layer_points0 = points0.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let layer_points1 = points1.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let polygon0 = new Polygon(layer_points0);
    let polygon1 = new Polygon(layer_points1);
    if(polygon1.contains(polygon0)){ //skip layer
      continue;
    }
    if(polygon0.contains(polygon1)){ //do not subtract shapes, push all points from first shape
      for(let point of layer_points0){
        shapes[0].push(point.x, point.y, layer);
      }
    } else{
      let combinedPolygon = subtract(polygon0, polygon1);
      let polygonSVG = combinedPolygon.svg(); //convert to svg to rely on flatten-js's even-odd algorithm
      const shapesString = polygonSVG.match(/(M[^M]+z)/g); //separate svg into just the section containing points
      let shapeidx = 0;
      for (let shape of shapesString){
        let pairs = shape.match(/L-?\d+(\.\d+)?,-?\d+(\.\d+)?/g); //get pairs of points (not starting with M)
        for (let pair of pairs){
          if(shapes.length < shapeidx + 1){
            shapes.push([]);
          }
          if(!by_layer){ //push individual vessels to final array
            shapes[shapeidx].push(...pair.match(/-?\d+(\.\d+)?/g).map(parseFloat)); //push each pair as a float to the shapes arr
            shapes[shapeidx].push(layer);
          } else{
            shapes[0].push(...pair.match(/-?\d+(\.\d+)?/g).map(parseFloat));
            shapes[0].push(layer);
          }
        }
        // shapes[shapeidx].push(shapes[shapeidx][0], shapes[shapeidx][1], layer); //close the shape
        if(by_layer){ //close the shape: push starting point of current shape to end of shape
          shapes[0].push(shapes[0][(total_num_points)], shapes[0][(total_num_points)+1], layer);
          let num_points = (pairs.length+1)*3;
          total_num_points += num_points;
        } else{
          shapeidx += 1;
        }
      }
    }
  }
  path = shapes.flat();
  return path;
}

window.difference = difference;