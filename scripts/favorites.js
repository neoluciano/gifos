const giphyGetGifsByIdEndpoint = "https://api.giphy.com/v1/gifs?";

async function getGifsByIds(string) {
    let url = giphyGetGifsByIdEndpoint + "api_key=" + giphyApiKey + "&ids=" + string;
    let response = await fetch(url);
    let json = await response.json();
    let results = json.data
    return results;
}

function getMyFavoritesGifs() {
    let arrayFavoritos = JSON.parse(localStorage.getItem("gifosFavoriteGifs"));
    // console.log(arrayFavoritos);
    // console.log(arrayFavoritos.join(','));
    let arrayToString = arrayFavoritos.join(',');
    getGifsByIds(arrayToString)
        .then(array => {
            console.log(array);
            for (item of array) {

            }
        })
        .catch(error => {
            console.error("Se produjo el error siguiente: " + error);
        })
}

getMyFavoritesGifs();

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