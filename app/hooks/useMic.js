export default function useMic(socket, room) {

    navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: true,
        autoGainControl: true
    } }).then(stream => {

        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)

        const processor = audioContext.createScriptProcessor(16384, 1, 1)

        source.connect(processor)
        processor.connect(audioContext.destination)

        processor.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0)

            socket.emit("audio_blob", input.buffer, room)
        }

    })
}
