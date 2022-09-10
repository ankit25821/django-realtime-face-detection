var socket;
var localstream;
const FPS = 6;
var photo = document.querySelector('#photo');
var video = document.querySelector('#videoInput');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

video.width = 400;
video.height = 300;

function getValidDomain() {
    let http = window.location.protocol == 'http:'
    let https = window.location.protocol == 'https:'
    let protocol = http ? 'ws://' : https ? 'wss://' : window.location.protocol
    return `${protocol}${document.location.host}/ws/`
}

function startStream() {
    console.log('Domain : ', getValidDomain());
    socket = new WebSocket(getValidDomain());


    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                localstream = stream;
                video.play();
            })
            .catch((err0r) => console.log(err0r));
    }

    socket.addEventListener('open', () => {
    });

    setInterval(() => {
        width = video.width;
        height = video.height;
        context.drawImage(video, 0, 0, width, height);
        var data = canvas.toDataURL('image/jpeg', 0.5);
        context.clearRect(0, 0, width, height);
        socket?.send(data);
    }, 1000 / FPS);

    socket.onmessage = (response) => {
        let data = JSON.parse(response.data);
        if (data.type == 'IMAGE_RESPONSE') {
            photo.setAttribute('src', data.image_data);
        }
    };
}

function stopStream() {
    // socket?.close();
    // video.pause();
    // video.src = "";
    // photo.src = '';
    // localstream.getTracks()[0].stop();
    window.location.reload();
}

