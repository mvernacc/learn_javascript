import CBuffer from 'CBuffer';

function createAudioContext(stream: MediaStream) {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    let analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0;
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
    const canvas = <HTMLCanvasElement> document.getElementById('spectrogram-canvas')!;
    let canvasCtx = canvas.getContext('2d');
    if (canvasCtx === null) return;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const timeNumBins = audioFreqPowerHistory.length;
    const freqNumBins = audioFreqPowerHistory.first()!.length;
    const dx = canvas.width / timeNumBins;
    const dy = canvas.height / freqNumBins;
    let x = canvas.width - dx;
    let y;
    for (let timeIndex = 0; timeIndex < timeNumBins; timeIndex++) {
        const audioFreqPower = audioFreqPowerHistory.get(timeIndex)!;
        y = canvas.height - dy;
        for (let freqIndex = 0; freqIndex < freqNumBins; freqIndex++) {
            canvasCtx.fillStyle = `rgb(${audioFreqPower[freqIndex]},0,0)`;
            canvasCtx.fillRect(x, y, dx, dy);
            y -= dy;
        }
        x -= dx;
    }
}

let constraints = {audio: true};
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => createAudioContext(stream));
