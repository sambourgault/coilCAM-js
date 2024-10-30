// referencing https://threejs.org/docs/index.html?q=camera#manual/en/introduction/Creating-a-scene
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export default class ToolpathViewer {
    scene;
    camera;
    renderer;
    TPVcontainer;
    defaultPath = null; //stores current path inside TPV, check against global state path to monitor for changes
    defaultReferencePath = null;
    defaultBedDimensions = [280, 265, 305];
    globalState = { //variables updatable outside toolpathviewer
        path: [],
        referencePath: [],
        bedDimensions: [280, 265, 305]
    };
    baseHeight = 1; //height for base of printer bed (constant)
    
    constructor(TPVcontainer) {
        this.TPVcontainer = TPVcontainer;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        window.state = this.globalState;

        this.initScene();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //initialize 3js elements
    initScene(){
        this.scene.background = new THREE.Color(0xffffff);
        this.camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
        this.camera.position.set(2, 20, 40);
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
                points.push(new THREE.Vector3(dimensions[0]/2 * offsets[i][0], dimensions[1]/2 * offsets[i][1], this.baseHeight/2 + dimensions[2]));
                points.push(new THREE.Vector3(dimensions[0]/2 * offsets[i][0], dimensions[1]/2 * offsets[i][1], this.baseHeight/2));
            } else{
                points.push(new THREE.Vector3(dimensions[0]/2 * offsets[i%4][0], dimensions[1]/2 * offsets[i%4][1], this.baseHeight/2 + dimensions[2]));
                points.push(new THREE.Vector3(dimensions[0]/2 * offsets[(i+1)%4][0], dimensions[1]/2 * offsets[(i+1)%4][1], this.baseHeight/2 + dimensions[2]));
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
        printerBed.position.set(-dimensions[0]/2, -dimensions[1]/2, -this.baseHeight/2);
        scene.add(printerBed);
    }

    //helper function to convert line segment to cylinder (for thickness)
    cylinderFromPoints(pointStart, pointEnd, group, material){
        //convert to Vec3
        let pointStartVec = new THREE.Vector3(pointStart.x, pointStart.y, pointStart.z);
        let pointEndVec = new THREE.Vector3(pointEnd.x, pointEnd.y, pointEnd.z);

        var dir = new THREE.Vector3().subVectors(pointEndVec, pointStartVec);
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()); 

        var offset = new THREE.Vector3(); //midpoint of cylinder
        offset.addVectors(pointEndVec, pointStartVec).divideScalar(2);
        
        const segmentGeometry = new THREE.CylinderGeometry(pointEnd.t+1, pointStart.t+1, dir.length(), 8);
        const segment = new THREE.Mesh(segmentGeometry, material); 
        segment.quaternion.copy(quat);
        segment.position.set(offset.x, offset.y, offset.z);
        group.add(segment);
    }

    // turn collection of points into toolpath
    createPath(scene, path, pathType){
        if(path.length === 0){
            return;
        }

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
        
        for(let i = 0; i < path.length - 1; i++){
            this.cylinderFromPoints(path[i], path[i+1], toolpath, material);
        }
        toolpath.scale.set(.1, .1, .1); //scale relative to printer bed, 10 3js = 1m
        scene.add(toolpath);
    }

    // Change toolpath on update
    refreshPath(scene, pathType){
        const toolpath = scene.getObjectByName(pathType); 
        scene.remove(toolpath);
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
        this.renderer.render(this.scene, this.camera);
        if(this.globalState.bedDimensions != this.defaultBedDimensions && this.globalState.bedDimensions.length !== 0){ //execute only on update to bedDimensions inport
            var borders = this.scene.getObjectByName("printerBedBorders");  //update borders
            borders.scale.set(this.globalState.bedDimensions[0]/(this.defaultBedDimensions[0]*10), 
                this.globalState.bedDimensions[1]/(this.defaultBedDimensions[1]*10), 
                this.globalState.bedDimensions[2]/(this.defaultBedDimensions[2]*10));

            var base = this.scene.getObjectByName("printerBedBase"); //update base (don't scale z)
            base.scale.set(this.globalState.bedDimensions[0]/(this.defaultBedDimensions[0]*10), 
                this.globalState.bedDimensions[1]/(this.defaultBedDimensions[1]*10), 
                1);

            var printerBed = this.scene.getObjectByName("printerBed"); //reposition group
            printerBed.position.set(-(this.globalState.bedDimensions[0]/20), -this.globalState.bedDimensions[1]/20, -this.baseHeight/2);
        }
        if(this.globalState.path !== this.defaultPath){ //execute only on path update, delete and rebuild toolpath
            this.refreshPath(this.scene, "path");
        }
        if(this.globalState.referencePath !== this.defaultReferencePath){ //execute only on path update, delete and rebuild toolpath
            this.refreshPath(this.scene, "referencePath");
        }
    }

    
}
window.ToolpathViewer = ToolpathViewer;

window.addEventListener('DOMContentLoaded', () => {
    const TPVcontainer = document.getElementById('toolpathVieweriFrame'); // select the div
    const TPV = new ToolpathViewer(TPVcontainer);
});