//Inserciones
main.appendChild(seccionCrearGif);
seccionCrearGif.appendChild(camara);
seccionCrearGif.appendChild(luzCamara);
seccionCrearGif.appendChild(rollo);

seccionCrearGif.appendChild(contenedorCentralCrearGif);

seccionCrearGif.appendChild(contenedorDeNumeros);
seccionCrearGif.appendChild(lineaSeparatoria);

seccionCrearGif.appendChild(botonComenzar);
seccionCrearGif.appendChild(botonGrabar);
seccionCrearGif.appendChild(botonFinalizar);
seccionCrearGif.appendChild(botonSubirGifo);


//Cronometro
cronometro.appendChild(minutos);
cronometro.appendChild(separador);
cronometro.appendChild(segundos);
contenedorDeCronometro.appendChild(cronometro);

//Contenedor Central Gif
contenedorCentralCrearGif.appendChild(cuadradoEzquina1);
contenedorCentralCrearGif.appendChild(cuadradoEzquina2);
contenedorCentralCrearGif.appendChild(cuadradoEzquina3);
contenedorCentralCrearGif.appendChild(cuadradoEzquina4);

contenedorCentralCrearGif.appendChild(contenedorCentralCrearGifInner);
contenedorCentralCrearGif.appendChild(contenedorCentralCrearGifInnerUno);

//Contenedor Central Inner
contenedorCentralCrearGifInner.appendChild(crearGifBloqueUp);
contenedorCentralCrearGifInner.appendChild(crearGifBloqueDown);
crearGifBloqueUp.appendChild(crearGifBloqueUpFrase);
crearGifBloqueDown.appendChild(crearGifBloqueDownFrase);

//Contenedor central inner UNO
contenedorCentralCrearGifInnerUno.appendChild(crearGifBloqueUpUno);
contenedorCentralCrearGifInnerUno.appendChild(crearGifBloqueDownUno);
crearGifBloqueUpUno.appendChild(crearGifBloqueUpFraseUno);
crearGifBloqueDownUno.appendChild(crearGifBloqueDownFraseUno);

// Contenedor central inner DOS
contenedorCentralCrearGif.appendChild(contenedorCentralCrearGifInnerDos);

contenedorCentralCrearGifInnerDos.appendChild(videoGif); //Video online.

contenedorCentralCrearGifInnerDos.appendChild(gifprevio); //Video Gif vista previa o final.

//Contenedor de numeros
contenedorDeNumeros.appendChild(contenedorDeNumero1);
contenedorDeNumeros.appendChild(contenedorDeNumero2);
contenedorDeNumeros.appendChild(contenedorDeNumero3);
contenedorDeNumeros.appendChild(contenedorDeCronometro);


masGifosImg.addEventListener('mouseover', () => {
    switch (masGifosImg.src) {
        case masGifosImgSRCServer:
            masGifosImg.setAttribute('src', masGifosImgHover);
            break;
        case masGifosImgActiveServer:
            masGifosImg.setAttribute('src', masGifosImgHover);
            break;
    }
}, false);

masGifosImg.addEventListener('mouseout', () => {

    switch (seccionCrearGif.classList.value) {
        case 'seccion-crear-gif':
            masGifosImg.setAttribute('src', masGifosImgActiveServer);
            break;
        case 'clase-display-none':
            masGifosImg.setAttribute('src', masGifosImgSRC);
            break;
    }
}, false);

masGifosImg.addEventListener('click', () => {
    if (masGifosImg.src !== masGifosImgActive) {
        masGifosImg.setAttribute('src', masGifosImgActive);
    }

    showHide(seccionCrearGif, 'seccion-crear-gif', seccionOne, seccionTwo, seccionMisGifos, seccionFavoritos);
    showHide(contenedorCentralCrearGifInner, 'contenedor-central-crear-gif-Inner', contenedorCentralCrearGifInnerUno, contenedorCentralCrearGifInnerDos);
    showHide(botonComenzar, 'boton-comenzar', botonFinalizar, botonGrabar, botonSubirGifo);


    if (favoritos.classList.value == 'favoritos-activado') {
        favoritos.classList.toggle('favoritos-activado');
    }
    if (misGifos.classList.value == 'favoritos-activado') {
        misGifos.classList.toggle('favoritos-activado');
    }


}, false);

//DESCARGAR GIF
async function descargarMiGifo(gifprevio) {

    let a = document.createElement('a');
    let response = await fetch(gifprevio.src);
    let file = await response.blob();
    a.download = 'MiNuevoGif.gif';
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();

};

//Crear gifos

function activarCamara() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(async function(stream) {

        videoGif.srcObject = stream;
        videoGif.onloadedmetadata = function(e) {
            videoGif.play();
        };

        if (videoGif.srcObject = stream) {
            contenedorCentralCrearGifInnerUno.classList.toggle('clase-display-none');
            contenedorCentralCrearGifInnerUno.classList.toggle('contenedor-central-crear-gif-Inner');
            contenedorCentralCrearGifInnerDos.classList.toggle('clase-display-none');
            contenedorCentralCrearGifInnerDos.classList.toggle('contenedor-central-crear-gif-Inner');
            videoGif.classList.toggle('clase-display-none');
            videoGif.classList.toggle('tamaño-video');

            botonComenzar.classList.toggle('boton-comenzar');
            botonComenzar.classList.toggle('clase-display-none');
            botonGrabar.classList.toggle('clase-display-none');
            botonGrabar.classList.toggle('boton-comenzar');
            contenedorDeNumero1.classList.toggle('background-color');
            contenedorDeNumero2.classList.toggle('background-color');
        }
    });
}
botonComenzar.addEventListener('click', () => {
    contenedorCentralCrearGifInner.classList.toggle('contenedor-central-crear-gif-Inner');
    contenedorCentralCrearGifInner.classList.toggle('clase-display-none');
    contenedorCentralCrearGifInnerUno.classList.toggle('clase-display-none');
    contenedorCentralCrearGifInnerUno.classList.toggle('contenedor-central-crear-gif-Inner');

    contenedorDeNumero1.setAttribute('class', 'contenedores-de-numeros background-color');
    contenedorDeNumero2.setAttribute('class', 'contenedores-de-numeros');
    contenedorDeNumero3.setAttribute('class', 'contenedores-de-numeros');

    activarCamara();
    gifprevio.setAttribute('class', claseDisplayNone);
    gifprevio.setAttribute('src', '');
    bloqueSubiendoGif.setAttribute('class', claseDisplayNone);
    bloqueSubiendoGifImg.setAttribute('class', claseDisplayNone);
    bloqueSubiendoGifImg.setAttribute('src', './img/loader.svg');
    bloqueSubiendoGifTexto.innerText = 'Estamos subiendo tu GIFO';
    bloqueSubiendoGifTexto.setAttribute('class', claseDisplayNone);
    botonDescargarMiGifo.setAttribute('class', claseDisplayNone);
    botonCopiarLinkMiGifo.setAttribute('class', claseDisplayNone);
    //dataId = '';

    bloqueSubiendoGif.setAttribute('class', claseDisplayNone);
    bloqueSubiendoGifTexto.setAttribute('class', claseDisplayNone);
    bloqueSubiendoGifImg.setAttribute('class', claseDisplayNone);



}, false);


botonGrabar.addEventListener('click', () => {
    getStreamAndRecord();
    botonGrabar.classList.toggle('clase-display-none');
    botonGrabar.classList.toggle('boton-comenzar');
    botonFinalizar.classList.toggle('clase-display-none');
    botonFinalizar.classList.toggle('boton-comenzar');
    repetirCaptura.setAttribute('class', claseDisplayNone);
    cronometro.setAttribute('class', 'contenedor-cronometro');
    carga();
}, false);


// Funcion para copiar en portapapeles el link del gif
function updateClipboard(urlGif) {
    navigator.clipboard.writeText(urlGif).then(function() {
        alert('URL copiada en el portapapeles');
    }, function() {
        alert('no se a podido copiar');
    });
}




function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
        video: true,

        audio: false
    }).then(async function(stream) {

        videoGif.srcObject = stream;
        videoGif.onloadedmetadata = function(e) {
            videoGif.play();
        };
        let recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 480,
            height: 320,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('started')
            },
        });
        recorder.startRecording();

        recorder.stream = stream;

        botonFinalizar.addEventListener('click', detenerGrabacion, false);

        function detenerGrabacion() {

            recorder.stopRecording(function() {
                recorder.stream.stop();
                gifprevio.src = URL.createObjectURL(recorder.getBlob());


                function subirGif() {
                    bloqueSubiendoGif.setAttribute('class', 'subiendo-gif');
                    bloqueSubiendoGifTexto.setAttribute('class', 'subiendo-gif-texto');
                    bloqueSubiendoGifImg.setAttribute('class', 'subiendo-gif-img');

                    let form = new FormData();
                    form.set('file', recorder.getBlob(), 'myGif.gif');
                    console.log(form.get('file'));

                    fetch(`https://upload.giphy.com/v1/gifs?${ApiKey}`, {
                            method: "POST",
                            body: form
                        })
                        .then(response => {
                            console.log(response.status);
                            return response.json();
                        }).then(data => {
                            //dataId = '';
                            dataId = data.data.id;
                            fetch("https://api.giphy.com/v1/gifs/" + dataId + "?&" + ApiKey)
                                .then(response => {
                                    return response.json();
                                }).then(obj => {
                                    console.log(obj);
                                    urlGif = obj.data.images.original.url;
                                    urlGif.id = 'url-my-gif';
                                    console.log(urlGif);
                                    sessionStorage.setItem(dataId, JSON.stringify(obj)); //envio al local Storage el data id
                                    console.log(sessionStorage); //y su contenido (obj) para guardarlo, por cada gif subido

                                    bloqueSubiendoGifImg.setAttribute('src', './img/check.svg');
                                    bloqueSubiendoGifTexto.innerText = 'GIFO subido con éxito';

                                    botonDescargarMiGifo.setAttribute('class', 'boton-descargar-mi-gifo')
                                    botonCopiarLinkMiGifo.setAttribute('class', 'boton-link-mi-gifo')

                                    botonDescargarMiGifoImg.addEventListener('click', () => {
                                        descargarMiGifo(gifprevio);
                                    }, false);


                                    arrayGifsMisGifosId.push(dataId);
                                    sessionStorage.setItem('keykey', dataId);
                                    let gifCreado = sessionStorage.getItem('keykey');

                                    var kv = sessionStorage.getItem(gifCreado);
                                    var kvParse = JSON.parse(kv); //le saco el stringgify
                                    var keyUrl = kvParse.data.images.original.url; //obtengo la URL para poder mostrar el Gif


                                    seccionMisGifos.appendChild(cajaMisFavoritos); //aparezca en la seccion sin necesidad de recargar la pagina
                                    cajaMisFavoritos.classList.add('caja-mis-gifos');
                                    const nuevoGif = document.createElement('img');



                                    //HOVER DE LOS GIFS EN MIS GIFOS

                                    //hover nuevo gif en mis gifos
                                    let hoverNuevoGif = document.createElement('div');
                                    hoverNuevoGif.classList.add('nuevo-gif-div');
                                    //hoverNuevoGif.style.position = 'relative';
                                    //hoverNuevoGif.style.right = '289px';



                                    //hover inter background #572EE5
                                    let hoverInter = document.createElement('div');
                                    hoverInter.classList.add('div-inter');

                                    hoverNuevoGif.appendChild(hoverInter);

                                    hoverInter.appendChild(nuevoGif);




                                    nuevoGif.src = keyUrl;
                                    nuevoGif.classList.add('nuevo-gif-img');

                                    //boton trash
                                    let botonTrash = document.createElement('div');
                                    botonTrash.classList.toggle('clase-display-none');

                                    let botonTrashImg = document.createElement('img');
                                    botonTrashImg.setAttribute('src', './img/icon-trash-normal.svg');
                                    //botonTrashImg.classList.add('clase-display-none');

                                    botonTrash.appendChild(botonTrashImg);

                                    hoverNuevoGif.appendChild(botonTrash);



                                    botonTrashImg.addEventListener('mouseover', () => {
                                        if (botonTrashImg.src == server + 'img/icon-trash-normal.svg') {
                                            botonTrashImg.setAttribute('src', './img/icon-trash-hover.svg')
                                        } else {
                                            botonTrashImg.setAttribute('src', './img/icon-trash-normal.svg')
                                        }
                                    }, false);
                                    botonTrashImg.addEventListener('mouseout', () => {
                                        if (botonTrashImg.src == server + 'img/icon-trash-hover.svg') {
                                            botonTrashImg.setAttribute('src', './img/icon-trash-normal.svg')
                                        } else {
                                            botonTrashImg.setAttribute('src', './img/icon-trash-hover.svg');
                                        }
                                    }, false);

                                    //boton Download
                                    let botonDownload = document.createElement('div');
                                    botonDownload.classList.toggle('clase-display-none');

                                    let botonDownloadImg = document.createElement('img');
                                    botonDownloadImg.setAttribute('src', './img/icon-download.svg');
                                    //botonTrashImg.classList.add('clase-display-none');

                                    botonDownload.appendChild(botonDownloadImg);

                                    hoverNuevoGif.appendChild(botonDownload);



                                    botonDownloadImg.addEventListener('mouseover', () => {
                                        if (botonDownloadImg.src == server + 'img/icon-download.svg') {
                                            botonDownloadImg.setAttribute('src', './img/icon-download-hover.svg')
                                        } else {
                                            botonDownloadImg.setAttribute('src', './img/icon-download.svg')
                                        }
                                    }, false);
                                    botonDownloadImg.addEventListener('mouseout', () => {
                                        if (botonDownloadImg.src == server + 'img/icon-download-hover.svg') {
                                            botonDownloadImg.setAttribute('src', './img/icon-download.svg')
                                        } else {
                                            botonDownloadImg.setAttribute('src', './img/icon-download-hover.svg');
                                        }
                                    }, false);

                                    //boton Max
                                    let botonMax = document.createElement('div');
                                    botonMax.classList.toggle('clase-display-none');

                                    let botonMaxImg = document.createElement('img');
                                    botonMaxImg.setAttribute('src', './img/icon-max-normal.svg');
                                    //botonTrashImg.classList.add('clase-display-none');

                                    botonMax.appendChild(botonMaxImg);

                                    hoverNuevoGif.appendChild(botonMax);


                                    hoverNuevoGif.addEventListener('mouseover', () => {

                                        hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        //botonTrashImg.classList.toggle('clase-display-none');
                                        botonTrash.classList.toggle('clase-display-none');
                                        botonTrash.classList.toggle('boton-trash');

                                        botonDownload.classList.toggle('clase-display-none');
                                        botonDownload.classList.toggle('boton-download');


                                        botonMax.classList.toggle('clase-display-none');
                                        botonMax.classList.toggle('boton-max');

                                        if (botonMaxImg.classList.value = 'btnFavOut') {
                                            botonMaxImg.setAttribute('class', 'btn-gif-card-trending-max');
                                        }
                                        if (botonDownloadImg.classList.value = 'btnFavOut') {
                                            botonDownloadImg.setAttribute('class', 'btn-gif-card-trending-max');
                                        }


                                    }, false);

                                    hoverNuevoGif.addEventListener('mouseout', () => {

                                        hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        //botonTrashImg.classList.toggle('clase-display-none');
                                        botonTrash.classList.toggle('clase-display-none');
                                        botonTrash.classList.toggle('boton-trash');

                                        botonDownload.classList.toggle('clase-display-none');
                                        botonDownload.classList.toggle('boton-download');

                                        botonMax.classList.toggle('clase-display-none');
                                        botonMax.classList.toggle('boton-max');
                                    }, false);

                                    botonMaxImg.addEventListener('mouseover', () => {
                                        if (botonMaxImg.src == server + 'img/icon-max-normal.svg') {
                                            botonMaxImg.setAttribute('src', './img/icon-max-hover.svg')
                                        } else {
                                            botonMaxImg.setAttribute('src', './img/icon-max-normal.svg')
                                        }
                                    }, false);
                                    botonMaxImg.addEventListener('mouseout', () => {
                                        if (botonMaxImg.src == server + 'img/icon-max-hover.svg') {
                                            botonMaxImg.setAttribute('src', './img/icon-max-normal.svg')
                                        } else {
                                            botonMaxImg.setAttribute('src', './img/icon-max-hover.svg');
                                        }
                                    }, false);


                                    //descargar gifo
                                    //DESCARGAR GIF
                                    async function descargarMiGifo(nuevoGif) {

                                        let a = document.createElement('a');
                                        let response = await fetch(nuevoGif.src);
                                        let file = await response.blob();
                                        a.download = 'MiNuevoGif.gif';
                                        a.href = window.URL.createObjectURL(file);
                                        a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
                                        a.click();

                                    };
                                    botonDownloadImg.addEventListener('click', () => {
                                        descargarMiGifo(nuevoGif);
                                    }, false);
                                    /// FIN DE HOVER DE MIS GIFOS

                                    //eventos over botones 
                                    botonTrash.addEventListener('mouseover', () => {
                                        //hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        hoverInter.style.opacity = '0.6';
                                    });

                                    botonTrash.addEventListener('mouseout', () => {
                                        //hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        hoverInter.style.opacity = '1';
                                    });
                                    //eventos over botones 
                                    botonDownload.addEventListener('mouseover', () => {
                                        //hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        hoverInter.style.opacity = '0.6';
                                    });

                                    botonDownload.addEventListener('mouseout', () => {
                                        //hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        hoverInter.style.opacity = '1';
                                    });
                                    //eventos over botones 
                                    botonMax.addEventListener('mouseover', () => {
                                        //hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        hoverInter.style.opacity = '0.6';
                                    });

                                    botonMax.addEventListener('mouseout', () => {
                                        //hoverNuevoGif.classList.toggle('nuevo-gif-hover');
                                        hoverInter.style.opacity = '1';
                                    });

                                    botonTrashImg.addEventListener('click', () => {
                                        hoverInter.removeChild(nuevoGif);
                                        cajaMisFavoritos.removeChild(hoverNuevoGif);

                                        if (!cajaMisFavoritos.firstChild) {
                                            cajaSinContenidoMisGifos.classList.toggle('Caja-Sin-Contenido');
                                            cajaSinContenidoMisGifos.classList.toggle('clase-display-none');
                                            cajaMisFavoritos.setAttribute('class', claseDisplayNone);
                                        }
                                    }, false);

                                    if (hoverInter.firstChild) {
                                        cajaSinContenidoMisGifos.setAttribute('class', claseDisplayNone)
                                    }

                                    botonCopiarLinkMiGifoImg.addEventListener('click', () => {
                                        updateClipboard(urlGif);
                                    }, false);

                                    //let form = '';
                                    //form.set('', '', '');
                                    //console.log(form.get('file'));

                                    cajaMisFavoritos.appendChild(hoverNuevoGif);

                                    let btnFav = document.createElement('div'); //Boton Favoritos.
                                    btnFav.classList.toggle('btnFavOut'); //por defecto display:none.
                                    let heartFav = document.createElement('img'); //imagen Corazon.
                                    heartFav.setAttribute('src', corazonNormal);

                                    heartFav.id = 'img-btn-gif-card';

                                    //Evento EXPANDIR
                                    function expandir() {

                                        showHide(seccionMax, 'seccion-max', seccionOne, seccionTwo, seccionMisGifos, seccionFavoritos)

                                        hijosMax(cruzClose, nuevoGif, contenedorBajoMax)
                                        eliminarHijos(contenedorBajoMax);

                                        contenedorBajoMax.appendChild(heartFav);
                                        contenedorBajoMax.appendChild(botonDownloadImg);

                                        botonesFavDownloadExpand(btnFav, botonDownloadImg, botonMaxImg);

                                        heartFav.classList.add('btn-gif-card-trending-max');
                                        botonDownloadImg.classList.add('btn-gif-card-trending-max');
                                    }
                                    botonMaxImg.addEventListener('click', () => {
                                        expandir();
                                    }, false);

                                    cruzClose.addEventListener('click', () => {
                                        botonesFavDownloadParaMax(botonMaxImg, botonDownloadImg);

                                        botonesFavDownloadExpand(btnFav, botonDownloadImg, botonMaxImg)

                                        hoverInter.appendChild(nuevoGif);

                                        //bloqueParaCadaImagen.appendChild(btnFav); //Insercion del boton en el bloque FAV
                                        btnFav.appendChild(heartFav); //Insercion de la imagen en el boton

                                        //bloqueParaCadaImagen.appendChild(botonDownloadImg); //Insercion del boton en el bloque DOWNLOAD
                                        botonDownload.appendChild(botonDownloadImg) //link de descarga

                                        //bloqueParaCadaImagen.appendChild(botonMaxImg); //Insercion del boton en el bloque EXPAND
                                        botonMax.appendChild(botonMaxImg); //Insercion de la imagen en el boton
                                    }, false);

                                    //Eventos mouseover/out y click sobre el boton FAV
                                    heartFav.addEventListener('mouseover', () => {
                                        corazonHoverFunction(heartFav);
                                    }, false);
                                    heartFav.addEventListener('mouseout', () => {
                                        corazonNormalFunction(heartFav);
                                    }, false);
                                    heartFav.addEventListener('click', () => {
                                        corazonActiveFunction(heartFav);
                                    }, false);
                                    heartFav.addEventListener('click', () => {
                                        guardarEnSssionStorage(heartFav, nuevoGif);
                                    }, false);

                                });
                        });

                }
                botonSubirGifo.addEventListener('click', subirGif, false);
                botonSubirGifo.addEventListener('click', () => {
                    botonSubirGifo.setAttribute('class', claseDisplayNone);
                    repetirCaptura.setAttribute('class', claseDisplayNone);
                    contenedorDeNumero2.classList.toggle('background-color');
                    contenedorDeNumero3.classList.toggle('background-color');
                }, false)
            });
        }
    });
};


//Funcion Cronometro
var cronometroTimer;

function detenerse() {
    clearInterval(cronometroTimer);
}

function carga() {
    contador_s = 0;
    contador_m = 0;
    s = document.getElementById("segundos");
    m = document.getElementById("minutos");
    cronometroTimer = setInterval(
        function() {
            if (contador_s == 60) {
                contador_s = 0;
                contador_m++;
                m.innerHTML = contador_m;
                if (contador_m == 60) {
                    contador_m = 0;
                }
            }
            s.innerHTML = contador_s;
            contador_s++;
        }, 1000);
}



botonFinalizar.addEventListener('click', () => {
    detenerse();
    cronometro.classList.toggle('clase-display-none');
    repetirCaptura.setAttribute('class', '');
    contenedorDeNumeros.classList.toggle('contenedor-de-numeros-general');
    contenedorDeNumeros.classList.toggle('contenedor-de-numeros-general-repetir');
    botonFinalizar.classList.toggle('boton-comenzar');
    botonFinalizar.classList.toggle('clase-display-none');
    botonSubirGifo.classList.toggle('boton-comenzar');
    botonSubirGifo.classList.toggle('clase-display-none');

    videoGif.classList.toggle('clase-display-none');
    videoGif.classList.toggle('tamaño-video');
    gifprevio.classList.toggle('clase-display-none');

    //
}, false);


//La funcion vuelve a mostrar el video online. El Gif se reescribe  en el evento Finalizar
repetirCaptura.addEventListener('click', () => {
    videoGif.classList.toggle('clase-display-none');
    videoGif.classList.toggle('tamaño-video');
    gifprevio.classList.toggle('clase-display-none');

    botonSubirGifo.classList.toggle('boton-comenzar');
    botonSubirGifo.classList.toggle('clase-display-none');

    botonGrabar.classList.toggle('clase-display-none');
    botonGrabar.classList.toggle('boton-comenzar');

    repetirCaptura.classList.toggle('clase-display-none');
    cronometro.classList.toggle('clase-display-none');

    contenedorDeNumeros.classList.toggle('contenedor-de-numeros-general');
    contenedorDeNumeros.classList.toggle('contenedor-de-numeros-general-repetir');
    activarCamara();
}, false);