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
        bedDimensions: [28.0, 26.5, 30.5],
        outputPath: [] //return this
    };
    baseHeight = 1; //height for base of printer bed (constant)
    dragPoints; //store the editable points
    hoverOver = false; // check whether mouse is hovering over object
    uuidToPoint = new Map(); //maps the uuid of each draggable point to its index in the toolpath group
    
    cylinderMaterial = new THREE.MeshToonMaterial({color: 0x000000});
    cylinderReferenceMaterial = new THREE.MeshToonMaterial({color: 0x0091c2}); 
    cylinderHighlightMaterial = new THREE.MeshToonMaterial({color: 0x826f63});
    highlightedMaterials = false; // check whether materials are currently highlighted

    constructor(TPVcontainer) {
        this.TPVcontainer = TPVcontainer;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.defaultPath = this.globalState.path;
        this.defaultReferencePath = this.globalState.referencePath;
        window.state = this.globalState;
        this.initScene();
        
        this.dragPoints = new THREE.Group(); // store editable spheres in threejs group
        this.dragPoints.name = "circles";
        this.scene.add(this.dragPoints);
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
            this.transformControls.object.material = this.cylinderMaterial;
            this.controls.enabled = true;
            this.transformControls.detach();
            window.state.outputPath = this.globalState.path;
            console.log("OUTPUT PATH:", window.state.outputPath);
            // window.parent.postMessage({message:"run-codemirror"}, '*'); // update TPV when dragend finished
        };
    }

    pointerDown(){
        if(this.transformControls.object){
            this.controls.enabled = false; 
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
        
        const intersects = this.raycaster.intersectObjects(this.dragPoints.children, true );
        this.hoverOver = intersects.length > 0;
        if (this.hoverOver) {
            const object = intersects[ 0 ].object;
            if ( object !== this.transformControls.object ) {
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
    //note: built in ThreeJS function lineWidth() will not render any width other than 1
    cylinderFromPoints(pointStart, pointEnd, material, dragPointThickness=0){
        let pointStartThickness = dragPointThickness;
        let pointEndThickness = dragPointThickness;
        console.log("point start:", pointStart);
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

    createPath(scene, path, pathType){
        if(path.length === 0){
            return;
        }
        let circleGeometry = new THREE.SphereGeometry(1, 16, 16); 
        
        const toolpath = new THREE.Group(); //group for printer bed
        var material;
        if(pathType == "path"){
            toolpath.name = "path";
            material = this.cylinderMaterial;
        }
        if(pathType == "referencePath"){
            toolpath.name = "referencePath";
            material = this.cylinderReferenceMaterial;
        }
        for(let i = 0; i < path.length ; i++){
            const dragPoint = new THREE.Mesh(circleGeometry, this.cylinderMaterial); 
            dragPoint.position.set(path[i].x, path[i].y, path[i].z);
            let dragPointRadius = 2 + path[i].t; //dragpoint radius proportional to thickness - hard to grab extremely thin points
            dragPoint.scale.set(dragPointRadius, dragPointRadius, dragPointRadius);
            this.dragPoints.add(dragPoint);

            if(i != path.length - 1){
                toolpath.add(this.cylinderFromPoints(path[i], path[i+1], material));
            }
            this.uuidToPoint.set(dragPoint.uuid, i);
        }

        this.dragPoints.scale.set(.1, .1, .1);
        toolpath.scale.set(.1, .1, .1); //scale relative to printer bed, 10 3js = 1m
        scene.add(toolpath);
        window.state.outputPath = path;
    }

    // Change toolpath on update
    refreshPath(scene, pathType){
        const toolpath = scene.getObjectByName(pathType); 
        scene.remove(toolpath);
        const circles = scene.getObjectByName("circles"); 
        circles.clear();

        if(pathType === "path" && this.globalState.path.length != 0){
            console.log("REFRESH");
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

        let toolpath = this.scene.getObjectByName("path");
        if(this.transformControls.dragging){ //run if dragging point along the toolpath
            let dragPoint = this.transformControls.object;
            let index = this.uuidToPoint.get(dragPoint.uuid);
            let cylinderIDs = [index-1, index];
            
            for(let i = 0; i < cylinderIDs.length; i++){
                if(cylinderIDs[i] < 0 || cylinderIDs[i] >= toolpath.children.length){
                    continue;
                }
                let obj = toolpath.children[cylinderIDs[i]];
                let newCylinder = i == 0 ? //create a new cylinder with endpoints at the current dragPoint
                    this.cylinderFromPoints(this.globalState.path[cylinderIDs[i]], dragPoint.position, this.cylinderHighlightMaterial, this.globalState.path[cylinderIDs[i+1]].t) : 
                    this.cylinderFromPoints(dragPoint.position, this.globalState.path[cylinderIDs[i]+1], this.cylinderHighlightMaterial, this.globalState.path[cylinderIDs[i]].t);
                obj.copy(newCylinder);

                //update the endpoints of the neighboring cylinder
                this.globalState.path[index].x = dragPoint.position.x; 
                this.globalState.path[index].y = dragPoint.position.y;
                this.globalState.path[index].z = dragPoint.position.z; 
                this.highlightedMaterials = true;
            }
        } else{
            if(this.highlightedMaterials){
                for(let c of toolpath.children){ //set all toolpath cylinders to black
                    c.material = this.cylinderMaterial;
                }
                this.highlightedMaterials = false;
            }
        }
    }
}
window.ToolpathViewer = ToolpathViewer;

window.addEventListener('DOMContentLoaded', () => {
    const TPVcontainer = document.getElementById('toolpathVieweriFrame'); // select the div
    const TPV = new ToolpathViewer(TPVcontainer);
});