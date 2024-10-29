import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {DragControls} from 'three/addons/controls/DragControls.js';

var global_state = { // TO FIX: adding optional svg using file I/O
    svgPath: "",
    nbLayers: 0.0,
    layerHeight: 0,
    path: [] //return this
};
window.state = global_state;
let defaultNbLayers = 0;
let defaultLayerHeight = 0;

// Build Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( {color : 0xfaead6}); //colors from styles.css for pathDrawing
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
camera.position.set(0, 40, 0); //adjust z with radius?
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
const zoomControls = new OrbitControls(camera, renderer.domElement);
zoomControls.enableRotate = false;
const yOffset = -.001

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


//Add crosshair at position[x, y]
const crossMaterial = new THREE.LineBasicMaterial({color: 0xddd321});
const crossHorizontalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(5, 0, 0), new THREE.Vector3( -5, 0, 0)]);
// const crossVerticalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -5, 0), new THREE.Vector3( 0, 5, 0)]);
const crossHorizontal = new THREE.Line(crossHorizontalGeometry, crossMaterial);
// const crossVertical = new THREE.Line(crossVerticalGeometry, crossMaterial);
scene.add(crossHorizontal);
// scene.add(crossVertical);

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
    window.state.path = [radialOffset, angularOffset];
}

function initializePath(nbLayers, layerHeight, pos=[0, 0, 0]){ //code repurposed from ToolpathUnitGenerator
    //set camera proportional to radius
    let circleGeometry = new THREE.CircleGeometry( nbLayers/10, 32 ); 
    camera.position.set(0, layerHeight*2, 0);

    //Make three-js group for adding draggable circle points
    position = pos;
    position[2] = 0;
    for(let i = 0; i < layerHeight; i++){
        const point = { //point, toolpath notation
            x: 0,
            y: 0,
            z: layerHeight*i,
            t: 0
        }
        //add draggable circle per point
        const circle = new THREE.Mesh(circleGeometry, circleMaterial ); 
        circle.position.set(point.x, point.y + yOffset, point.z);
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
    if(global_state.nbLayers.length != 0 && global_state.layerHeight.length != 0){
        initializePath(global_state.nbLayers, global_state.layerHeight);
        defaultLayerHeight = global_state.layerHeight;
        defaultNbLayers = global_state.nbLayers;
    }
}

function animate() {
	renderer.render( scene, camera );
    zoomControls.update();
    if(global_state.layerHeight != defaultLayerHeight || global_state.nbLayers != defaultLayerHeight){ //execute only on path update, delete and rebuild toolpath
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


initializePath(3, 4);