function waveform(filename, nbPoints='default', offset=0, heightRange=[-1,1]){
    let values = [];
    let wavFile = localStorage.getItem(filename); //returns base64
    if (wavFile === null) {
        throw new Error(filename+" does not exist.");
        return;
    }

    let binaryString = atob(wavFile.split('base64,')[1]); //remove metadata
    if(nbPoints == 'default'){ //nbPoints = how many points to return/samples for waveform
        binaryString.length = nbPoints;
    }
    let bytes = new Uint8Array(nbPoints);
    console.log(binaryString.length);
    console.log(Math.floor(binaryString.length*(1/nbPoints)));
    for(let i = 0; i < binaryString.length; i++){
        if(i % Math.floor(binaryString.length/nbPoints) == 0){ //push back nbPoints points to new array
            bytes[i] = binaryString.charCodeAt(i);        
        }
    }
    console.log(bytes);
    // let audioContext = new window.AudioContext;
    // audioContext.decodeAudioData(bytes.buffer, (audioBuffer) => {
    //     const pcmData = audioBuffer.getChannelData(0); //mono audio
    //     console.log(pcmData);
        // const fftSize = 2048; // Define the size of the FFT
        // const analyser = audioContext.createAnalyser();
        // analyser.fftSize = fftSize;
        // const frequencyData = new Float32Array(analyser.frequencyBinCount);

        // // Connect the buffer source to the analyser
        // const source = audioContext.createBufferSource();
        // source.buffer = audioBuffer;
        // source.connect(analyser);
        // source.start();

        // // Get the frequency data
        // analyser.getFloatFrequencyData(frequencyData);
        // console.log(frequencyData);
    // })
}
   

window.waveform = waveform;
