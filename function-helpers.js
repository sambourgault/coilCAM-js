// Helper Functions
function setParams(paramType, value, nbPoints, mode){
    if (value.length == 0){
        if(mode == "multiplicative" && paramType == "values"){
            return new Array(nbPoints).fill(1);
        } else return new Array(nbPoints).fill(0);
    } else if(!Array.isArray(value)){
        return new Array(nbPoints).fill(value);
    } else if(value.length == nbPoints){
        return value;   
    }
    return null;
}

export function setParams1D(functionType, offset, values0, nbPoints, mode){
    offset = setParams("offset", offset, nbPoints, mode);
    values0 = setParams("values", values0, nbPoints, mode);

    if(offset == null){ throw new Error("Length of offset in " + functionType + " must be 0 or 1 or equal to nbPoints:" + nbPoints); }
    if(values0 == null){ throw new Error("Length of values0 in " + functionType + " must be 0 or 1 or equal to nbPoints:" + nbPoints); } 
    return [offset, values0];
}

export function setParams2D(functionType, offset0x, offset0y, values0x, values0y, nbPoints, mode){
    offset0x = setParams("offset0x", offset0x, nbPoints, mode);
    offset0y = setParams("offset0y", offset0y, nbPoints, mode);
    values0x = setParams("values0x", values0x, nbPoints, mode);
    values0y = setParams("values0y", values0y, nbPoints, mode);

    if(offset0x == null){ throw new Error("Length of offset0x in " + functionType + " must be 0 or 1 or equal to nbPoints:" + nbPoints); }
    if(offset0y == null){ throw new Error("Length of offset0y in " + functionType + " must be 0 or 1 or equal to nbPoints:" + nbPoints); }
    if(values0x == null){ throw new Error("Length of values0x in " + functionType + " must be 0 or 1 or equal to nbPoints:" + nbPoints); } 
    if(values0y == null){ throw new Error("Length of values0y in " + functionType + " must be 0 or 1 or equal to nbPoints:" + nbPoints); } 
    
    
    return [offset0x, offset0y, values0x, values0y];
}