import Flatten from '../../node_modules/@flatten-js/core';
const {point, Polygon} = Flatten;
const { unify } = Flatten.BooleanOperations;

function getNumLayers(path0, path1){
  //return larger number of layers
  const layers0 = new Set();
  const layers1 = new Set();
  layers0.forEach(p => path0.add(p[2]));
  layers1.forEach(p => path1.add(p[2]));
  return Math.max(layers0.size, layers1.size);
}


function union(path0, path1, radius){
  //assuming path0 is an array of points [x, y, z] -> [[1, 2, 3], [4, 5, 6], ...]
  //Flattenjs doesn't take in a tolerance
  layers = getNumLayers(path0);

  let path = []

  for(let layer = 0; layer < layers0.length; layer++){
    let points0 = path0.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
    let points1 = path1.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));

    let polygon0 = new Polygon(points0);
    let polygon1 = new Polygon(points1);
    
    let combinedPolygon = unify(polygon0, polygon1);
    let filletedPolygon = combinedPolygon.fillet(radius); 
    let combinedLayerPoints = filletedPolygon.vertices.map(vertex => [vertex.x, vertex.y]);
    path.push(combinedLayerPoints);
  }
  return path;
}







//test:
/*
{
  let { point, segment, circle, arc, Polygon } = Flatten;
  const { unify } = Flatten.BooleanOperations;
  let pw = width / 48;
  let ph = height / 48;

  // Create new instance of polygon
  let polygon = new Polygon();
  let polygon1 = new Polygon();
 
const p1 = new Polygon([[0, 30], [30, 30], [30, 0], [0, 0]]);
const p2 = new Polygon([[20, 5], [20, 25], [40, 15]]);
const p3 = unify(p1, p2);
let combinedPolygonPoints = p3.vertices.map(vertex => [vertex.x, vertex.y]);


  let stage = d3.select(DOM.svg(width, height));

  // Add svg element to svg stage container
  stage.html(p3.svg());

  // return stage.node();
  return combinedPolygonPoints;
  // return JSON.stringify(combinedPolygonPoints);
}
*/