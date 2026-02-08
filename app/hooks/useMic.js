export default function useMic(socket, room) {

    const block = 0.001

    function getRMSVolume(data) {
        let sumSquares = 0;

        for (let i = 0; i < data.length; i++) {
            sumSquares += data[i] * data[i];
        }
        return Math.sqrt(sumSquares / data.length);
    }

    navigator.mediaDevices.getUserMedia({
        audio: {
            autoGainControl: true
        }
    }).then(stream => {

        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)

        const processor = audioContext.createScriptProcessor(16384, 1, 1)

        source.connect(processor)
        processor.connect(audioContext.destination)

        processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0)





            if (getRMSVolume(input) > block) {

                socket.emit("audio_blob", input.buffer, room)
            }



        }

    })
}
