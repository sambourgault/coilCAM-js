function waveform(filename, nbPoints, offset, heightRange, widthRange){
    const values = [];
    const wavFile = localStorage.getItem(filename);
    if (!wavFile) {
        console.error(filename+" does not exist.");
        return;
    }

    const binaryString = atob(wavFile);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for(let i = 0; i < binaryString.length; i++){
        bytes = binaryString.charCodeAt(i);
    }
    const buffer = bytes.buffer;
    const view = new DataView(buffer);
    console.log(new Uint8Array(buffer, 0, 10));
}
   

window.waveform = waveform;
