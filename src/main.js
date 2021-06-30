// Set up map

mapboxgl.accessToken = config.accessToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.center,
    zoom: config.zoom,
    //transformRequest: transformRequest,
});

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: true, // Use the geocoder's default marker style
    zoom: 11,
});

map.on('load', function () {
    map.addControl(geocoder, 'top-right');

    // csv2geojson - following the Sheet Mapper tutorial https://www.mapbox.com/impact-tools/sheet-mapper
    console.log('loaded');
    $(document).ready(function () {
        console.log('ready');
        $.ajax({
            type: 'GET',
            url: config.CSV,
            dataType: 'text',
            success: function (csvData) {
                makeGeoJSON(csvData);

                buildLocationList(geojsonData);
                initialZoom(geojsonData);
            },
            error: function (request, status, error) {
                console.log(request);
                console.log(status);
                console.log(error);
            },
        });
    });
});

geocoder.on('result', function (ev) {
    const searchResult = ev.result.geometry;
    sortByDistance(searchResult);
});

// Set up info in config

const title = document.getElementById('title');
title.innerText = config.title;
const description = document.getElementById('description');
description.innerText = config.description;

setupFilters();

