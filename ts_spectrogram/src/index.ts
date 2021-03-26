function createAudioContext(stream: MediaStream) {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    let analyser = audioContext.createAnalyser();
    source.connect(analyser);

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    setInterval(
        () => {
            analyser.getByteFrequencyData(dataArray);
            console.log(dataArray);
            drawSpectogram(dataArray);
        },
        30
    );
}

function drawSpectogram(dataArray: Uint8Array) {
    let canvasCtx = (<HTMLCanvasElement>document.getElementById('spectrogram-canvas')).getContext('2d');
    if (canvasCtx === null) return;

    let canvasWidth = 500;
    let canvasHeight = 500;

    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    let dy = canvasHeight / dataArray.length;
    let y = 0;
    for (let i = 0; i < dataArray.length; i++) {
        canvasCtx.fillStyle = `rgb(${dataArray[i]},0,0)`;
        canvasCtx.fillRect(0, y, 20, dy);
        y +=dy;
    }
}

let constraints = {audio: true};
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => createAudioContext(stream));
