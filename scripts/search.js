const giphyEndpointSearch = "https://api.giphy.com/v1/gifs/search?"
const giphyAutocomplete = "https://api.giphy.com/v1/gifs/search/tags?"

let searchBar = document.getElementById("searchBar");
let searchArea = document.getElementById("searchArea");
let searchInputText = document.getElementById("searchInputText");
let searchButton = document.getElementById("searchButton");
let closeButton = document.getElementById("closeButton");
let searchAutoComplete = document.getElementById("searchAutocomplete");
let autocompleteResultsList = document.getElementById("autocompleteResultsList");
let verMasButton = document.getElementById("verMasButton");
let searchedText = document.getElementById("searchedText");
let closeImage = document.getElementById("closeImage");
let searchTime = 0;
let resultsLimit = 12;

//Captura de Eventos
////////////////////
searchInputText.addEventListener("click", () => {
    searchBarStyle("active");
})

searchInputText.addEventListener("keyup", function(e) {

    if ((e.key === "Enter") && (searchInputText.value != "")) {
        searchTime = 0;
        loadAndPutSearchedGifs(searchInputText.value, resultsLimit, 0);
        searchBarStyle("inactive");

    } else if (searchInputText.value != "") {
        autocompletResults(searchInputText.value);
    }
})

closeButton.addEventListener("click", () => {
    searchBarStyle("inactive");
    autoCompleteAreaStyle("inactive");
})

searchButton.addEventListener("click", () => {


    if (searchInputText.value != "") {
        searchTime = 0;

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
            let newSearchResultsGifs = document.createElement('div');
            newSearchResultsGifs.id = "searchResultsGifs";

            for (item of array.data) {
                // console.log(item);
                let resultSearchGifDiv = document.createElement("div");
                resultSearchGifDiv.className = "resultSearchGifDiv";

                let newGif = document.createElement('img');
                newGif.src = item.images.original.url;
                newGif.alt = item.title;
                newGif.className = "searchedGifsHome";

                let cardGif = createCardForGif(item.userName, item.title, item.id);

                resultSearchGifDiv.appendChild(newGif);
                resultSearchGifDiv.appendChild(cardGif);

                newSearchResultsGifs.appendChild(resultSearchGifDiv);
            }
            searchResultsGifs.replaceWith(newSearchResultsGifs);
            searchBarStyle("inactive");
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}

function createCardForGif(userFromApi, titleFromApi, idFromApi) {
    let cardGif = document.createElement("div");
    cardGif.className = "cardGif";

    let actionIcons = document.createElement("div");
    actionIcons.className = "actionIcons";

    let icon = createActionIconForGifCard("Favorito", "/images/icon-fav.svg", "/images/icon-fav-hover.svg", idFromApi)
    actionIcons.appendChild(icon);
    icon = createActionIconForGifCard("Descargar", "/images/icon-download.svg", "/images/icon-download-hover.svg", "");
    actionIcons.appendChild(icon);
    icon = createActionIconForGifCard("Ampliar", "/images/icon-max-normal.svg", "/images/icon-max-hover.svg", "")
    actionIcons.appendChild(icon);

    let cardGifDescription = document.createElement("div");
    cardGifDescription.className = "cardGifDescription";

    let userName = document.createElement("p");
    userName.textContent = userFromApi;

    let title = document.createElement("p");
    title.className = "tituloCardGifDescription";
    title.textContent = titleFromApi;

    cardGif.appendChild(actionIcons);
    cardGif.appendChild(cardGifDescription);
    cardGifDescription.appendChild(userName);
    cardGifDescription.appendChild(title);

    return cardGif;
}

function createActionIconForGifCard(buttonValue, imageSrc, imageHover, idFromApi) {
    let icon = document.createElement("div");
    let button = document.createElement("input");
    button.type = "button";
    button.value = buttonValue;
    button.className = "cardGifButton";
    if (idFromApi != "") {
        button.id = idFromApi;
    } else {
        button.id = `button${buttonValue}`;
    }


    icon.appendChild(button);

    let label = document.createElement("label");
    label.className = "cardGifIcon"
    label.setAttribute("for", button.id);

    let img = document.createElement("img");
    if (idFromApi != "") {
        if (checkIsFavoriteGif(idFromApi)) {
            console.log("Coincidencia!");
            let activeFavoriteSrc = "/images/icon-fav-active.svg";
            img.src = activeFavoriteSrc;
        } else {
            img.src = imageSrc;
            img.setAttribute("onclick", `addFavoriteGif("${idFromApi}")`);
        }
    } else {
        img.src = imageSrc;
    }
    // img.src = imageSrc;
    img.setAttribute("onmouseover", `src='${imageHover}'`);
    img.setAttribute("onmouseout", `src='${imageSrc}'`);
    // if (idFromApi != "") {
    //     checkIsFavoriteGif(idFromApi);
    //     img.setAttribute("onclick", `addFavoriteGif("${idFromApi}")`);
    // }
    img.alt = buttonValue;

    label.appendChild(img);
    icon.appendChild(label);

    return icon;
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