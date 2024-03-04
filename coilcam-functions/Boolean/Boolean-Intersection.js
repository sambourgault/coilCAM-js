import Flatten from '@flatten-js/core'
const {point, Polygon} = Flatten;
const { intersect } = Flatten.BooleanOperations;

function getNumLayers(path0, path1){
    //return larger number of layers
    const layers0 = new Set();
    const layers1 = new Set();
    layers0.forEach(p => path0.add(p[2]));
    layers1.forEach(p => path1.add(p[2]));
    return Math.max(layers0.size, layers1.size);
}

function booleanIntersection(path0, path1, radius, tolerance){
    //assuming path0 is an array of points [x, y, z] -> [[1, 2, 3], [4, 5, 6], ...]
    //Flattenjs doesn't take in a tolerance
    layers = getNumLayers(path0);

    let path = []

    for(let layer = 0; layer < layers; layer++){
        let points0 = path0.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));
        let points1 = path1.filter(p => p[2] == layer).map(p => point([p[0], p[1]]));

        let polygon0 = new Polygon(points0);
        let polygon1 = new Polygon(points1);
        
        let combinedPolygon = intersect(polygon0, polygon1);
        let filletedPolygon = combinedPolygon.fillet(radius); 
        let combinedLayerPoints = filletedPolygon.vertices.map(vertex => (vertex.x, vertex.y));
        path.push(combinedLayerPoints);
    }
    return path
}





