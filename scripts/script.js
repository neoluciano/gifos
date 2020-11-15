const giphyApiKey = "tVjH0saoMhui1wYJRjsWdaUR6c0pKvn4";
const giphyTrendingSearchTerms = "https://api.giphy.com/v1/trending/searches?";
const giphyTrendingSearchGifs = "https://api.giphy.com/v1/gifs/trending?";

let body = document.getElementById("body");
let parrafoTrendingTerms = document.getElementById("trendingTerms");
let trendingGifsList = document.getElementById("gifList");
let sectionTop = document.getElementById("sectionTop");
let sectionSearch = document.getElementById("sectionSearch");
let sectionTrendingTerms = document.getElementById("sectionTrendingTerms");
let sectionTrendingGifs = document.getElementById("trendingGifs");

// let searchBar = document.getElementById("searchBar");
let linkModoNocturno = document.getElementById("modoNocturno");
let imgCreateGifo = document.getElementById("imgCreateGifo");
let header = document.getElementById("header");
let headerPosition = "noFixed";
let logo = document.getElementById("logo");
let logoText = document.getElementById("logo-text");



//Llamado a funciones que se ejecutan al cargar la HOME
loadAndPutTrendingTerms(); //Obtiene y dibuja en el HTML los trending terms.
loadAndPutTrendingGifs(); //Obtiene y dibuja en el HTML los trending GIFs
// addFavoriteGif("TEST");
//Fin del Llamado a funciones que se ejecutan al cargar la HOME


//Esta funcion IntersectionObserver la utilizo para detectar cuando el Header Bar queda en posicion fixed y
//a partir de eso dibujar la barra de busqueda dentro de la misma, ademas de definirle los 
//estilos que debe tener cuando esta en esa posicion.

var observer = new IntersectionObserver(function(entries) {
    // no intersection with screen
    if (entries[0].intersectionRatio === 0)
    // document.querySelector("#nav-container").classList.add("nav-container-sticky");
    // alert("es sticky");
        header.classList.add("headerSticky");
    // fully intersects with screen
    else if (entries[0].intersectionRatio === 1)
    // document.querySelector("#nav-container").classList.remove("nav-container-sticky");
        header.classList.remove("headerSticky");
}, { threshold: [0, 1] });

observer.observe(document.querySelector("#header-top"));


//Captura de Eventos
////////////////////

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


// header.addEventListener("click", () => {
//     altura = header.offsetTop;
//     alert("El estado del sticky del header cambio " + altura);
// })

linkModoNocturno.addEventListener("click", () => {
    body.classList.toggle("darkMode");
    logoText.classList.toggle("darkMode");
    searchBar.classList.toggle("darkMode");
    searchInputText.classList.toggle("darkMode");
    sectionTrendingGifs.classList.toggle("trendingGifsDark");

})

logo.addEventListener("click", () => {
    location.reload();
})


///////////////////////////
//Fin de captura de eventos



async function trendingSearchTerms() {
    let url = giphyTrendingSearchTerms + "api_key=" + giphyApiKey;
    let response = await fetch(url);
    let json = await response.json();
    let terms = json.data;
    return terms;
}

function loadAndPutTrendingTerms() {
    trendingSearchTerms()
        .then(array => {
            for (let i = 0; i < 5; i++) {
                let element = array[i];

                let span = document.createElement("span");
                if (i < 4) {
                    span.textContent = `${element}, `;
                } else {
                    span.textContent = element;
                }
                span.setAttribute("onclick", `loadAndPutSearchedGifs("${element}",0)`);
                parrafoTrendingTerms.appendChild(span);
            }
        }).catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}

async function trendingSearchGifs() {
    let url = giphyTrendingSearchGifs + "api_key=" + giphyApiKey + "&limit=10";
    let response = await fetch(url);
    let json = await response.json();
    return json;
}

function loadAndPutTrendingGifs() {
    trendingSearchGifs()
        .then(array => {

            for (item of array.data) {

                let newGif = document.createElement('img');
                newGif.src = item.images.original.url;
                newGif.alt = item.title;
                newGif.className = "trendGifHome";
                trendingGifsList.appendChild(newGif);
            }
        }).catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}