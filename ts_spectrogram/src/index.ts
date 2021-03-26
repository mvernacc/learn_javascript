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
        },
        30
    );
}

let constraints = {audio: true};
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => createAudioContext(stream));
