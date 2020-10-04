let searchInputText = document.getElementById("searchInputText");

let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
    alert("Lo que se busco fue: " + searchInputText.value);
})