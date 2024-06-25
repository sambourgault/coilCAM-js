// /* eslint-disable no-unused-vars */
import Flatten from '../../node_modules/@flatten-js/core/dist/main.mjs';
const {point, Polygon} = Flatten;
const {unify} = Flatten.BooleanOperations;

export function union(path0, path1, by_layer = true){
  let path = [];
  let points0 = [];
  let points1 = [];
  let layers = new Set();
  for(let i = 3; i <= path0.length; i+=4){
    points0.push(path0.slice(i-3, i+1))
  }
  for(let i = 3; i <= path1.length; i+=4){
    points1.push(path1.slice(i-3, i+1))
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

    let thicknesses = new Map(); //store thickness in external data structure
    for(let i = 0; i < points0.length; i++){
      if (points0[i][2] == layer){
        thicknesses.set([points0[i][0], points0[i][1]], points0[i][3]);
      }
    }
    for(let i = 0; i < points1.length/4; i +=4){
      if (points1[i][2] == layer){
        thicknesses.set([[points1[i][0]], points1[i][1]], points1[i][3]);
      }
    }

    console.log([...thicknesses.entries()]);

    //to add: tolerance
    let combinedPolygon = unify(polygon0, polygon1);
    let polygonSVG = combinedPolygon.svg(); //convert to svg to rely on flatten-js's even-odd algorithm
    const shapesString = polygonSVG.match(/(M[^M]+z)/g); //separate svg into just the section containing points
    let shapeidx = 0;

    for (let shape of shapesString){
      let pairs = shape.match(/L-?\d+(\.\d+)?,-?\d+(\.\d+)?/g); //get pairs of points (not starting with M)
      for (let pair of pairs){
        var thickness = thicknesses.has(pair.match(/-?\d+(\.\d+)?/g)); //todo: fix thickness (right now it's defaulting to "false" = 0)
        if(shapes.length < shapeidx + 1){
          shapes.push([]);
        }
        if(!by_layer){ //push individual vessels to final array
          shapes[shapeidx].push(...pair.match(/-?\d+(\.\d+)?/g).map(parseFloat)); //push each pair as a float to the shapes arr
          shapes[shapeidx].push(layer);
          shapes[shapeidx].push(thickness);
        } else{
          shapes[0].push(...pair.match(/-?\d+(\.\d+)?/g).map(parseFloat));
          shapes[0].push(layer);
          shapes[0].push(thickness);
        }
      }
      if(by_layer){ //close the shape: push starting point of current shape to end of shape
        shapes[0].push(shapes[0][(total_num_points)], shapes[0][(total_num_points)+1], layer, thickness);
        let num_points = (pairs.length+1)*4;
        total_num_points += num_points;
      } else{
        shapeidx += 1;
      }
      
    }
  }
  path = shapes.flat();
  console.log("union path", path);


  let test = new Map();
  let key = [300, 300];
  test.set(key, 2);

  var t = test.get(key);
  console.log("t", t); // Output: 2
  return path;
}

// export function unionAll(paths, by_layer = True){
//   let union_path = new Array();
//   for(let i = 1; i < paths.length; i++){
//     let new_path = union(paths[0], paths[i], by_layer);
    
//   }
// }

window.union = union;