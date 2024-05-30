//Predefined printer settings for Baby Potterbot and Super Potterbot
//Dimensions from Rhino coilCAM demos

const BABY_POTTERBOT = { //can be renamed :~)
    name: "BABY_POTTERBOT",
    bed: {
        x: 280,
        y: 265,
        z: 305
    },
    printSpeed: 30, // mm/s
    nozzleDiameter: 2.85, // mm 
    layerHeight: 0.2, // mm
    extrusionMultiplier: 1.0 //Check value
};

const SUPER_POTTERBOT = { //can be renamed :~)
    name: "SUPER_POTTERBOT",
    bed: {
        x: 415,
        y: 405,
        z: 500
    },
    printSpeed: 40, // mm/s
    nozzleDiameter: 6.0, // mm 
    layerHeight: 3.0, // mm
    extrusionMultiplier: 1.0 
};

function createPreset(name, bedDimensions, printSpeed, nozzleDiameter, layerHeight) {
    return {
        name: name,
        bed: {
            x: bedDimensions[0],
            y: bedDimensions[1],
            z: bedDimensions[2]
        },
        printSpeed: printSpeed,
        nozzleDiameter: nozzleDiameter,
        layerHeight: layerHeight,
        extrusionMultiplier: 1.0
    };
}
export { BABY_POTTERBOT, SUPER_POTTERBOT, createPreset}