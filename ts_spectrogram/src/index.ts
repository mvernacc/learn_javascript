import CBuffer from 'CBuffer';

function createAudioContext(stream: MediaStream) {
    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    let analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0;
    source.connect(analyser);

    const numTimesteps = 20;
    const timeStep = 0.030;  // seconds
    let timeStamps = new CBuffer<Date>(numTimesteps);
    let audioFreqPowerHistory = new CBuffer<Uint8Array>(numTimesteps);
    const now = new Date();
    for (let i = 0; i < numTimesteps; i++) {
        timeStamps.push(new Date(now.getTime() - i * 1000 * timeStep));
        audioFreqPowerHistory.push(new Uint8Array(analyser.frequencyBinCount));
    }

    const canvas = <HTMLCanvasElement> document.getElementById('spectrogram-canvas')!;
    drawYAxis(canvas, audioContext.sampleRate, analyser.frequencyBinCount);

    function run() {
        timeStamps.unshift(new Date());
        audioFreqPowerHistory.rotateRight();
        analyser.getByteFrequencyData(audioFreqPowerHistory.first()!);
        drawSpectogram(canvas, audioFreqPowerHistory, timeStamps);
    }

    let timerId: number | null = setInterval(run, 1000 * timeStep);

    let startStopButton = document.getElementById('start-stop')!;
    startStopButton.onclick = () => {
        if (timerId !== null) {
            // Pause
            clearInterval(timerId);
            timerId = null;
            startStopButton.innerHTML = 'Resume';
        } else {
            // Resume
            timerId = setInterval(run, 1000 * timeStep);
            startStopButton.innerHTML = 'Pause';
        }
    }

}

const yAxisWidth = 50; // pixels
const xAxisHeight = 80; // pixels

function drawYAxis(canvas: HTMLCanvasElement, sampleRate: number, frequencyBinCount: number) {
    let canvasCtx = canvas.getContext('2d')!;
    const plotHeight = canvas.height - xAxisHeight;

    // Axis label
    canvasCtx.save();
    canvasCtx.translate(10, canvas.height / 2);
    canvasCtx.rotate(-Math.PI/2);
    canvasCtx.textAlign = "center";
    canvasCtx.fillText("Frequency [kHz]", 0, 0);
    canvasCtx.restore();

    // Ticks and tick labels
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

/**
 * From https://stackoverflow.com/a/10073788
 */
function padLeading(n: number, width: number, z?: string) {
    z = z || '0';
    const nStr = n.toString();
    return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
  }

function drawSpectogram(canvas: HTMLCanvasElement,
                        audioFreqPowerHistory: CBuffer<Uint8Array>,
                        timeStamps: CBuffer<Date>) {
    let canvasCtx = canvas.getContext('2d')!;
    const plotWidth = canvas.width - yAxisWidth;
    const plotHeight = canvas.height - xAxisHeight;


    // Update the spectrogram itself.
    canvasCtx.clearRect(yAxisWidth, 0, plotWidth, plotHeight);
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

    // Update the time axis.
    canvasCtx.clearRect(0, plotHeight, canvas.width, xAxisHeight);
    // Axis label
    canvasCtx.textAlign = "center";
    canvasCtx.fillText("Time [min:sec]", canvas.width / 2, canvas.height - 10);
    // Ticks and tick labels
    const tickLength = 10;
    for (let timeIndex = 0; timeIndex < timeNumBins; timeIndex++) {
        x = canvas.width - (dx / 2) - (timeIndex * dx);
        canvasCtx.save();
        canvasCtx.translate(x, plotHeight);
        // Draw ticks
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(0, tickLength);
        canvasCtx.stroke();
        // Draw tick labels
        canvasCtx.textAlign = "right";
        canvasCtx.rotate(-Math.PI / 4);
        const t = timeStamps.get(timeIndex)!;
        canvasCtx.fillText(
            `${padLeading(t.getMinutes(), 2)}:${padLeading(t.getSeconds(), 2)}.${padLeading(t.getMilliseconds(), 3)}`,
            -5, tickLength + 10
        );
        canvasCtx.restore();
    }
}

let constraints = {audio: true};
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => createAudioContext(stream));
