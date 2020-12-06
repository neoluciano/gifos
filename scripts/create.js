let buttonStart = document.getElementById("buttonStart");
let pasosCrearGif = document.getElementsByClassName("pasosCrearGif");
let createGifTextHeader = document.getElementById("createGifTextHeader");
let createGifTextSecond = document.getElementById("createGifTextSecond");




//Captura de Eventos
////////////////////

buttonStart.addEventListener("click", () => {
    console.log("Se hizo click");
    createGifTextHeader.innerHTML = "¿Nos das acceso <br/> a tu cámara?";
    createGifTextSecond.innerHTML = "El acceso a tu camara será válido sólo <br/> por el tiempo en el que estés creando el GIFO.";
    pasosCrearGif[0].classList.add("pasosCrearGifSelected");
})

///////////////////////////
//Fin de captura de eventos