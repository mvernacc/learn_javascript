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

    const canvas = <HTMLCanvasElement> document.getElementById('spectrogram-canvas')!;
    drawYAxis(canvas, audioContext.sampleRate, analyser.frequencyBinCount);

    setInterval(
        () => {
            audioFreqPowerHistory.rotateRight();
            analyser.getByteFrequencyData(audioFreqPowerHistory.first()!);
            drawSpectogram(canvas, audioFreqPowerHistory);
        },
        30
    );
}

const yAxisWidth = 50; // pixels
const xAxisHeight = 50; // pixels

function drawYAxis(canvas: HTMLCanvasElement, sampleRate: number, frequencyBinCount: number) {
    let canvasCtx = canvas.getContext('2d')!;
    const plotHeight = canvas.height - xAxisHeight;

    // Label
    canvasCtx.save();
    canvasCtx.translate(10, canvas.height / 2);
    canvasCtx.rotate(-Math.PI/2);
    canvasCtx.textAlign = "center";
    canvasCtx.fillText("Frequency [kHz]", 0, 0);
    canvasCtx.restore();

    // Ticks
    const nyquistFreq = sampleRate / 2; // hertz
    const pixelPerHertz = plotHeight / nyquistFreq;
    const tickSpacingHertz = 2000;
    const tickFreqs = [...Array(Math.floor(nyquistFreq / tickSpacingHertz) + 1).keys()]
        .map(x => tickSpacingHertz * x);
    canvasCtx.save();
    canvasCtx.textAlign = "right";
    const tickLength = 10;
    for (const f of tickFreqs) {
        const y = plotHeight - f * pixelPerHertz;
        canvasCtx.moveTo(yAxisWidth, y);
        canvasCtx.lineTo(yAxisWidth - tickLength, y);
        canvasCtx.stroke();
        canvasCtx.fillText(
            `${Math.round(f / 1000)}`,
            yAxisWidth - tickLength - 5, y
        );
    }
}

function drawSpectogram(canvas: HTMLCanvasElement, audioFreqPowerHistory: CBuffer<Uint8Array>) {
    let canvasCtx = canvas.getContext('2d')!;
    const plotWidth = canvas.width - yAxisWidth;
    const plotHeight = canvas.height - xAxisHeight;

    canvasCtx.clearRect(yAxisWidth, 0, plotWidth, canvas.height);
    const timeNumBins = audioFreqPowerHistory.length;
    const freqNumBins = audioFreqPowerHistory.first()!.length;
    const dx = plotWidth / timeNumBins;
    const dy = plotHeight / freqNumBins;
    let x = canvas.width - dx;
    let y;
    for (let timeIndex = 0; timeIndex < timeNumBins; timeIndex++) {
        const audioFreqPower = audioFreqPowerHistory.get(timeIndex)!;
        y = plotHeight - dy;
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
