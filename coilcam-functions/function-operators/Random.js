function append(heightRange, widthRange, scatterRange, nbPoints, offset, mode){
    if(mode == "square"){
        while (true){
            let height = heightRange[0];
            let width = widthRange[0];
            let scatter = scatterRange[0];
            let triangularScalingFactor = 2*height/width;
            let sawtoothScalingFactor = height/width;
            if(heightRange.length == 2){
                height = Math.random(heightRange[1] - heightRange[0]) + heightRange[0];
            }
            if(widthRange.length == 2){
                widthRange = Math.random(widthRange[1] - widthRange[0]) + widthRange[0];
            }
            if(scatterRange.length == 2){
                scatterRange = Math.random(scatterRange[1] - scatterRange[0]) + scatterRange[0];
            }
            for (let i = 0; i < width; i++){ 
                if (values.length >= nbPoints){
                    return values; //break
                }
                if(mode == "triangle"){
                    if(i%width < i/2){
                        values.push(((i%width)*triangularScalingFactor) + offset[i]);
                    }
                    else if(i%width > i/2){
                        values.push((height-(i%Math.ceil(width/2))*triangularScalingFactor) + offset[i]);
                    } else{
                        values.push(height + offset[i]);
                    }
                }
                if(mode == "square"){
                    values.push(height + offset[i]);
                }
                if(mode == "circle"){ //y = sqrt((r^2) - ((x/h)-r)^2)) r= height, h=width
                    if(height < 0){ //height is negative
                        values.push(-Math.sqrt((-height/2)**2 - ((x/width)+height)) + offset[i]);
                    } else{
                        values.push(Math.sqrt((height/2)**2 - ((x/width)-height)) + offset[i]);
                    }
                }
                if(mode == "sawtooth"){ 
                    values.push(((i%width)*sawtoothScalingFactor) + offset[i]);
                }
            }
            for (let i = 0; i < scatter; i++){ 
                if (values.length >= nbPoints){
                    return values;
                }
                values.push(0);
            }
        }
    }
}


function randomBumps(heightRange, widthRange, scatterRange, nbPoints, offset, mode){
    if(offset.length === 0){
        offset = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offset)){
        offset = new Array(nbPoints).fill(offset);
    } else if(offset.length !== nbPoints){
        throw new Error("Length of offset in Square must be 0 or 1 or equal to nbPoints");
    }
    
    if(widthRange[0] < 0 || (widthRange.length == 2 && widthRange[1] < 0)){
        throw new Error("Width range is negative.");
    }
    if(scatterRange[0] < 0 || (scatterRange.length == 2 && scatterRange[1] < 0)){
        throw new Error("Scatter range is negative.");
    }
    let modes = ["square", "circle", "triangle", "sawtooth"];
    if(mode !== modes){
        mode = "square";
    }
    
    return append(heightRange, widthRange, scatterRange, nbPoints, offset, mode);
}