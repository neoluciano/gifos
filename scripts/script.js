const giphyApiKey = "tVjH0saoMhui1wYJRjsWdaUR6c0pKvn4";
const giphyEndpointSearch = "https://api.giphy.com/v1/gifs/search?"
const giphyTrendingSearchTerms = "https://api.giphy.com/v1/trending/searches?";
const giphyTrendingSearchGifs = "https://api.giphy.com/v1/gifs/trending?";
const giphyAutocomplete = "https://api.giphy.com/v1/gifs/search/tags?"

let searchBar = document.getElementById("searchBar");
let searchArea = document.getElementById("searchArea");
let searchInputText = document.getElementById("searchInputText");
let searchButton = document.getElementById("searchButton");
let closeButton = document.getElementById("closeButton");
let searchAutoComplete = document.getElementById("searchAutocomplete");
let autocompleteResultsList = document.getElementById("autocompleteResultsList");
let parrafoTrendingTerms = document.getElementById("trendingTerms");
let trendingGifsList = document.getElementById("gifList");
let verMasButton = document.getElementById("verMasButton");
let searchedText = document.getElementById("searchedText");
let closeImage = document.getElementById("closeImage");
let searchTime = 0;
let resultsLimit = 12;


//Llamado a funciones que se ejecutan al cargar la HOME
loadAndPutTrendingTerms(); //Obtiene y dibuja en el HTML los trending terms.
loadAndPutTrendingGifs(); //Obtiene y dibuja en el HTML los trending GIFs
//Fin del Llamado a funciones que se ejecutan al cargar la HOME

//Captura de Eventos
////////////////////
searchInputText.addEventListener("click", () => {
    searchBarStyle("active");
})

searchInputText.addEventListener("keyup", function(e) {

    if ((e.key === "Enter") && (searchInputText.value != "")) {
        loadAndPutSearchedGifs(searchInputText.value, resultsLimit, 0);
        searchBarStyle("inactive");
        // autoCompleteAreaStyle("inactive");
    } else if (searchInputText.value != "") {
        autocompletResults(searchInputText.value);
    }
})

closeButton.addEventListener("click", () => {
    searchBarStyle("inactive");
    autoCompleteAreaStyle("inactive");
})

searchButton.addEventListener("click", () => {

    autoCompleteAreaStyle("inactive");
    if (searchInputText.value != "") {
        loadAndPutSearchedGifs(searchInputText.value, resultsLimit, 0);
    }
})

verMasButton.addEventListener("click", () => {
    searchTime++;
    let offset = searchTime * resultsLimit; //Especifica la posicion de inicio de los resultados a traer.
    console.log("El offset se paso en " + offset)
    loadAndPutMoreSearchedGifs(searchedText.textContent, resultsLimit, offset);
})

///////////////////////////
//Fin de captura de eventos

async function autocompleteSearch(term) {
    let url = giphyAutocomplete + "api_key=" + giphyApiKey + "&q=" + term;
    let response = await fetch(url);
    let json = await response.json();
    let results = json.data
    return results;
}

function autocompletResults(term) {
    autocompleteSearch(term)
        .then(array => {
            autoCompleteAreaStyle("active");
            for (item of array) {
                let resultDiv = document.createElement("div");
                resultDiv.className = "autocompleteResult";

                let autoImage = document.createElement("img");
                autoImage.className = "autoImage";
                autoImage.src = "/images/icon-search.svg";
                autoImage.alt = `Buscar ${item.name}`;

                let suggestion = document.createElement("div");
                suggestion.setAttribute("onclick", `loadAndPutSearchedGifs("${item.name}","${resultsLimit}",0)`);
                suggestion.innerHTML = `${item.name}`;

                resultDiv.appendChild(autoImage);
                resultDiv.appendChild(suggestion);
                autocompleteResultsList.appendChild(resultDiv);
            }
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
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
                span.setAttribute("onclick", `loadAndPutSearchedGifs("${element}","${resultsLimit}",0)`);
                parrafoTrendingTerms.appendChild(span);
            }
        }).catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}

function searchBarStyle(status) {
    if (status === "active") {
        searchArea.style.flexDirection = "row-reverse";
        closeImage.style.display = "flex";
        closeImage.style.alignItems = "center";
    } else if (status === "inactive") {
        searchArea.style.flexDirection = "row";
        closeImage.style.display = "none";
        searchInputText.value = "";

    }

}

function autoCompleteAreaStyle(status) {
    if (status === "active") {
        autocompleteResultsList.innerHTML = "";
        searchAutoComplete.className = "searchAutocompleteDisplayed";
    } else if (status === "inactive") {
        autocompleteResultsList.innerHTML = "";
        searchAutoComplete.className = "searchAutocomplete";

    }

}

async function buscarGif(searchValue, resultsLimit, offset) {
    let url = giphyEndpointSearch + "api_key=" + giphyApiKey + "&q=" + searchValue + "&limit=" + resultsLimit + "&offset=" + offset;
    let response = await fetch(url);
    let resultArray = await response.json();
    return resultArray; //retorna un array con los resultados de busqueda
}

function loadAndPutSearchedGifs(searchValue, resultsLimit, offset) {
    buscarGif(searchValue, resultsLimit, offset)
        .then(array => {
            autoCompleteAreaStyle("inactive");
            let searchResultsSection = document.getElementById("searchResults");
            searchResultsSection.className = "searchResultsDisplayed";
            let searchResultsGifs = document.getElementById("searchResultsGifs");

            searchedText.textContent = searchValue;
            // console.log(array.data)
            let newSearchResultsGifs = document.createElement('div');
            newSearchResultsGifs.id = "searchResultsGifs";

            for (item of array.data) {
                let newGif = document.createElement('img');
                newGif.src = item.images.original.url;
                newGif.alt = item.title;
                newGif.className = "searchedGifsHome";
                newSearchResultsGifs.appendChild(newGif);
            }
            searchResultsGifs.replaceWith(newSearchResultsGifs);
            searchBarStyle("inactive");
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}


function loadAndPutMoreSearchedGifs(searchValue, resultsLimit, offset) {
    buscarGif(searchValue, resultsLimit, offset)
        .then(array => {
            let searchResultsGifs = document.getElementById("searchResultsGifs");
            for (item of array.data) {
                let newGif = document.createElement('img');
                newGif.src = item.images.original.url;
                newGif.alt = item.title;
                newGif.className = "searchedGifsHome";
                searchResultsGifs.appendChild(newGif);
            }
        })
        .catch(error => {
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