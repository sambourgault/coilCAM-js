import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {DragControls} from 'three/addons/controls/DragControls.js';
var global_state = { // TO FIX: adding optional svg using file I/O
    svgPath: "",
    nbLayers: 0,
    layerHeight: 0.0,
    values: [] //return this
};
window.state = global_state;
let defaultNbLayers = 0;
let defaultLayerHeight = 0;

// Build Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( {color : 0xfaead6}); //colors from styles.css for pathDrawing
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
camera.position.set(0, 40, 0); //adjust z with radius?
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
const zoomControls = new OrbitControls(camera, renderer.domElement);
zoomControls.enableRotate = false;
const yOffset = 0;

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

//Add crosshair at position[x, y]
const crossMaterial = new THREE.LineBasicMaterial({color: 0xddd321});
const crossHorizontalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(5, 0, 0), new THREE.Vector3( 0, 0, 0)]);
const crossHorizontal = new THREE.Line(crossHorizontalGeometry, crossMaterial);
scene.add(crossHorizontal);


function calculateOffsets(){ // offset along the xy plane
    window.state.values = vec3Points.map(point => Math.max(-position[2], position[2] - point.x));
}

function initializePath(layerHeight, nbLayers, pos=[0, 0, 0]){ //code repurposed from ToolpathUnitGenerator
    //add vertical cross
    const crossVerticalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, layerHeight*nbLayers)]);
    const crossVertical = new THREE.Line(crossVerticalGeometry, crossMaterial);
    scene.add(crossVertical);

    //set camera proportional to radius
    let circleGeometry = new THREE.CircleGeometry(layerHeight/2, 32 ); 

    //Make three-js group for adding draggable circle points
    position = pos;
    for(let i = 0; i < nbLayers; i++){
        const point = { //point, toolpath notation
            x: 0,
            y: 0,
            z: layerHeight*i,
            t: 0
        }
        //add draggable circle per point
        const circle = new THREE.Mesh(circleGeometry, circleMaterial ); 
        circle.position.set(point.x, point.y + yOffset, point.z);
        circle.rotation.x = -Math.PI/2; // face the camera
        circleGroup.add(circle);
    }
    //draw lines from vec3
    vec3Points = [];
    circleGroup.children.forEach((c) => {
        vec3Points.push(c.position);
    })
    calculateOffsets();

    const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    const lines = new THREE.Line(lineGroup, lineMaterial);
    lines.name = "lines";
    scene.add(circleGroup);
    scene.add(lines);
}

// input values change
function refreshPath(){
    console.log("children", circleGroup.children);
    circleGroup.remove(...circleGroup.children);
    console.log("children", [...circleGroup.children]);
    scene.remove(scene.getObjectByName("lines"));
    if(global_state.nbLayers.length != 0 && global_state.layerHeight.length != 0){
        initializePath(global_state.layerHeight, global_state.nbLayers);
        defaultLayerHeight = global_state.layerHeight;
        defaultNbLayers = global_state.nbLayers;
    }
}

function animate() {
	renderer.render( scene, camera );
    zoomControls.update();
    if(global_state.layerHeight != defaultLayerHeight || global_state.nbLayers != defaultNbLayers){ //execute only on path update, delete and rebuild toolpath
        refreshPath();
    }
}

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//dragging points
let pointZ;
const controls = new DragControls(circleGroup.children, camera, renderer.domElement);
controls.addEventListener( 'dragstart', function ( event ) {
    pointZ = event.object.position.z;
	event.object.material = circleHighlightMaterial;
} );

controls.addEventListener('drag', function(event){
    var lines = scene.getObjectByName("lines");
    event.object.position.z = pointZ;
    scene.remove(lines);
    vec3Points = [];
    circleGroup.children.forEach((c) => {
        vec3Points.push(c.position);
    })
    const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    let newLines = new THREE.Line(lineGroup, lineMaterial);
    newLines.name = "lines";
    scene.add(circleGroup);
    scene.add(newLines);
});

controls.addEventListener( 'dragend', function ( event ) {
    event.object.position.z = pointZ;
	event.object.material = circleMaterial;
    calculateOffsets();
    window.parent.postMessage({message:"run-codemirror"}, '*'); // update TPV when dragend finished
});



// TODO:
// Create class for ProfileViewer so that LayerViewer and ProfileViewer both extend one default class
// Add visual warning system if the angle between layers is too high