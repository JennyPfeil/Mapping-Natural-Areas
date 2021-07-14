// MAP SETUP

function transformRequest(url, resourceType) {
    var isMapboxRequest =
        url.slice(8, 22) === 'api.mapbox.com' ||
        url.slice(10, 26) === 'tiles.mapbox.com';
    return {
        url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
    };
}

// NAVIGATION FUNCTIONS

function initialZoom(locationData){
    let params = new URLSearchParams((document.location.search.substring(1)));
    let lat = params.get("lat");
    let lon = params.get("lon");
    locationData.features.forEach(function (location, i) {
        if (location.geometry.coordinates[0] + 0.00001 >= lon && location.geometry.coordinates[1] + 0.00001 >= lat
            && location.geometry.coordinates[0] - 0.00001 <= lon && location.geometry.coordinates[1] - 0.00001 <= lat) {
            goToLocation(location, popupInfo(location));
        }
    });
}

function goToLocation(location, popupInfo) {
    const clickedListing = location.geometry.coordinates;
    flyToLocation(clickedListing);
    sortByDistance(clickedListing);
    createPopup(location, popupInfo);

    const activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) {
        activeItem[0].classList.remove('active');
    }

    const popup = document.getElementsByClassName('mapboxgl-popup');
    if (popup[0]) {
        popup[0].classList.add('active');
    }


    const divList = document.querySelectorAll('.content');
    const divCount = divList.length;
    for (let i = 0; i < divCount; i++) {
        divList[i].style.maxHeight = null;
    }

    /*
    for (let i = 0; i < geojsonData.features.length; i++) {
        this.parentNode.classList.remove('active');
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }*/
}

function flyToLocation(currentFeature) {
    map.flyTo({
        center: currentFeature,
        zoom: 15,
    });
}

function createPopup(currentFeature, popupInfo) {
    const popups = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popups[0]) popups[0].remove();

    let info = popupInfo;

    const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(info)
        .addTo(map);

    twttr.widgets.load(document.getElementById("social-buttons")); // TODO: IF NOT LOADED... DO SMTHN

}