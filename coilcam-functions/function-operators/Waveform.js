function waveform(filename, nbPoints='default', offset=0, heightRange=[-1,1]){
    let values = [];
    let wavFile = localStorage.getItem(filename); //returns base64
    if (wavFile === null) {
        throw new Error(filename+" does not exist.");
        return;
    }

    let binaryString = atob(wavFile.split('base64,')[1]); //remove metadata
    if(nbPoints == 'default'){ //nbPoints = how many points to return/samples for waveform
       nbPoints = binaryString.length;
    }
    let bytes = new Uint8Array(nbPoints);
    // console.log(binaryString.length);
    // console.log(Math.floor(binaryString.length*(1/nbPoints)));
    for(let i = 0; i < binaryString.length; i++){
        if(i % Math.floor(binaryString.length/nbPoints) == 0){ //push back nbPoints points to new array
            bytes[i] = binaryString.charCodeAt(i);        
        }
    }
    let nums = [];
    for(let i = 0; i < bytes.length; i++){
        nums.push(bytes[i] / (256*heightRange[1]) + heightRange[0]);
    }
    return nums;
    // return bytes;
}
   

window.waveform = waveform;
