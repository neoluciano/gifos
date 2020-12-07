let buttonStart = document.getElementById("buttonStart");
let pasosCrearGif = document.getElementsByClassName("pasosCrearGif");
let createTextContainer = document.getElementById("createTextContainer");
let createGifTextHeader = document.getElementById("createGifTextHeader");
let createGifTextSecond = document.getElementById("createGifTextSecond");
let videoDiv = document.getElementById("videoDiv");
let videoContainer = document.getElementById("videoContainer");
let recorder = "";
let newGifPreview = document.getElementById("newGifPreview");





//Captura de Eventos
////////////////////

buttonStart.addEventListener("click", () => {
    let buttonFunction = buttonStart.innerHTML
    switch (buttonFunction) {
        case "COMENZAR":
            console.log("Se hizo click");
            createGifTextHeader.innerHTML = "¿Nos das acceso <br/> a tu cámara?";
            createGifTextSecond.innerHTML = "El acceso a tu camara será válido sólo <br/> por el tiempo en el que estés creando el GIFO.";
            pasosCrearGif[0].classList.add("pasosCrearGifSelected");
            getStreamAndRecord();
            break;
        case "GRABAR":
            recorder.startRecording();
            buttonStart.innerHTML = "FINALIZAR";

            break;
        case "FINALIZAR":
            recorder.stopRecording(function() {
                var newGifo = recorder.getBlob();
                invokeSaveAsDialog(newGifo);
                console.log(newGifo);
                newGifPreview.setAttribute("src", URL.createObjectURL(newGifo));
                console.log(URL.createObjectURL(newGifo));
                newGifPreview.style.display = "block";
                videoContainer.style.display = "none";

            });
            break
        default:
            console.error("El texto definido para el boton no esta controlado");
    }


})

///////////////////////////
//Fin de captura de eventos

function crearGifo() {
    if (getStreamAndRecord()) {
        console.log("Aca van los eventos si anduvo todo ok")
    } else {
        console.log("Algo salio mal");
    }
}


function getStreamAndRecord() {
    let constraints = { audio: false, video: { max: 480 } };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream) {
            videoContainer.srcObject = mediaStream;
            videoContainer.onloadedmetadata = function(e) {
                videoContainer.play();
                console.log("Se acepto el pedido de la camara");
                createTextContainer.style.display = "none";
                videoDiv.style.display = "block";
                pasosCrearGif[0].classList.remove("pasosCrearGifSelected");
                pasosCrearGif[1].classList.add("pasosCrearGifSelected");
                buttonStart.innerHTML = "GRABAR";
                recorder = RecordRTC(mediaStream, {
                    type: 'gif',
                    frameRate: 1,
                    quality: 10,
                    width: 480,
                    height: 320,
                    hidden: 240,
                    onGifRecordingStarted: function() {
                        console.log('Record Gif Started');
                    },
                });

            };
        })
        .catch(function(err) { console.error(err.name + ": " + err.message); }); // always check for errors at the end
}