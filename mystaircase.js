import { setParams1D } from './function-helpers.js'

// Staircase
export default function mystaircase(stepWidth, stepHeight, offset, nbPoints, values0, mode=[]){
    let values = [];
    let index = 0;
    [offset, values0] = setParams1D("Staircase", offset, values0, nbPoints, mode);
    console.log("values", values);

    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive" || mode == 0){
            if (i % stepWidth == 0 && i != 0){
                index += stepHeight;
            }
            values.push(index + offset[i] + values0[i]);
        }
        else if (mode == "multiplicative"){
            if (i % stepWidth == 0 && i != 0){
                index += stepHeight;
            }
            values.push((index + offset[i]) * values0[i]);
        } else {
            throw new Error("Mode must be \"additive\", \"multiplicative\" or left blank.");
        }
    }
    return values;
}

window.mystaircase = mystaircase;
