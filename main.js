$(document).ready(function () {
/*
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioCtx.createBufferSource();

    var request = new XMLHttpRequest();
    request.open('GET', 'sound/jocelyn.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        audioCtx.decodeAudioData(request.response,
            buffer => {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = true;
            },
            error => {
                console.error("Error decoding audio data" + error.err);
            }
        );
    }
    request.send();

    //var test = context.decodeAudioData()
*/



    game.load();
})