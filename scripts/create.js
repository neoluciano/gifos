const uploadGiphyEndpoint = "https://upload.giphy.com/v1/gifs?";

let imgCreateGifo = document.getElementById("imgCreateGifo");
let sectionCrearGifo = document.getElementById("sectionCrearGifo");
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
let loader = document.getElementById("loader");
let descriptionTextNewGif = document.getElementById("descriptionTextNewGif");
let actionIconsNewGif = document.getElementById("actionIconsNewGif");
let newGifoId = "";
let linkMyGifos = document.getElementById("linkMyGifos");
let myGifosSection = document.getElementById("myGifosSection");
let myGifosGifsDiv = document.getElementById("myGifosGifs");
let noGifosYet = document.getElementById("noGifosYet");

// let copyText = document.getElementById("toClipBoard");


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
                //invokeSaveAsDialog(newGifo);
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
            let cardNewGif = document.getElementById("cardNewGif");
            cardNewGif.style.display = "block";
            cardNewGif.classList.add("cardNewGifDisplay");
            pasosCrearGif[1].classList.remove("pasosCrearGifSelected");
            pasosCrearGif[2].classList.add("pasosCrearGifSelected");
            handleResultUploadNewGif();
            buttonStart.style.display = "none";
            cronometro.style.display = "none";

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


imgCreateGifo.onmouseover = () => {
    imgCreateGifo.src = "images/CTA-crear-gifo-hover.svg";
}

imgCreateGifo.onmouseleave = () => {
    imgCreateGifo.src = "images/button-crear-gifo.svg";
}

imgCreateGifo.onmousedown = () => {
    imgCreateGifo.src = "images/CTA-crear-gifo-active.svg";
}

imgCreateGifo.onmouseup = () => {
    imgCreateGifo.src = "images/CTA-crear-gifo-hover.svg";
}

imgCreateGifo.onclick = () => {
    sectionCrearGifo.className = "sectionCrearGifoDisplayed";
    let sectionsToHide = document.getElementsByTagName("section");

    for (let i = 1; i < sectionsToHide.length; i++) {
        let element = sectionsToHide[i];
        element.style.display = "none";
    }
}

linkMyGifos.onclick = () => {
    let arrayMyGifos = JSON.parse(localStorage.getItem("gifosMyGifos"));
    drawMyGifosHTMLSection();

    if (arrayMyGifos.length > 0) {
        noGifosYet.style.display = "none";
        loadAndPutMyGifos(0);
    }


}


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
            loader.setAttribute("src", "images/check.svg");
            loader.classList.remove("loader");
            descriptionTextNewGif.innerHTML = "GIFO subido con éxito";
            console.log(element);
            console.log("Se subio el gifo con exito.");
            newGifoId = element.id;
            console.log(`El id del nuevo gifo es ${newGifoId}`);
            addOrRemoveMyGifo(newGifoId);
            //Creo el Icono para descargar el gif.
            let icon;
            icon = createDownloadIconForGifCard(newGifURL);
            actionIconsNewGif.appendChild(icon);
            icon = createCopyLinkIconForGifCard("www.google.com")
            actionIconsNewGif.appendChild(icon);
        }).catch(error => {
            console.error("Se produjo el siguiente error al intentar subir el gifo: " + error);
        })
}


function addOrRemoveMyGifo(gifId) {
    let alreadyExists = false;
    let iconResult = "";
    if (localStorage.getItem("gifosMyGifos") != null) {
        let arrayMyGifos = JSON.parse(localStorage.getItem("gifosMyGifos"))
        for (item of arrayMyGifos) { //Si ya existe, lo elimino del local storage.
            if (item === gifId) {
                alreadyExists = true;
                console.log(`El GIF ${gifId} se eliminara del listado de mis gifos.`)
                    // console.error("El gif que intento agregar ya existe en mis gifos.");
                arrayMyGifos.splice(arrayMyGifos.indexOf(item), 1);
                localStorage.setItem("gifosMyGifos", JSON.stringify(arrayMyGifos));
                break;
            }
        }
        if (!alreadyExists) {
            arrayMyGifos.push(gifId);
            localStorage.setItem("gifosMyGifos", JSON.stringify(arrayMyGifos));
        }

    } else {
        console.log("Aun no se registraron GIF favoritos en el storage local.");
        let arrayMyGifos = [];
        arrayMyGifos[0] = gifId;
        localStorage.setItem("gifosMyGifos", JSON.stringify(arrayMyGifos));
    }

}

function getNewGifoInfo(newGifoId) {
    getGifsByIds(newGifoId)
        .then(array => {
            //console.log(array);
            let gifUrl = "";
            for (item of array) {
                gifUrl = item.images.original.url;
            }
            console.log(`La url a copiar seria: ${gifUrl}`);

            return gifUrl;
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}

function createCopyLinkIconForGifCard(gifUrl) {
    let imgSrc = "images/icon-link-hover.svg";
    let icon = document.createElement("div");
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Copiar Link Gif";
    button.className = "cardGifButton";
    button.id = `buttonCopyLink`;

    icon.appendChild(button);

    let label = document.createElement("label");
    label.className = "cardGifIcon"
    label.setAttribute("for", button.id);

    let img = document.createElement("img");
    img.setAttribute("onclick", `copyToClipboard()`);
    img.src = imgSrc;
    img.alt = "Copiar Link Gif";

    label.appendChild(img);
    icon.appendChild(label);

    return icon;
}

async function copyToClipboard() {
    /* Get the text field */
    let underCrearGifoFirst = document.getElementById("underCrearGifoFirst");
    let value = await getGifsByIds(newGifoId)
        .then(array => {
            //console.log(array);
            let gifUrl = "";
            for (item of array) {
                gifUrl = item.images.original.url;
            }
            console.log(`La url a copiar seria: ${gifUrl}`);

            return gifUrl;
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
    console.log(`El valor de value es ${value}`);
    let copyText = document.createElement("input");
    copyText.type = "text";
    underCrearGifoFirst.appendChild(copyText);
    copyText.value = value;
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
    copyText.remove();



}

function drawMyGifosHTMLSection() {
    sectionTop.className = "sectionHidden";
    sectionSearch.className = "sectionHidden";
    sectionTrendingTerms.className = "sectionHidden";
    favoritesSection.className = "sectionHidden"
    myGifosSection.className = "favoritesSectionDisplayed";
    linkMyGifos.style.color = "#9CAFC3";

}


function loadAndPutMyGifos(offset) {
    if (offset === 0) {
        myGifosGifsDiv.innerHTML = "";
    }

    let arrayMyGifos = JSON.parse(localStorage.getItem("gifosMyGifos"));
    // En la siguiente linea determino si quedan gifs del array de mis favoritos para mostrar. En caso negativo, ocutlaria el boton ver mas.
    let gifsToShow = arrayMyGifos.length - (offset + resultsLimit);
    if (gifsToShow < 0) {
        labelVerMasFavoritosButton.style.display = "none";
    }
    arrayMyGifos = arrayMyGifos.splice(offset, resultsLimit); //traigo solo 12 gifs por peticion, comenzando por la posicion del offset.
    let arrayToString = arrayMyGifos.join(',');
    getGifsByIds(arrayToString)
        .then(array => {
            console.log(array);
            for (item of array) {

                let gifUrl = item.images.original.url;
                let resultSearchGifDiv = document.createElement("div");
                resultSearchGifDiv.className = "resultSearchGifDiv";

                let newGif = document.createElement('img');
                newGif.src = gifUrl;
                newGif.alt = item.title;
                newGif.className = "searchedGifsHome";

                let cardGif = createCardForGif(item.userName, item.title, item.id, gifUrl);

                resultSearchGifDiv.appendChild(newGif);
                resultSearchGifDiv.appendChild(cardGif);
                myGifosGifsDiv.appendChild(resultSearchGifDiv);

            }
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}