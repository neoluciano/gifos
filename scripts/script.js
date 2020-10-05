const giphyApiKey = "tVjH0saoMhui1wYJRjsWdaUR6c0pKvn4";
const giphyEndpointSearch = "https://api.giphy.com/v1/gifs/search?"
const giphyTrendingSearchTerms = "https://api.giphy.com/v1/trending/searches?";
const giphyTrendingSearchGifs = "https://api.giphy.com/v1/gifs/trending?";


let searchInputText = document.getElementById("searchInputText");
let searchButton = document.getElementById("searchButton");
let parrafoTrendingTerms = document.getElementById("trendingTerms");
let trendingGifsList = document.getElementById("gifList");


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
                let a = document.createElement('a');
                a.textContent = element;
                a.target = "_blank";
                a.href = `https://giphy.com/search/${element}`;
                parrafoTrendingTerms.appendChild(a);
            }
        }).catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}

searchButton.addEventListener("click", () => {
    // alert("Lo que se busco fue: " + searchInputText.value); Linea de prueba
    console.log(buscarGif(searchInputText.value));

})

async function buscarGif(searchValue) {
    let url = giphyEndpointSearch + "api_key=" + giphyApiKey + "&q=" + searchValue + "&limit=5";
    let response = await fetch(url);
    let json = await response.json();
    return json;
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
            console.log(array.data)
            for (item of array.data) {
                console.log(item.title);
                console.log(item.images.original.url);
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


//Llamado a funciones que se ejecutan al cargar la HOME
loadAndPutTrendingTerms(); //Obtiene y dibuja en el HTML los trending terms.
loadAndPutTrendingGifs();


//Fin del Llamado a funciones que se ejecutan al cargar la HOME