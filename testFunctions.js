// Testing functions before adding to coilCAM library

// Export these as a 2D array of polar coordinates: offset from radius plus angle offset
// The reason for this being that TUG currently interprets radial offset as a polar coordinate
// This should work because TUG no longer takes in a 2D array for radius to account for a nbpoints * nblayers array
// one issue is that there's no way to screen out radius from accepting a linear2D array 
// all this nonsense shouldn't (should?) be int the coilcam library???
export default function customRadius(radius, nbPointsInLayer, position){
    let radialOffsets = [];
    let angularOffsets = [];
    return new Array(radialOffsets, angularOffsets); 
}

window.linear2D = linear2D;