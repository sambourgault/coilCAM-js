import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export default class ToolpathViewer {
    scene;
    camera;
    renderer;
    TPVcontainer;
    controls;
    transformControls;
    raycaster;
    defaultPath; //stores current path inside TPV, check against global state path to monitor for changes
    defaultReferencePath;
    defaultBedDimensions = [28.0, 26.5, 30.5]; // 1 3js = 10 mm
    globalState = { //variables updatable outside toolpathviewer
        path: [],
        referencePath: [],
        bedDimensions: [28.0, 26.5, 30.5]
    };
    baseHeight = 1; //height for base of printer bed (constant)
    circles; //store the editable points
    hoverOver = false; // check whether mouse is hovering over object
    dragging = false; // check whether toggle point is being dragged
    dragpoint = false;
    pointToLinesMap = new Map(); // map assist objects to cylinders
    uuidToPoint = new Map();

    constructor(TPVcontainer) {
        this.TPVcontainer = TPVcontainer;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.defaultPath = this.globalState.path;
        this.defaultReferencePath = this.globalState.referencePath;

        window.state = this.globalState;

        this.initScene();
        
        this.circles = new THREE.Group(); // store editable spheres in threejs group
        this.circles.name = "circles";
        this.scene.add(this.circles);
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.scene.add(this.controls);
        this.scene.add(this.transformControls.getHelper());

        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize.bind(this));
        window.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.body.addEventListener('pointerdown', this.pointerDown.bind(this));
        document.body.addEventListener('pointerup', this.pointerUp.bind(this));
    }

    pointerUp(){
        if(this.transformControls.object){
            this.controls.enabled = true;
            this.transformControls.detach();
            this.dragging = false;
            this.dragpoint = null;
            // this.toolpath
        };
    }

    pointerDown(){
        if(this.transformControls.object && this.hoverOver){
            this.controls.enabled = false;
            this.dragging = true;
            this.dragpoint = this.transformControls.object.position;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onPointerMove(event) { 
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera( this.pointer, this.camera );
        const intersects = this.raycaster.intersectObjects(this.circles.children, true );
        this.hoverOver = intersects.length > 0;
        if (this.hoverOver) {
            const object = intersects[ 0 ].object;
            if ( object !== this.transformControls.object ) {
                console.log(object);
                object.material = new THREE.MeshToonMaterial({color: 0x9a2033})
                this.transformControls.attach(object);
            }
        }
    }

    //initialize 3js elements
    initScene(){
        this.scene.background = new THREE.Color(0xe3e1de);
        this.camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
        this.camera.position.set(-2, -20, 30);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.createPrinterBed(this.scene, this.globalState.bedDimensions);
        this.createPath(this.scene, this.globalState.path);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.z = 3;
        this.scene.add(directionalLight);
    }

    createPrinterBedLines(dimensions, material){ //make line building a little less repetitive
        const lines = []; 
        const offsets = [[1, 1], [1, -1], [-1, -1], [-1, 1]]; 
        for(let i = 0; i < 8; i++){
            const points = [];
            if(i < 4){
                points.push(new THREE.Vector3(-dimensions[0]/2 * offsets[i][0], dimensions[1]/2 * offsets[i][1], this.baseHeight/2 + dimensions[2]));
                points.push(new THREE.Vector3(-dimensions[0]/2 * offsets[i][0], dimensions[1]/2 * offsets[i][1], this.baseHeight/2));
            } else{
                points.push(new THREE.Vector3(-dimensions[0]/2 * offsets[i%4][0], dimensions[1]/2 * offsets[i%4][1], this.baseHeight/2 + dimensions[2]));
                points.push(new THREE.Vector3(-dimensions[0]/2 * offsets[(i+1)%4][0], dimensions[1]/2 * offsets[(i+1)%4][1], this.baseHeight/2 + dimensions[2]));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const line = new THREE.Line( geometry, material );
            lines.push(line);
        }
        return lines;
    }

    // Create printer bed based on user dimensions - default to baby potterbot dimensions
    createPrinterBed(scene, dimensions){
        const printerBed = new THREE.Group(); //group for printer bed
        const printerBedBorders = new THREE.Group(); //group for borders, require different update function
        printerBedBorders.name = "printerBedBorders";
        printerBed.name = "printerBed";

        const baseGeometry = new THREE.BoxGeometry(dimensions[0], dimensions[1], this.baseHeight);
        const baseMaterial = new THREE.MeshToonMaterial( { color: 0xb7afa6 } ); 
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.name = "printerBedBase";
        printerBed.add(base);
        
        const bordersMaterial = new THREE.MeshToonMaterial( { color: 0xfaead6 } ); //borders of printer bed
        const bordersGeometry = this.createPrinterBedLines(dimensions, bordersMaterial);
        for(const line of bordersGeometry){
            printerBedBorders.add(line);
        }
        printerBed.add(printerBedBorders);
        console.log(printerBed.position);
        printerBed.position.set(dimensions[0]/2, dimensions[1]/2, -this.baseHeight/2);
        console.log(printerBed.position);
        scene.add(printerBed);
    }

    //helper function to convert line segment to cylinder (for thickness)
    //lineWidth() ThreeJS has a maximum/minimum limit of 1
    cylinderFromPoints(pointStart, pointEnd, material){
        let pointStartThickness = 0;
        let pointEndThickness = 0;
        if(!pointStart.isVector3){ //convert to Vec3
            pointStartThickness = pointStart.t;
            pointStart = new THREE.Vector3(pointStart.x, pointStart.y, pointStart.z); 
        }
        if(!pointEnd.isVector3){
            pointEndThickness = pointEnd.t;
            pointEnd = new THREE.Vector3(pointEnd.x, pointEnd.y, pointEnd.z);
        }

        var dir = new THREE.Vector3().subVectors(pointEnd, pointStart);
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()); 

        var offset = new THREE.Vector3(); //midpoint of cylinder
        offset.addVectors(pointEnd, pointStart).divideScalar(2);
        
        const segmentGeometry = new THREE.CylinderGeometry(pointEndThickness+1, pointStartThickness+1, dir.length(), 8);
        const segment = new THREE.Mesh(segmentGeometry, material); 
        segment.quaternion.copy(quat);
        segment.position.set(offset.x, offset.y, offset.z);
        return segment;
    }

    // turn collection of points into toolpath
    // with added circles this time
    createPath(scene, path, pathType){
        if(path.length === 0){
            return;
        }
        this.pointToLinesMap.clear();
        let circleGeometry = new THREE.BoxGeometry(5, 5, 5);
        let circleMaterial = new THREE.MeshToonMaterial({color: 0x998f86})
        
        const toolpath = new THREE.Group(); //group for printer bed
        var material;
        if(pathType == "path"){
            toolpath.name = "path";
            material = new THREE.MeshToonMaterial( {color: 0x212121} ); 
        }
        if(pathType == "referencePath"){
            toolpath.name = "referencePath";
            material = new THREE.MeshToonMaterial( {color: 0x0091c2} ); 
        }
        for(let i = 0; i < path.length ; i++){
            const circle = new THREE.Mesh(circleGeometry, circleMaterial ); 
            circle.position.set(path[i].x, path[i].y, path[i].z);
            this.circles.add(circle);
            if(i != path.length - 1){
                toolpath.add(this.cylinderFromPoints(path[i], path[i+1], material));
            }
            this.uuidToPoint.set(circle.uuid, i);
        }
        //BY INDEX
        this.pointToLinesMap.set(this.circles.children[0].uuid, [undefined, 0]);
        for( let i = 1; i < path.length - 2; i++){
            this.pointToLinesMap.set(this.circles.children[i].uuid, [i-1, i]);
        }
        this.pointToLinesMap.set(this.circles.children[this.circles.children.length-1].uuid, [toolpath.children.length-1, undefined]);
      
        // // BY UUID
        // this.pointToLinesMap.set(this.circles.children[0].uuid, toolpath.children[0].uuid);
        // for( let i = 1; i < path.length - 2; i++){
        //     this.pointToLinesMap.set(this.circles.children[i].uuid, [toolpath.children[i-1].uuid, toolpath.children[i].uuid]);
        // }
        // this.pointToLinesMap.set(this.circles.children[this.circles.children.length-1].uuid, [toolpath.children[toolpath.children.length-1].uuid]);
      
        this.circles.scale.set(.1, .1, .1);
        console.log(this.circles);
        toolpath.scale.set(.1, .1, .1); //scale relative to printer bed, 10 3js = 1m
        scene.add(toolpath);
    }

    // Change toolpath on update
    refreshPath(scene, pathType){
        console.log("REFRESH");
        const toolpath = scene.getObjectByName(pathType); 
        scene.remove(toolpath);
        const circles = scene.getObjectByName("circles"); 
        circles.clear();

        if(pathType === "path" && this.globalState.path.length != 0){
            this.createPath(scene, this.globalState.path, pathType);
            this.defaultPath = this.globalState.path;
        }
        if(pathType === "referencePath" && this.globalState.referencePath.length != 0){
            this.createPath(scene, this.globalState.referencePath, pathType);
            this.defaultReferencePath = this.globalState.referencePath;
        }
    }

    // Update viewer on camera shift, changes in dimensions/toolpath
    animate() {
        this.controls.update();
        this.transformControls.update();
        this.renderer.render(this.scene, this.camera);
        if(JSON.stringify(this.globalState.bedDimensions) !== JSON.stringify(this.defaultBedDimensions) && this.globalState.bedDimensions.length !== 0){
            var borders = this.scene.getObjectByName("printerBedBorders");  //update borders
            borders.scale.set(this.globalState.bedDimensions[0]/(this.defaultBedDimensions[0]), 
                this.globalState.bedDimensions[1]/(this.defaultBedDimensions[1]), 
                this.globalState.bedDimensions[2]/(this.defaultBedDimensions[2]));

            var base = this.scene.getObjectByName("printerBedBase"); //update base (don't scale z)
            base.scale.set(this.globalState.bedDimensions[0]/(this.defaultBedDimensions[0]), 
                this.globalState.bedDimensions[1]/(this.defaultBedDimensions[1]), 
                1);
            this.defaultBedDimensions = this.globalState.bedDimensions;
            var printerBed = this.scene.getObjectByName("printerBed"); //reposition group
            printerBed.position.set(-(this.globalState.bedDimensions[0]/20), -this.globalState.bedDimensions[1]/20, -this.baseHeight/2);
        }
        if(this.globalState.path != this.defaultPath){ //execute only on path update, delete and rebuild toolpath
            this.refreshPath(this.scene, "path");
        }
        if(this.globalState.referencePath != this.defaultReferencePath){ //execute only on path update, delete and rebuild toolpath
            this.refreshPath(this.scene, "referencePath");
        }
        if(this.transformControls.object && this.hoverOver && this.dragging){ //run if dragging object
            // BY POSITION IN TOOLPATH
            let newMaterial = new THREE.MeshToonMaterial({color: 0x6e4032});
            let cylinderIDs = this.pointToLinesMap.get(this.transformControls.object.uuid);
            let toolpath = this.scene.getObjectByName("path");
            for(let i = 0; i < cylinderIDs.length; i++){
                if (cylinderIDs[i] == undefined){
                    continue;
                }
                let obj = toolpath.children[cylinderIDs[i]];
                
                let newCylinder;
                if(i == 0){
                    newCylinder = this.cylinderFromPoints(this.globalState.path[cylinderIDs[i]], this.transformControls.object.position, newMaterial);
                } else{
                    newCylinder = this.cylinderFromPoints(this.transformControls.object.position, this.globalState.path[cylinderIDs[i]+1], newMaterial);
                }
                this.globalState.path[this.uuidToPoint.get(this.transformControls.object.uuid)] = this.transformControls.object.position;
                obj.copy(newCylinder);
            }
            
            // // USING UUID TO GET EXACT CYLINDER
            // let cylinderUUIDs = this.pointToLinesMap.get(this.transformControls.object.uuid);
            // if(cylinderUUIDs != undefined){
            //     let newMaterial = new THREE.MeshToonMaterial({color: 0x2e4032});
            //     for(let i = 0; i < cylinderUUIDs.length; i++){
            //         let obj = this.scene.getObjectByProperty("uuid", cylinderUUIDs[i]);
            //         console.log(obj);

            //         //determine start and end points of each cylinder segment from quaternion and height
            //         const localAxis = new THREE.Vector3(0, 1, 0);
                    
            //         const worldDirection = localAxis.clone().applyQuaternion(obj.quaternion);

            //         let segmentHeight = obj.geometry.parameters.height;
            //         const halfLengthVector = worldDirection.multiplyScalar(segmentHeight/2);
            //         const pointStart = obj.position.clone().sub(halfLengthVector);
            //         const pointEnd = obj.position.clone().add(halfLengthVector);
                    
            //         console.log("start", pointStart, "end", pointEnd);

            //         const testPT = {
            //             x: 0.0,
            //             y: 0.0,
            //             z: 0.0,
            //             t: -0.9
            //         };                    
            //         let newCylinder;
            //         if(i == 0){ //pointEnd will be the edited point of the cylinder
            //             newCylinder = this.cylinderFromPoints(pointStart, testPT, newMaterial);
                        
            //             console.log("newCylinder", newCylinder);
            //         } else{ //pointStart will be the edited point of the cylinder
            //             newCylinder = this.cylinderFromPoints(testPT, pointEnd, newMaterial);
            //         }
            //         obj.geometry = newCylinder.geometry;
            //         // toolpath.remove(obj);
            //     }
            // }
        }
    }
}
window.ToolpathViewer = ToolpathViewer;

window.addEventListener('DOMContentLoaded', () => {
    const TPVcontainer = document.getElementById('toolpathVieweriFrame'); // select the div
    const TPV = new ToolpathViewer(TPVcontainer);
});