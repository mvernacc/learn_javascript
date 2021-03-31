import CBuffer from 'CBuffer';

// Spectrogram plot style constants.
const yAxisWidth = 50; // pixels
const xAxisHeight = 80; // pixels
const axisColor = '#eee';
const axisFont = 'sans-serif';
const axisFontSizePx = 14;
const tickFontSizePx = 10;

function createSpectrogram(stream: MediaStream) {
    let canvas = <HTMLCanvasElement> document.getElementById('spectrogram-canvas')!;
    // Resize the canvas's drawing buffer.
    canvas.width = Math.round(canvas.parentElement!.clientWidth);
    canvas.height = Math.round(canvas.parentElement!.clientHeight);

    let audioContext = new AudioContext();
    let source = audioContext.createMediaStreamSource(stream);
    let analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    source.connect(analyser);
    // Choose an appropriate FFT size for the size of the graph.
    // frequencyBinCount is ffSize/2, and we don't want to have more frequency bins
    // than there are pixels on the graph. Also fftSize must be a power of 2.
    const plotHeight = canvas.height - xAxisHeight;
    const log2pixels = Math.floor(Math.log2(plotHeight));
    // Limit the FFT size so re-drawing doesn't get too slow.
    analyser.fftSize = Math.min(
        Math.max(2**(log2pixels + 1), 16), 1024
    );
    console.log(`Using FFT size of ${analyser.fftSize}`);

    // Create the circular buffers that will store the audio data.
    const targetPixelsPerTimestep = 5;
    const plotWidth = canvas.width - yAxisWidth;
    // Limit the number of time steps so re-drawing doesn't get too slow.
    const numTimesteps = Math.min(Math.round(plotWidth / targetPixelsPerTimestep), 128);
    const timeStepMilliSecond = 10;
    // Redraw every redrawInterval time steps.
    const redrawInterval = 3;
    let timeStamps = new CBuffer<Date>(numTimesteps);
    let audioFreqPowerHistory = new CBuffer<Uint8Array>(numTimesteps);
    const now = new Date();
    for (let i = 0; i < numTimesteps; i++) {
        timeStamps.push(new Date(now.getTime() - i * timeStepMilliSecond));
        audioFreqPowerHistory.push(new Uint8Array(analyser.frequencyBinCount));
    }

    drawYAxis(canvas, audioContext.sampleRate);

    let redrawCounter = redrawInterval;

    function run() {
        timeStamps.unshift(new Date());
        audioFreqPowerHistory.rotateRight();
        analyser.getByteFrequencyData(audioFreqPowerHistory.first()!);
        if (redrawCounter == redrawInterval) {
            drawSpectogram(canvas, audioFreqPowerHistory, timeStamps);
            redrawCounter = 0;
        }
        redrawCounter++;
    }

    let timerId: number | null = setInterval(run, timeStepMilliSecond);

    let startStopButton = document.getElementById('start-stop')!;
    startStopButton.onclick = () => {
        if (timerId !== null) {
            // Pause
            clearInterval(timerId);
            timerId = null;
            startStopButton.innerHTML = 'Resume';
        } else {
            // Resume
            redrawCounter = redrawInterval;
            timerId = setInterval(run, timeStepMilliSecond);
            startStopButton.innerHTML = 'Pause';
        }
    }
}

function drawYAxis(canvas: HTMLCanvasElement, sampleRate: number) {
    let canvasCtx = canvas.getContext('2d')!;
    canvasCtx.fillStyle = axisColor;
    canvasCtx.strokeStyle = axisColor;
    const plotHeight = canvas.height - xAxisHeight;

    // Axis label
    canvasCtx.save();
    canvasCtx.translate(10, canvas.height / 2);
    canvasCtx.rotate(-Math.PI/2);
    canvasCtx.textAlign = "center";
    canvasCtx.font = `${axisFontSizePx}px ${axisFont}`;
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
    canvasCtx.font = `${tickFontSizePx}px ${axisFont}`;
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
    canvasCtx.beginPath();
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
    canvasCtx.fillStyle = axisColor;
    canvasCtx.strokeStyle = axisColor;
    // Axis label
    canvasCtx.textAlign = "center";
    canvasCtx.font = `${axisFontSizePx}px ${axisFont}`;
    canvasCtx.fillText("Time [min:sec]", canvas.width / 2, canvas.height - 10);
    // Ticks and tick labels
    canvasCtx.font = `${tickFontSizePx}px ${axisFont}`;
    const tickLength = 10;
    const tickInterval = 10;
    for (let timeIndex = tickInterval; timeIndex < timeNumBins; timeIndex += tickInterval) {
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

window.onload = function() {
    let constraints = {audio: true};
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => createSpectrogram(stream));
}
