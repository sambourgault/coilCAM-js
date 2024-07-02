async function arrayToAudioBuffer(data, AudioContext) {
    try{
        const audioBuffer = await AudioContext.decodeAudioData(data);
        return audioBuffer;
    } catch(error){
        console.error("Error decoding audio data:", error);
        throw error; 
    }
}


function waveform(filename, nbPoints='default', offset=0, heightRange=[-1,1]){
    let values = [];
    let waveFile = localStorage.getItem(filename); //returns base64
    if (waveFile === null) {
        throw new Error(filename+" does not exist.");
        return;
    }
    let binaryData = window.atob(waveFile.split('base64,')[1]); //remove metadata at start
    console.log(binaryData);
    console.log(binaryData.length);
    if(nbPoints == 'default' || nbPoints > binaryData.length){ //nbPoints = how many points to return/samples for waveform
        nbPoints = binaryData.length;
    }

    if(waveFile.includes('audio/midi;base64')){ //TOFIX: make more accurate for MIDI
        let bytes = new Uint8Array(nbPoints);
        for(let i = 0; i < binaryData.length; i++){
            if(i % Math.floor(binaryData.length/nbPoints) == 0){ //push back nbPoints points to new array
                bytes[i] = binaryData.charCodeAt(i);        
            }
        }
        let nums = [];
        for(let i = 0; i < bytes.length; i++){
            nums.push(bytes[i] / (256*heightRange[1]) + heightRange[0]);
        }
        console.log(nums);
        return nums;
        // console.log(nums);
    }

    if(filename.split('.')[1] == 'wav'){ //TOFIX: make more accurate for wav
        console.log(typeof(binaryData));
        let step = binaryData.length/nbPoints;
        let arrayBuff = new Uint8Array(nbPoints);
        for(let i = 0; i < nbPoints; i++){
            arrayBuff[i] = binaryData.charCodeAt(i*step);        
        }
        let nums = [];
        for(let i = 0; i < arrayBuff.length; i++){
            nums.push(arrayBuff[i]);
            // nums.push(arrayBuff[i] / (256*heightRange[1]) + heightRange[0]);
        }
        console.log(nums);
        return nums;

        // var audioContext = new window.AudioContext || window.webkitAudioContext;
        // var audioBuff = arrayToAudioBuffer(arrayBuff.buffer, audioContext);
        
        // const numChannels = audioBuff.numberOfChannels;
        // const sampleDist = binaryData.length / nbPoints;
        // var points = [];
        // for(let i = 0; i < nbPoints; i+=sampleDist){
        //     let pointHeight = 0;
        //     for(let j = 0; j < numChannels; j++){
        //         const rawData = audioBuff.getChannelData(j);
        //         pointHeight += Math.abs(rawData[i]);
        //     }
        //     points.push(pointHeight / sampleDist);
        //     console.log(points);
        // }
        // const norm = Math.max(Math.max(...points), 1);
        // return points.map(n => n / norm);
        





        // const wavesurfer = WaveSurfer.create({
        //     container: document.body,
        //     waveColor: 'rgb(0, 0, 0)',
        //     progressColor: 'RGB(100, 0, 100',
        //     renderFunction: (channels, ctx) => {
        //         const step = channels[0].length / nbPoints;

        //         for(let i = 0; i < nbPoints; i += step){
        //             const pointHeight = Math.floor(i);
        //             const value =
        //         }
        //     }
        // })
        // const scale = channels[0].length;

        // if(nbPoints == 'default'){ //nbPoints = how many points to return/samples for waveform
        //     nbPoints = binaryString.length;
        //  }
        //  let bytes = new Uint8Array(nbPoints);
        //  for(let i = 0; i < binaryString.length; i++){
        //      if(i % Math.floor(binaryString.length/nbPoints) == 0){ //push back nbPoints points to new array
        //          bytes[i] = binaryString.charCodeAt(i);        
        //      }
        //  }
        //  let nums = [];
        //  for(let i = 0; i < bytes.length; i++){
        //      nums.push(bytes[i] / (256*heightRange[1]) + heightRange[0]);
        //  }
        //  return nums;
    }
    
}
   

window.waveform = waveform;
