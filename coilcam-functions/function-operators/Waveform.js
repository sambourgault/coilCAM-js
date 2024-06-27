function waveform(filename, nbPoints, offset, heightRange, widthRange){
    let values = [];
    let wavFile = localStorage.getItem(filename); //returns base64
    if (wavFile === null) {
        throw new Error(filename+" does not exist.");
        return;
    }

    let binaryString = atob(wavFile.split('base64,')[1]); //remove metadata
    let length = binaryString.length;
    let bytes = new Uint8Array(length);
    for(let i = 0; i < binaryString.length; i++){
        bytes = binaryString.charCodeAt(i);
    }
    let audioContext = new window.AudioContext;
    audioContext.decodeAudioData(bytes.buffer, (audioBuffer) => {
        const pcmData = audioBuffer.getChannelData(0); //mono audio
        
        const fftSize = 2048; // Define the size of the FFT
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        const frequencyData = new Float32Array(analyser.frequencyBinCount);

        // Connect the buffer source to the analyser
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        source.start();

        // Get the frequency data
        analyser.getFloatFrequencyData(frequencyData);
        console.log(frequencyData);
    })
}
   

window.waveform = waveform;
