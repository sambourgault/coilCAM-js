// WIP: default viewer class (to reuse code across layerviewer and profileviewer)

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {DragControls} from 'three/addons/controls/DragControls.js';
export default class ProfileViewer {
    scene;
    camera;
    renderer;
    iframe;
    defaultNbLayers;
    defaultLayerHeight;
    globalState = { // TO FIX: adding optional svg using file I/O
        svgPath: "",
        nbLayers: 0.0,
        layerHeight: 0,
        path: [] //return this
    };

    constructor(iframe){
        this.iframe = iframe;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        window.state = this.globalState;
        this.initScene();
        const zoomControls = new OrbitControls(this.camera, this.renderer.domElement);
        zoomControls.enableRotate = false;
        document.body.appendChild(renderer.domElement);
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initScene(){
        this.scene.background = new THREE.Color(0xe3e1de);
        this.camera.up.set(0, 0, 1); // to ensure z is up and down instead of default (y)
        camera.position.set(0, 0, 40); //adjust z with radius?
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.createCrosshair(5);
    }

    createCrosshair(length){ // add crosshair at position[x, y]
        const crossMaterial = new THREE.LineBasicMaterial({color: 0xddd321});
        const crossHorizontalGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(length, 0, 0), new THREE.Vector3( -length, 0, 0)]);
        const crossHorizontal = new THREE.Line(crossHorizontalGeometry, crossMaterial);
        scene.add(crossHorizontal);
    }
}