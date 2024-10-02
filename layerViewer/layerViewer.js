import * as THREE from 'three';
// import {TransformControls} from 'three/addons/controls/TransformControls.js'
import {DragControls} from 'three/addons/controls/DragControls.js';
// Radius editor for dynamic toolchains
// Use an embedded iframe to view/edit SVG path using Threejs
// TODO: drag points, make code cleaner :~)

var global_state = { // can add optional svg using file I/O
    svgPath: "",
    radius: 0.0,
    nbPointsInLayer: 0,
};
window.state = global_state;

// Build Scene - using perspective camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( {color : 0xfaead6}); //colors from styles.css for pathDrawing
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
camera.position.set(0, 0, 40); //adjust z with radius?
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

//Add raycasting (mouse can click+drag points)
// https://stackoverflow.com/questions/47682260/three-js-draw-where-mouse-clicks-but-entirely-parallel-to-camera-orientation
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// // let transformControl = new TransformControls(camera, renderer.domElement);
// transformControl.showZ = false;

// //editing default look of transformcontrols 
// //tofix: remove white lines
// const gizmo = transformControl._gizmo.gizmo;
// console.log(gizmo.translate);
// const pointGeometry = new THREE.CircleGeometry( .05, 32 ); 
// const axisTriangle = {
//     a: new THREE.Vector3(1, 1, 0),
//     b: new THREE.Vector3(-1, 1, 0),
//     c: new THREE.Vector3(0, 2, 0),
// }
// const arrowGeometry = new THREE.Triangle(axisTriangle.a, axisTriangle.b,axisTriangle.c);

// for (let c in gizmo.translate.children){
//     const gizmoMesh =  gizmo.translate.children[c]; 

//     if(gizmoMesh.name == 'XY'){

//         gizmoMesh.geometry = pointGeometry;
//         console.log(gizmoMesh.geometry);
//     }
//     // if(gizmoMesh.name == 'Y'){
//     //     console.log(gizmoMesh.geometry);
//     //     gizmoMesh.geometry = arrowGeometry;
//     // }
//     if(gizmoMesh.name != 'XY'&& gizmoMesh.name != 'Y' && gizmoMesh.name != 'X'){
//         gizmoMesh.visible = false;
//         gizmo.translate.children[c].layers.disable(0);
//     }
// }


// scene.add(transformControl.getHelper());


var circleGroup = new THREE.Group();
circleGroup.name = "circleGroup";
const circleGeometry = new THREE.CircleGeometry( 3, 32 ); //tofix: proportional to radius
const circleMaterial = new THREE.MeshToonMaterial( { color: 0xb7afa6 } ); 
const circleHighlightMaterial = new THREE.MeshToonMaterial( { color: 0xbc33ef } ); 
const lineMaterial = new THREE.LineBasicMaterial( { color: 0xbf472e } ); 

var path = []; // store points in path syntax (x, y, z, t)
var vec3Points = []; // store points in vec3 syntax
var circleMap = new Map();

function initializePath(radius, nbPointsInLayer, position=[0, 0, 0]){ //code repurposed from ToolpathUnitGenerator
    //Make three-js group for adding draggable circle points
    
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
        const vec3Point = new THREE.Vector3(point.x, point.y, point.z);//store point as vector
        vec3Points.push(vec3Point);
        
        //add draggable circle per point
        const circle = new THREE.Mesh( circleGeometry, circleMaterial ); 
        circle.position.set(point.x, point.y, point.z);
        circleGroup.add(circle);
        circleMap.set(circle, vec3Point);
    }

    //draw lines from vec3
    const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    const lines = new THREE.Line(lineGroup, lineMaterial);
    lines.name = "lines";
    scene.add(lines);
    scene.add(circleGroup);
}

// Build Scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.z = 3
scene.add(directionalLight);
initializePath(10, 9); //test



function animate() {
	renderer.render( scene, camera );
}

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//dragging points
let mouseStart;
const controls = new DragControls(circleGroup.children, camera, renderer.domElement);
controls.addEventListener( 'dragstart', function ( event ) {
    mouseStart = new THREE.Vector3(mouse.x, mouse.y, 0);
    console.log(event.object);
	event.object.material = circleHighlightMaterial;
} );

controls.addEventListener('drag', function(event){
    let offset = new THREE.Vector3().sub(mouseStart, new THREE.Vector3(mouse.x, mouse.y, 0));
    const point = circleMap.get(event.object);
    point.set = offset;
    console.log(vec3Points);
    //   //draw lines from vec3
    // var l = scene.getObjectByName("lines");
    // const lineGroup = new THREE.BufferGeometry().setFromPoints(vec3Points);
    // l = new THREE.Line(lineGroup, lineMaterial);
})

controls.addEventListener( 'dragend', function ( event ) {
	event.object.material = circleMaterial;
});





// notes

//two things
    //one: what to do if nbpointsinlayer updates
    // - store path as svg, then write code to distribute points on path?
    // - i don't like the idea of the path updating and resetting everything
    // - algorithm: can calculate the distance between points, divide by certain percentage?
    // - should be O(n) ish
    // - linear interpolation my BELOVEDDD
    //two: what to do if radius updates: 
    // - who cares! just scale up points like its cool


// should convert to offsets easily interpreted by TUG? but this is hard bc points
    // are on radial path out from center, can't cluster points or redistribute
    // tldr radsp relies on a multiplier with radius
    // can also edit TUG to take in a rad2D boolean parameter to make it so position[x, y]
    // are controlled DIRECTLY by radsp
    // or a check that's like: is radsp a toolpath? if so, take radsp points directly!
    // second option is best imo bc it requires no extra parameters/functions :~)
    // but i should probably include the svg to toolpath code in the coilcam library
    // maybe like svgToRadius(radius, nbPointsInLayer, center=[0, 0])


    
//should also probably add undo+redo+reset button, command+z shortcuts?
//shortcuts should only work if mouse is hovering over window?