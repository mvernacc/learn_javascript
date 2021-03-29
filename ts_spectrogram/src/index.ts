// import CBuffer = require('CBuffer');
import CBuffer from 'CBuffer';

function createAudioContext(stream: MediaStream) {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    let analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const numTimesteps = 20;
    let audioFreqPowerHistory = new CBuffer<Uint8Array>(numTimesteps);
    for (let i = 0; i < numTimesteps; i++) {
        audioFreqPowerHistory.push(new Uint8Array(analyser.frequencyBinCount));
    }

    setInterval(
        () => {
            audioFreqPowerHistory.rotateRight();
            analyser.getByteFrequencyData(audioFreqPowerHistory.first()!);
            drawSpectogram(audioFreqPowerHistory);
        },
        30
    );
}

function drawSpectogram(audioFreqPowerHistory: CBuffer<Uint8Array>) {
    let canvasCtx = (<HTMLCanvasElement>document.getElementById('spectrogram-canvas')).getContext('2d');
    if (canvasCtx === null) return;

    let canvasWidth = 500;
    let canvasHeight = 500;

    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    const timeNumBins = audioFreqPowerHistory.length;
    const freqNumBins = audioFreqPowerHistory.first()!.length;
    const dx = canvasWidth / timeNumBins;
    const dy = canvasHeight / freqNumBins;
    let x = 0;
    let y = 0;
    for (let timeIndex = 0; timeIndex < timeNumBins; timeIndex++) {
        const audioFreqPower = audioFreqPowerHistory.get(timeIndex)!;
        for (let freqIndex = 0; freqIndex < freqNumBins; freqIndex++) {
            canvasCtx.fillStyle = `rgb(${audioFreqPower[freqIndex]},0,0)`;
            canvasCtx.fillRect(x, y, dx, dy);
            y += dy;
        }
        x += dx;
    }
}

let constraints = {audio: true};
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => createAudioContext(stream));
