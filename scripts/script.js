const giphyApiKey = "tVjH0saoMhui1wYJRjsWdaUR6c0pKvn4";
const giphyTrendingSearchTerms = "https://api.giphy.com/v1/trending/searches?";
const giphyTrendingSearchGifs = "https://api.giphy.com/v1/gifs/trending?";

let parrafoTrendingTerms = document.getElementById("trendingTerms");
let trendingGifsList = document.getElementById("gifList");


//Llamado a funciones que se ejecutan al cargar la HOME
loadAndPutTrendingTerms(); //Obtiene y dibuja en el HTML los trending terms.
loadAndPutTrendingGifs(); //Obtiene y dibuja en el HTML los trending GIFs
// addFavoriteGif("TEST");
//Fin del Llamado a funciones que se ejecutan al cargar la HOME

//Captura de Eventos
////////////////////


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