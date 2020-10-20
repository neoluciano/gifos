const giphyApiKey = "tVjH0saoMhui1wYJRjsWdaUR6c0pKvn4";
const giphyTrendingSearchTerms = "https://api.giphy.com/v1/trending/searches?";
const giphyTrendingSearchGifs = "https://api.giphy.com/v1/gifs/trending?";

let parrafoTrendingTerms = document.getElementById("trendingTerms");
let trendingGifsList = document.getElementById("gifList");
let sectionTop = document.getElementById("sectionTop");
let sectionSearch = document.getElementById("sectionSearch");
let sectionTrendingTerms = document.getElementById("sectionTrendingTerms");
let linkFavoritos = document.getElementById("linkFavoritos");
let imgCreateGifo = document.getElementById("imgCreateGifo");
let header = document.getElementById("header");
let headerPosition = "noFixed";

//Llamado a funciones que se ejecutan al cargar la HOME
loadAndPutTrendingTerms(); //Obtiene y dibuja en el HTML los trending terms.
loadAndPutTrendingGifs(); //Obtiene y dibuja en el HTML los trending GIFs
// addFavoriteGif("TEST");
//Fin del Llamado a funciones que se ejecutan al cargar la HOME

// document.addEventListener("scroll", () => {
//     if (header.offsetTop >= 200) {
//         headerPosition = "fixed";
//                 alert("Aqui deberia cambiar el estilo");
//     }
//     else{
//         headerPosition = "noFixed";
//     }


// })


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






imgCreateGifo.onmouseover = () => {
    imgCreateGifo.src = "/images/CTA-crear-gifo-hover.svg";
}

imgCreateGifo.onmouseleave = () => {
    imgCreateGifo.src = "/images/button-crear-gifo.svg";
}

imgCreateGifo.onmousedown = () => {
    imgCreateGifo.src = "/images/CTA-crear-gifo-active.svg";
}

imgCreateGifo.onmouseup = () => {
    imgCreateGifo.src = "/images/CTA-crear-gifo-hover.svg";
}

linkFavoritos.addEventListener("click", () => {
    drawFavoritosHTMLSection();
    alert("Se registro el evento");
})

header.addEventListener("click", () => {
    altura = header.offsetTop;
    alert("El estado del sticky del header cambio " + altura);
})



//Captura de Eventos
////////////////////




///////////////////////////
//Fin de captura de eventos

function drawFavoritosHTMLSection() {
    sectionTop.className = "sectionHidden";
    sectionSearch.className = "sectionHidden";
    sectionTrendingTerms.className = "sectionHidden";
}


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