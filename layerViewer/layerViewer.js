import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {DragControls} from 'three/addons/controls/DragControls.js';
// Radius editor for dynamic toolchains
// Use an embedded iframe to view/edit SVG path using Threejs

var global_state = { // can add optional svg using file I/O
    svgPath: "",
    radius: 0.0,
    nbPointsInLayer: 0,
};
window.state = global_state;

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
const crossHorizontalGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( -1, 0, 0)]);
const crossVerticalGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3( 0, -1, 0 ), new THREE.Vector3( 0, 1, 0)]);
const crossHorizontal = new THREE.Line(crossHorizontalGeo, crossMaterial);
const crossVertical = new THREE.Line(crossVerticalGeo, crossMaterial);
scene.add(crossHorizontal);
scene.add(crossVertical);

var circleGroup = new THREE.Group();
circleGroup.name = "circleGroup";
const circleGeometry = new THREE.CircleGeometry( 3, 32 ); //tofix: proportional to radius
const circleMaterial = new THREE.MeshToonMaterial( { color: 0xb7afa6 } ); 
const circleHighlightMaterial = new THREE.MeshToonMaterial( { color: 0xbc33ef } ); 
var position;
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x33bb4e });

var path = []; // store points in path syntax (x, y, z, t)

function initializePath(radius, nbPointsInLayer, pos=[0, 0, 0]){ //code repurposed from ToolpathUnitGenerator
    //Make three-js group for adding draggable circle points
    position = pos;
    for(let i = 0; i < nbPointsInLayer; i++){
        //calculate default position
        let angle = 2 * i * Math.PI / nbPointsInLayer;
        const point = { //point, toolpath notation
            x: (position[0] + (radius) * Math.cos(angle)),
            y: (position[1] + (radius) * Math.sin(angle)),
            z: 0,
            t: 0
        }
        path.push(point); // store path in toolpath notation
        //add draggable circle per point
        const circle = new THREE.Mesh( circleGeometry, circleMaterial ); 
        circle.position.set(point.x, point.y, point.z + zOffset);
        circleGroup.add(circle);

    }

    //draw lines from vec3
    let vec3Points = [];
    circleGroup.traverse(function(c){
        if(!(c.position.x == position[0] && c.position.y == position[1] && c.position.z == position[2])){
            vec3Points.push(c.position);
        } 
    })
    vec3Points.push(vec3Points[0]);
    
    const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    const lines = new THREE.Line(lineGroup, lineMaterial);
    lines.name = "lines";
    scene.add(circleGroup);
    scene.add(lines);
}

// Build Scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.z = 3
scene.add(directionalLight);
initializePath(10, 9); //test values

function animate() {
	renderer.render( scene, camera );
    zoomControls.update();
}

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//dragging points
const controls = new DragControls(circleGroup.children, camera, renderer.domElement);
controls.addEventListener( 'dragstart', function ( event ) {
    console.log(event.object);
	event.object.material = circleHighlightMaterial;
} );

controls.addEventListener('drag', function(event){
    var lines = scene.getObjectByName("lines");
    scene.remove(lines);
    //draw lines from vec3
    let vec3Points = [];
    circleGroup.traverse(function(c){
        if(!(c.position.x == position[0] && c.position.y == position[1] && c.position.z == position[2])){
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