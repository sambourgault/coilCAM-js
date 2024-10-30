import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {DragControls} from 'three/addons/controls/DragControls.js';

var global_state = { // TO FIX: adding optional svg using file I/O
    svgPath: "",
    radius: 0.0,
    nbPointsInLayer: 0,
    values: [] //return this
};
window.state = global_state;
let defaultRadius = 0;
let defaultNbPointsInLayer = 0;

// Build Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( {color : 0xfaead6}); //colors from styles.css for pathDrawing
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
camera.position.set(0, 0, 40); //adjust z with radius?
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
const zoomControls = new OrbitControls(camera, renderer.domElement);
zoomControls.enableRotate = false;
const zOffset = -.001

//Add crosshair at position[x, y]
const crossMaterial = new THREE.LineBasicMaterial({color: 0xddd321});
const crossHorizontalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(5, 0, 0), new THREE.Vector3( -5, 0, 0)]);
const crossVerticalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -5, 0), new THREE.Vector3( 0, 5, 0)]);
const crossHorizontal = new THREE.Line(crossHorizontalGeometry, crossMaterial);
const crossVertical = new THREE.Line(crossVerticalGeometry, crossMaterial);
scene.add(crossHorizontal);
scene.add(crossVertical);

var circleGroup = new THREE.Group();
circleGroup.name = "circleGroup";
const circleMaterial = new THREE.MeshToonMaterial( { color: 0xb7afa6 } ); 
const circleHighlightMaterial = new THREE.MeshToonMaterial( { color: 0xbc33ef } ); 
var position;
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x33bb4e });

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.z = 3
scene.add(directionalLight);
let vec3Points = [];
let defaultVec3Points = []; //save starting vec3

function calculateOffsets(){ //radial and angular offset
    let radialOffset = [];
    let angularOffset = [];
    let positionVec3 = new THREE.Vector3(0, 0, 1);
    for(let i = 0; i < defaultVec3Points.length; i++){
        const cross = new THREE.Vector3().crossVectors(defaultVec3Points[i], vec3Points[i]);
        const sign = cross.z >= 0 ? 1 : -1; //angle of rotation positive or negative based on cross product
        let angle = defaultVec3Points[i].angleTo(vec3Points[i]) * sign;
        angularOffset.push(angle);
    
        let newPt = defaultVec3Points[i].clone().applyAxisAngle(positionVec3, angle); 
        let dist = (vec3Points[i]).distanceTo(positionVec3) - (newPt).distanceTo(positionVec3);
        radialOffset.push(dist);
    }
    window.state.values = [radialOffset, angularOffset];
}

function initializePath(radius, nbPointsInLayer, pos=[0, 0, 0]){ //code repurposed from ToolpathUnitGenerator
    //set camera proportional to radius
    let circleGeometry = new THREE.CircleGeometry( radius/10, 32 ); 
    camera.position.set(0, 0, radius*2);

    //Make three-js group for adding draggable circle points
    position = pos;
    position[2] = 0;
    for(let i = 0; i < nbPointsInLayer; i++){
        let angle = 2 * i * Math.PI / nbPointsInLayer;
        const point = { //point, toolpath notation
            x: (position[0] + (radius) * Math.cos(angle + (Math.PI))),
            y: (position[1] + (radius) * Math.sin(angle + (Math.PI))),
            z: 0,
            t: 0
        }
        //add draggable circle per point
        const circle = new THREE.Mesh(circleGeometry, circleMaterial ); 
        circle.position.set(point.x, point.y, point.z + zOffset);
        circleGroup.add(circle);
    }
    //draw lines from vec3
    vec3Points = [];
    circleGroup.traverse(function(c){
        if(!(c.position.x == position[0] && c.position.y == position[1] && c.position.z == 0)){
            vec3Points.push(c.position);
        } 
    })
    defaultVec3Points = vec3Points.map(vec => vec.clone());
    calculateOffsets();
    vec3Points.push(vec3Points[0]);

    const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    const lines = new THREE.Line(lineGroup, lineMaterial);
    lines.name = "lines";
    scene.add(circleGroup);
    scene.add(lines);
}

// input values change
function refreshPath(){
    while (circleGroup.children.length)
    {
        circleGroup.remove(circleGroup.children[0]);
    }
    scene.remove(scene.getObjectByName("lines"));
    if(global_state.nbPointsInLayer.length != 0 && global_state.radius.length != 0){
        initializePath(global_state.radius, global_state.nbPointsInLayer);
        defaultRadius = global_state.radius;
        defaultNbPointsInLayer = global_state.nbPointsInLayer;
    }
}

function animate() {
	renderer.render( scene, camera );
    zoomControls.update();
    if(global_state.radius != defaultRadius || global_state.nbPointsInLayer != defaultNbPointsInLayer){ //execute only on path update, delete and rebuild toolpath
        refreshPath();
    }
}

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//dragging points
const controls = new DragControls(circleGroup.children, camera, renderer.domElement);
controls.addEventListener( 'dragstart', function ( event ) {
	event.object.material = circleHighlightMaterial;
} );

controls.addEventListener('drag', function(event){
    var lines = scene.getObjectByName("lines");
    scene.remove(lines);
    vec3Points = [];
    circleGroup.traverse(function(c){
        if(!(c.position.x == position[0] && c.position.y == position[1] && c.position.z == 0)){
            vec3Points.push(c.position);
        } 
    })
    vec3Points.push(vec3Points[0]);
    const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    let newLines = new THREE.Line(lineGroup, lineMaterial);
    newLines.name = "lines";
    scene.add(circleGroup);
    scene.add(newLines);
});

controls.addEventListener( 'dragend', function ( event ) {
	event.object.material = circleMaterial;
    calculateOffsets();
    window.parent.postMessage({message:"run-codemirror"}, '*'); // update TPV when dragend finished
});









// TODO:

//Clean up code
//Better UI/color palette

//Updating parameters
    //one: what to do if nbpointsinlayer updates
    // - linear interpolation algorithm: can calculate the distance between points, divide by certain percentage?
    // - should be O(n) ish
    //two: what to do if radius updates: 
    // - scale up/down points from radius (fairly straightforward)

//How to interpret path in TUG
    // Toolpath Unit Generator should have a check for RSP to test whether
    // RSP is an array or a list of point objects
    // If it's a list of point objects, set the radius as those point objects directly
    // (after confirming that the number of point objects = nbPointsInLayer)
    // Same goes for profile editor

//Future additions 
    // Add undo+redo+reset button, command+z shortcuts, shortcuts should only work if mouse is hovering over window
    // Add a way to select multiple points
    // Add a way to snap points to a cylindircal coordinate system/cartesian coordinates
    // Include an svg to toolpath function in the coilcam library
    // - Something like svgToRadius(radius, nbPointsInLayer, center=[0, 0])
    // - layerviewer should also be able to take in an SVG as a starting point
    // - Add function to display layerViewer as a popup or extra tab