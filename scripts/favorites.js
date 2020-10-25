const giphyGetGifsByIdEndpoint = "https://api.giphy.com/v1/gifs?";

let favoritesSection = document.getElementById("favoritesSection");
let linkFavoritos = document.getElementById("linkFavoritos");
let favoritesGifsDiv = document.getElementById("favoritesGifs");
let favoritesLoad = 0;


//Captura de Eventos
////////////////////

linkFavoritos.addEventListener("click", () => {
    drawFavoritosHTMLSection();
    loadAndPutMyFavoritesGifs(0);

})

///////////////////////////
//Fin de captura de eventos



function drawFavoritosHTMLSection() {
    sectionTop.className = "sectionHidden";
    sectionSearch.className = "sectionHidden";
    sectionTrendingTerms.className = "sectionHidden";
    favoritesSection.className = "favoritesSectionDisplayed";
    linkFavoritos.style.color = "#9CAFC3";

}


async function getGifsByIds(string) {
    let url = giphyGetGifsByIdEndpoint + "api_key=" + giphyApiKey + "&ids=" + string;
    let response = await fetch(url);
    let json = await response.json();
    let results = json.data
    return results;
}

function loadAndPutMyFavoritesGifs(offset) {
    if (offset === 0) {
        favoritesGifsDiv.innerHTML = "";
    }

    let arrayFavoritos = JSON.parse(localStorage.getItem("gifosFavoriteGifs"));
    arrayFavoritos = arrayFavoritos.splice(offset, resultsLimit); //traigo solo 12 gifs por peticion, comenzando por la posicion del offset.
    let arrayToString = arrayFavoritos.join(',');
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
                favoritesGifsDiv.appendChild(resultSearchGifDiv);

            }
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}



function addOrRemoveFavoriteGif(gifId) {
    let alreadyExists = false;
    let iconResult = "";
    if (localStorage.getItem("gifosFavoriteGifs") != null) {
        let arrayFavoritos = JSON.parse(localStorage.getItem("gifosFavoriteGifs"))
        for (item of arrayFavoritos) { //Si ya existe, lo elimino del local storage.
            if (item === gifId) {
                alreadyExists = true;
                console.log(`El GIF ${gifId} se eliminara de los favoritos.`)
                    // console.error("El gif que intento agregar ya existe en favoritos.");
                arrayFavoritos.splice(arrayFavoritos.indexOf(item), 1);
                localStorage.setItem("gifosFavoriteGifs", JSON.stringify(arrayFavoritos));
                iconResult = "/images/icon-fav.svg";
                break;
            }
        }
        if (!alreadyExists) {
            arrayFavoritos.push(gifId);
            localStorage.setItem("gifosFavoriteGifs", JSON.stringify(arrayFavoritos));
            iconResult = "/images/icon-fav-active.svg";
        }

    } else {
        console.log("Aun no se registraron GIF favoritos en el storage local.");
        let arrayFavoritos = [];
        arrayFavoritos[0] = gifId;
        localStorage.setItem("gifosFavoriteGifs", JSON.stringify(arrayFavoritos));
        iconResult = "/images/icon-fav-active.svg";
    }

    return iconResult;

}


function checkIsFavoriteGif(gifId) {
    let isFavorite = false;
    if (localStorage.getItem("gifosFavoriteGifs") != null) {
        let arrayFavoritos = JSON.parse(localStorage.getItem("gifosFavoriteGifs"))
        for (item of arrayFavoritos) {
            if (item === gifId) {
                isFavorite = true;
                console.log(`El gif ${gifId} existe en los favoritos del local storage.`);
                break;
            }
        }
    }

    return isFavorite;
}