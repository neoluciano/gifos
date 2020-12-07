const uploadGiphyEndpoint = "https://upload.giphy.com/v1/gifs?";

let buttonStart = document.getElementById("buttonStart");
let pasosCrearGif = document.getElementsByClassName("pasosCrearGif");
let createTextContainer = document.getElementById("createTextContainer");
let createGifTextHeader = document.getElementById("createGifTextHeader");
let createGifTextSecond = document.getElementById("createGifTextSecond");
let videoDiv = document.getElementById("videoDiv");
let videoContainer = document.getElementById("videoContainer");
let recorder = "";
let newGifo = "";
let newGifURL = "";
let newGifPreview = document.getElementById("newGifPreview");
let cronometro = document.getElementById("cronometro");

let cronoInicio = 0;
let cronoTimeout = 0;





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
            cronometro.style.display = "block";
            break;
        case "GRABAR":
            recorder.startRecording();
            buttonStart.innerHTML = "FINALIZAR";
            empezarDetenerCrono();

            break;
        case "FINALIZAR":
            recorder.stopRecording(function() {
                newGifo = recorder.getBlob();
                invokeSaveAsDialog(newGifo);
                console.log(newGifo);
                newGifURL = URL.createObjectURL(newGifo);
                newGifPreview.setAttribute("src", newGifURL);
                newGifPreview.style.display = "block";
                videoContainer.style.display = "none";

            });
            empezarDetenerCrono();
            buttonStart.innerHTML = "SUBIR GIFO";
            cronometro.innerHTML = "REPETIR CAPTURA";
            cronometro.classList.add("repetirCaptura");
            break;

        case "SUBIR GIFO":
            handleResultUploadNewGif();
            break;
        default:
            console.error("El texto definido para el boton no esta controlado");
    }

})

cronometro.addEventListener("click", () => {
    if (cronometro.innerHTML === "REPETIR CAPTURA") {
        readyToCreate();
    }
})

///////////////////////////
//Fin de captura de eventos

function readyToCreate() {
    getStreamAndRecord();
    cronometro.classList.remove("repetirCaptura");
    buttonStart.innerHTML = "GRABAR";
    cronometro.innerHTML = "00:00:00";
    newGifPreview.style.display = "none";
    videoContainer.style.display = "block";

}

function crearGifo() {
    if (getStreamAndRecord()) {
        console.log("Aca van los eventos si anduvo todo ok")
    } else {
        console.log("Algo salio mal");
    }
}

function empezarDetenerCrono() {
    if (cronoTimeout === 0) {
        // empezar el cronometro
        // Obtenemos el valor actual
        cronoInicio = vuelta = new Date().getTime();
        console.log(cronoInicio);

        // iniciamos el proceso
        cronoFuncionando();
    } else {
        // detemer el cronometro
        clearTimeout(cronoTimeout);
        cronoTimeout = 0;
        console.log("Crono TimeOut: " + cronoTimeout);
    }
}

function cronoFuncionando() {
    // obteneos la fecha actual
    var actual = new Date().getTime();

    // obtenemos la diferencia entre la fecha actual y la de inicio
    var diff = new Date(actual - cronoInicio);

    // mostramos la diferencia entre la fecha actual y la inicial
    var result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());
    cronometro.innerHTML = result;

    // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
    cronoTimeout = setTimeout("cronoFuncionando()", 1000);
}

/* Funcion que pone un 0 delante de un valor si es necesario */
function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : +Time;
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

async function uploadNewGif() {
    let form = new FormData();
    form.set('file', newGifo, 'myGif.gif');
    console.log(form.get('file'));
    let fullEndpoint = `${uploadGiphyEndpoint}api_key=${giphyApiKey}`;
    console.log(fullEndpoint);
    let response = await fetch(fullEndpoint, {
        method: 'POST',
        body: form
    });
    let json = await response.json();
    let result = json.data;
    return result;
}

function handleResultUploadNewGif() {
    uploadNewGif()
        .then(element => {
            console.log(element);
        }).catch(error => {
            console.error("Se produjo el siguiente error al intentar subir el gifo: " + error);
        })
}