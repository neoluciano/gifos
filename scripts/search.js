const giphyEndpointSearch = "https://api.giphy.com/v1/gifs/search?"
const giphyAutocomplete = "https://api.giphy.com/v1/gifs/search/tags?"
const resultsLimit = 12;


let searchBar = document.getElementById("searchBar");
let searchArea = document.getElementById("searchArea");
let searchInputText = document.getElementById("searchInputText");
let searchButton = document.getElementById("searchButton");
let closeButton = document.getElementById("closeButton");
let searchAutoComplete = document.getElementById("searchAutocomplete");
let autocompleteResultsList = document.getElementById("autocompleteResultsList");
let verMasButton = document.getElementById("verMasButton");
let imgVerMasButton = document.getElementById("imgVerMasButton");
let labelVerMasButton = document.getElementById("labelVerMasButton")
let searchedText = document.getElementById("searchedText");
let closeImage = document.getElementById("closeImage");
let searchTime = 0;
let modal = document.getElementById("gifModal");
let modalImg = document.getElementById("gifMaximized");
let modalClose = document.getElementById("modalClose");
let sliderButtonPrev = document.getElementById("prevGif");
let sliderButtonNext = document.getElementById("nextGif");

let arrayResultsGif = [];


//Captura de Eventos
////////////////////
searchInputText.addEventListener("click", () => {
    searchBarStyle("active");
})

searchInputText.addEventListener("keyup", function(e) {

    if ((e.key === "Enter") && (searchInputText.value != "")) {
        searchTime = 0;
        loadAndPutSearchedGifs(searchInputText.value, 0);
        searchBarStyle("inactive");

    } else if (searchInputText.value != "") {
        autocompletResults(searchInputText.value);
    } else {
        autoCompleteAreaStyle("inactive");
    }
})

closeButton.addEventListener("click", () => {
    searchBarStyle("inactive");
    autoCompleteAreaStyle("inactive");
})

searchButton.addEventListener("click", () => {
    if (searchInputText.value != "") {
        searchTime = 0;
        loadAndPutSearchedGifs(searchInputText.value, 0);
    }
})

verMasButton.addEventListener("click", () => {
    searchTime++;
    let offset = searchTime * resultsLimit; //Especifica la posicion de inicio de los resultados a traer.
    console.log("El offset se paso en " + offset)
    loadAndPutSearchedGifs(searchedText.textContent, offset);
})

imgVerMasButton.onmouseover = () => {
    imgVerMasButton.src = "/images/CTA-ver-mas-hover.svg";
}

imgVerMasButton.onmouseleave = () => {
    imgVerMasButton.src = "/images/CTA-ver-mas.svg";
}

modalClose.addEventListener("click", () => {
    modal.style.display = "none";
})

sliderButtonNext.onmouseover = () => {
    sliderButtonNext.src = "/images/button-slider-right-hover.svg";
}

sliderButtonNext.onmouseleave = () => {
    sliderButtonNext.src = "/images/button-slider-right.svg";

}



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
                suggestion.setAttribute("onclick", `loadAndPutSearchedGifs("${item.name}",0)`);
                suggestion.innerHTML = `${item.name}`;

                resultDiv.appendChild(autoImage);
                resultDiv.appendChild(suggestion);
                autocompleteResultsList.appendChild(resultDiv);
            }
        })
        .catch(error => {
            console.error("autocompletResults: se produjo el error siguiente: " + error);
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



async function buscarGif(searchValue, offset) {
    let url = giphyEndpointSearch + "api_key=" + giphyApiKey + "&q=" + searchValue + "&limit=" + resultsLimit + "&offset=" + offset;
    let response = await fetch(url);
    let resultArray = await response.json();

    if (offset === 0) {
        console.log("Entro por offset 0");
        arrayResultsGif = resultArray.data;
    } else {
        console.log(`Entro por offset ${offset}`);
        arrayResultsGif = arrayResultsGif.concat(resultArray.data);
    }

    console.log("El array temporal contiene lo siguiente: ")
    console.log(arrayResultsGif);

    return resultArray; //retorna un array con los resultados de busqueda
}

function getGifInfo(gifId) {
    return arrayResultsGif.find(gif => gif.id === gifId);
}

function getGifIndexOf(gifId) {
    return arrayResultsGif.findIndex(gif => gif.id === gifId)
}

function loadAndPutSearchedGifs(searchValue, offset) {
    buscarGif(searchValue, offset)
        .then(array => {
            autoCompleteAreaStyle("inactive");
            let noResultsDiv = document.getElementById("noResultsDiv");
            let searchResultsSection = document.getElementById("searchResults");

            searchResultsSection.className = "searchResultsDisplayed";

            console.log(array.data.length);

            let searchResultsGifs = document.getElementById("searchResultsGifs");
            //searchResultsGifs es la seccion donde se cargan los GIFs que arroja el resutlado de la busqueda
            searchedText.textContent = searchValue;

            let newSearchResultsGifs = document.createElement('div');
            newSearchResultsGifs.id = "searchResultsGifs";

            if (offset === 0) {
                searchResultsGifs.innerHTML = "";
            }

            if (array.data.length === 0) { //Si la busqueda no arrojo resultados:
                noResultsDiv.className = "noResultsDivDisplayed";
                labelVerMasButton.style.display = "none";
            } else {
                labelVerMasButton.style.display = "block";
                noResultsDiv.className = "noResultsDiv";
                for (item of array.data) {
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
                    searchResultsGifs.appendChild(resultSearchGifDiv);
                }
            }

        })
        .catch(error => {
            console.error("loadAndPutSearchedGifs: Se produjo el error siguiente: " + error);
        })
}


function createCardForGif(userFromApi, titleFromApi, idFromApi, gifUrl) {
    let cardGif = document.createElement("div");
    cardGif.className = "cardGif";

    let actionIcons = document.createElement("div");
    actionIcons.className = "actionIcons";

    let icon;
    // let buttonText = "Favorito";
    // let imgSrc = "";
    // let imgSrcHover = "";

    // if (checkIsFavoriteGif(idFromApi)) {
    //     imgSrc = "/images/icon-fav-active.svg"
    //     imgSrcHover = imgSrc;
    // } else {
    //     imgSrc = "/images/icon-fav.svg";
    //     imgSrcHover = "/images/icon-fav-hover.svg"
    // }

    //Creo el icono para agregar a "Mis Favoritos" el gif.
    //icon = createActionIconForGifCard(buttonText, imgSrc, imgSrcHover, idFromApi)
    icon = createFavoriteIconForGifCard(idFromApi);
    actionIcons.appendChild(icon);

    //Creo el Icono para descargar el gif.
    icon = createDownloadIconForGifCard(gifUrl);
    actionIcons.appendChild(icon);

    // buttonText = "Ampliar";
    // imgSrc = "/images/icon-max-normal.svg";
    // imgSrcHover = "/images/icon-max-hover.svg";

    //Creo el icono para maximizar el Gif
    icon = createMaximizeIconForGifCard(idFromApi);
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

function createFavoriteIconForGifCard(idFromApi) {
    let icon = document.createElement("div");
    let button = document.createElement("input");
    let buttonValue = 'Favorito'

    button.type = "button";
    button.value = buttonValue;
    button.className = "cardGifButton";
    button.id = idFromApi;

    icon.appendChild(button);
    let label = document.createElement("label");
    label.className = "cardGifIcon"
    label.setAttribute("for", button.id);
    let img = document.createElement("img");
    img.setAttribute("onclick", `src=addOrRemoveFavoriteGif("${idFromApi}")`);

    let imgSrc = "";
    if (checkIsFavoriteGif(idFromApi)) {
        imgSrc = "/images/icon-fav-active.svg"
        imgSrcHover = imgSrc;
    } else {
        imgSrc = "/images/icon-fav.svg";
        imgSrcHover = "/images/icon-fav-hover.svg"
    }

    img.src = imgSrc;
    img.alt = buttonValue;
    label.appendChild(img);
    icon.appendChild(label);

    return icon;

}

// function createActionIconForGifCard(buttonValue, imageSrc, imageHover, idFromApi) {
//     let icon = document.createElement("div");
//     let button = document.createElement("input");
//     button.type = "button";
//     button.value = buttonValue;
//     button.className = "cardGifButton";
//     if (idFromApi != "") {
//         button.id = idFromApi;
//     } else {
//         button.id = `button${buttonValue}`;
//     }

//     icon.appendChild(button);

//     let label = document.createElement("label");
//     label.className = "cardGifIcon"
//     label.setAttribute("for", button.id);

//     let img = document.createElement("img");
//     if (idFromApi != "") { //Si el valor de ID del gif desde la API no es nulo, signfica que se trata del icono para agregar/remover favoritos
//         img.setAttribute("onclick", `src=addOrRemoveFavoriteGif("${idFromApi}")`);
//     }
//     img.src = imageSrc;


//     img.alt = buttonValue;

//     label.appendChild(img);
//     icon.appendChild(label);

//     return icon;
// }


function createMaximizeIconForGifCard(gifId) {
    let imageSrc = "/images/icon-max-normal.svg";
    let icon = document.createElement("div");
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Ampliar";
    button.className = "cardGifButton";
    button.id = `button${button.value}`;


    icon.appendChild(button);

    let label = document.createElement("label");
    label.className = "cardGifIcon"
    label.setAttribute("for", button.id);

    let img = document.createElement("img");
    img.setAttribute("onclick", `maximizeGif("${gifId}")`);

    // if (idFromApi != "") { //Si el valor de ID del gif desde la API no es nulo, signfica que se trata del icono para agregar/remover favoritos
    //     img.setAttribute("onclick", `src=addOrRemoveFavoriteGif("${idFromApi}")`);
    // }

    img.src = imageSrc;
    img.alt = button.value;

    label.appendChild(img);
    icon.appendChild(label);

    return icon;
}


function maximizeGif(gifId) {
    let gifArrayLength = arrayResultsGif.length;
    let gif = getGifInfo(gifId);
    let indexOfGif = getGifIndexOf(gifId);

    let sliderPrevDiv = document.getElementById("sliderPrevDiv");
    sliderPrevDiv.innerHTML = "";
    let sliderNextDiv = document.getElementById("sliderNextDiv");
    sliderNextDiv.innerHTML = "";

    if (indexOfGif != 0) { //Evaluo esta condicion para saber si es el inicio del array, caso en el que no dibujaria el boton previo
        let gifIdPrev = arrayResultsGif[indexOfGif - 1].id;
        let sliderButtonPrev = document.createElement("img");
        sliderButtonPrev.className = "sliderButton";
        sliderButtonPrev.id = "prevGif";
        sliderButtonPrev.src = "/images/button-slider-left.svg";
        sliderButtonPrev.alt = "Anterior";
        sliderButtonPrev.setAttribute("onclick", `maximizeGif("${gifIdPrev}")`);
        sliderPrevDiv.appendChild(sliderButtonPrev);
        console.log("ID Previo: " + gifIdPrev);
        sliderButtonPrev.onmouseover = () => {
            sliderButtonPrev.src = "/images/button-slider-left-hover.svg";
        }
        sliderButtonPrev.onmouseleave = () => {
            sliderButtonPrev.src = "/images/button-slider-left.svg";
        }

    }

    if (indexOfGif != (gifArrayLength - 1)) { //Evaluo esta condicion para saber si es el final del array, caso en el que no dibujaria el boton siguiente
        let gifIdNext = arrayResultsGif[indexOfGif + 1].id;
        let sliderButtonNext = document.createElement("img");

        sliderButtonNext.className = "sliderButton";
        sliderButtonNext.id = "nextGif";
        sliderButtonNext.src = "/images/button-slider-right.svg";
        sliderButtonNext.alt = "Siguiente";
        sliderButtonNext.setAttribute("onclick", `maximizeGif("${gifIdNext}")`);
        sliderNextDiv.appendChild(sliderButtonNext);
        console.log("ID Siguiente: " + gifIdNext);

        sliderButtonNext.onmouseover = () => {
            sliderButtonNext.src = "/images/button-slider-right-hover.svg";
        }
        sliderButtonNext.onmouseleave = () => {
            sliderButtonNext.src = "/images/button-slider-right.svg";
        }
    }

    console.log(gif);
    console.log(indexOfGif);

    modalImg.src = gif.images.original.url;
    modal.style.display = "block";
    modalClose.style.width = `${modalImg.clientWidth}px`;
    console.log(modalImg.clientWidth);
    userTitleGifMaximized = document.getElementById("userTitleGifMaximized");
    userTitleGifMaximized.innerHTML = "";
    buttonsGifMaximized = document.getElementById("buttonsGifMaximized");
    buttonsGifMaximized.innerHTML = "";
    user = document.createElement("p");
    title = document.createElement("p");
    user.innerHTML = gif.username;
    title.innerHTML = gif.title;
    userTitleGifMaximized.appendChild(user);
    userTitleGifMaximized.appendChild(title);

    let icon = createDownloadIconForGifCard(gif.images.original.url);
    buttonsGifMaximized.appendChild(icon);
    icon = createFavoriteIconForGifCard(gifId)
    buttonsGifMaximized.appendChild(icon);

}


//Funcion que genera el icono de descarga para embeber en las hoverCards
function createDownloadIconForGifCard(gifUrl) {
    let imgSrc = "/images/icon-download.svg";
    let icon = document.createElement("div");
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Descargar";
    button.className = "cardGifButton";
    button.id = `buttonDownload`;

    icon.appendChild(button);

    let label = document.createElement("label");
    label.className = "cardGifIcon"
    label.setAttribute("for", button.id);

    let img = document.createElement("img");
    img.setAttribute("onclick", `createAForDownloadGif("${gifUrl}")`);
    img.src = imgSrc;
    img.alt = "Descargar";

    label.appendChild(img);
    icon.appendChild(label);

    return icon;
}

//Funcion que se llama cuando se hace click en el icono de descarga de un Gif.
async function createAForDownloadGif(gifUrl) {
    let a = document.createElement('a');
    // Obtengo la imagen como un blob
    let response = await fetch(gifUrl);
    let file = await response.blob();
    //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes
    a.download = 'gifOS';
    a.href = window.URL.createObjectURL(file);
    //store download https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
    a.dataset.downloadurl = ['image/gif', a.download, a.href].join(':');
    //Inicio el download
    a.click();
}