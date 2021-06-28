/* eslint-disable strict */
mapboxgl.accessToken = config.accessToken;
const columnHeaders = config.sideBarInfo;

const iconPath = "../lib/img/icons/";
const coverImgPath = "../lib/img/coverimages/";
const subpagePath = "../src/subpages/";

let geojsonData = {};
const filteredGeojson = {
    type: 'FeatureCollection',
    features: [],
};

const map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.center,
    zoom: config.zoom,
    transformRequest: transformRequest,
});

// SIDEBAR

/** Builds the sidebar (list of all locations) based on input data */
function buildLocationList(locationData) {
    const listings = document.getElementById('listings');
    listings.innerHTML = '';
    locationData.features.forEach(function (location, i) {
        const prop = location.properties;

        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = 'listing-' + prop.id;

        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        //create columns in sidebar
        listing.classList.add('row');
        leftSide = listing.appendChild(document.createElement('div'));
        leftSide.className = 'column';
        leftSide.style = 'margin-bottom: 5px';

        image = leftSide.appendChild(document.createElement('img'));
        image.src = coverImgPath + prop[columnHeaders[1]];

        rightSide = listing.appendChild(document.createElement('div'));
        rightSide.style = 'margin-left: 5px;';
        rightSide.className = 'column';

        /* Add the link to the individual listing created above. */
        const link = rightSide.appendChild(document.createElement('button'));
        link.className = 'title';
        link.id = 'innerlink-' + prop.id;
        link.innerHTML =
            '<p style="line-height: 1.25">' + prop[columnHeaders[0]] +'</p>';

        /* Add details to the individual listing. */
        const details1 = rightSide.appendChild(document.createElement('div'));
        details1.innerHTML += '<p style="color: #7F7F7F;">'+ prop[columnHeaders[2]] +'</p>';

        const details2 = rightSide.appendChild(document.createElement('div'));
        details2.innerHTML += '<p style="color: #000000;">'+ prop[columnHeaders[3]] +'</p>';
        details2.innerHTML += "<a href=" + subpagePath + prop[columnHeaders[4]] +' > More Info </a>';

        link.addEventListener('click', goToLocation.bind(this, location));
    });

    initialZoom(locationData);
}

// FILTERS

// setting up filters

/** Sets up the full filter list */
function filters(filterSettings) {
    filterSettings.forEach(function (filter) {
        buildFilterList(filter.title, filter.listItems);
    });
}

/** Builds a filter sublist */
// To DO: Clean up code - for every third checkbox, create a div and append new checkboxes to it
function buildFilterList(title, listItems) {

    /* setting up general HTML skeleton */
    const filtersDiv = document.getElementById('filters');
    const mainDiv = document.createElement('div');
    const filterTitle = document.createElement('div');
    filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');
    const formatContainer = document.createElement('div');
    formatContainer.classList.add(
        'center',
        'flex-parent',
        'flex-parent--column',
        'px3',
        'flex-parent--space-between-main'
    );
    const secondLine = document.createElement('div');
    secondLine.classList.add(
        'center',
        'flex-parent',
        'py12',
        'px3',
        'flex-parent--space-between-main'
    );
    filterTitle.innerText = title;
    mainDiv.appendChild(filterTitle);
    mainDiv.appendChild(formatContainer);

    /* adding the actual filters */
    buildCheckboxes(listItems, formatContainer);

    filtersDiv.appendChild(mainDiv);
}

/** Transmutes a list of filters into a nested checkboxes */
function buildCheckboxes (listItems, formatContainer) {
    for (let i = 0; i < listItems.length; i++) {
        let container = document.createElement('label');

        container.classList.add('checkbox-container');

        let input = document.createElement('input');
        input.classList.add('px12', 'filter-option');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', listItems[i]);
        input.setAttribute('value', listItems[i]);

        let checkboxDiv = document.createElement('div');
        let inputValue = document.createElement('p');
        inputValue.innerText = listItems[i];
        checkboxDiv.classList.add('checkbox', 'mr6');
        checkboxDiv.appendChild(Assembly.createIcon('check'));

        container.appendChild(input);
        container.appendChild(checkboxDiv);
        container.appendChild(inputValue);

        formatContainer.appendChild(container);
    }
}

const selectFilters = [];
const checkboxFilters = [];

/** Setting up filter functionality*/
function createFilterObject(filterSettings) {
    filterSettings.forEach(function (filter) {
        let columnHeader = filter.columnHeader;
        let listItems = filter.listItems;

        const keyValues = {};
        Object.assign(keyValues, { header: columnHeader, value: listItems });
        checkboxFilters.push(keyValues);
    });
}

/** Apply filters as selected */
function applyFilters() {
    const filterForm = document.getElementById('filters');

    filterForm.addEventListener('change', function () {
        const filterOptionHTML = this.getElementsByClassName('filter-option');
        const filterOption = [].slice.call(filterOptionHTML);

        const geojSelectFilters = [];
        const geojCheckboxFilters = [];
        filteredFeatures = [];
        filteredGeojson.features = [];

        filterOption.forEach(function (filter) {
            if (filter.type === 'checkbox' && filter.checked) {
                checkboxFilters.forEach(function (objs) {
                    Object.entries(objs).forEach(function ([key, value]) {
                        if (value.includes(filter.value)) {
                            const geojFilter = [objs.header, filter.value];
                            geojCheckboxFilters.push(geojFilter);
                        }
                    });
                });
            }

            if (filter.type === 'select-one' && filter.value) {
                selectFilters.forEach(function (objs) {
                    Object.entries(objs).forEach(function ([key, value]) {
                        if (value.includes(filter.value)) {
                            const geojFilter = [objs.header, filter.value];
                            geojSelectFilters.push(geojFilter);
                        }
                    });
                });
            }
        });

        if (geojCheckboxFilters.length === 0 && geojSelectFilters.length === 0) {
            geojsonData.features.forEach(function (feature) {
                filteredGeojson.features.push(feature);
            });
        } else if (geojCheckboxFilters.length > 0) {
            geojCheckboxFilters.forEach(function (filter) {
                geojsonData.features.forEach(function (feature) {
                    if (feature.properties[filter[0]].includes(filter[1])) {
                        if (
                            filteredGeojson.features.filter(
                                (f) => f.properties.id === feature.properties.id
                            ).length === 0
                        ) {
                            filteredGeojson.features.push(feature);
                        }
                    }
                });
            });

            if (geojSelectFilters.length > 0) {
                const removeIds = [];
                filteredGeojson.features.forEach(function (feature) {
                    let selected = true;
                    geojSelectFilters.forEach(function (filter) {
                        if (
                            feature.properties[filter[0]].indexOf(filter[1]) < 0 &&
                            selected === true
                        ) {
                            selected = false;
                            removeIds.push(feature.properties.id);
                        } else if (selected === false) {
                            removeIds.push(feature.properties.id);
                        }
                    });
                });
                removeIds.forEach(function (id) {
                    const idx = filteredGeojson.features.findIndex(
                        (f) => f.properties.id === id
                    );
                    filteredGeojson.features.splice(idx, 1);
                });
            }
        } else {
            geojsonData.features.forEach(function (feature) {
                let selected = true;
                geojSelectFilters.forEach(function (filter) {
                    if (
                        !feature.properties[filter[0]].includes(filter[1]) &&
                        selected === true
                    ) {
                        selected = false;
                    }
                });
                if (
                    selected === true &&
                    filteredGeojson.features.filter(
                        (f) => f.properties.id === feature.properties.id
                    ).length === 0
                ) {
                    filteredGeojson.features.push(feature);
                }
            });
        }

        map.getSource('locationData').setData(filteredGeojson);
        buildLocationList(filteredGeojson);
    });
}

/** Remove all filters */
function removeFilters() {
    let input = document.getElementsByTagName('input');
    let select = document.getElementsByTagName('select');
    let selectOption = [].slice.call(select);
    let checkboxOption = [].slice.call(input);
    filteredGeojson.features = [];
    checkboxOption.forEach(function (checkbox) {
        if (checkbox.type == 'checkbox' && checkbox.checked == true) {
            checkbox.checked = false;
        }
    });

    selectOption.forEach(function (option) {
        option.selectedIndex = 0;
    });

    map.getSource('locationData').setData(geojsonData);
    buildLocationList(geojsonData);
}

/** Create the button to remove all filters */
function removeFiltersButton() {
    const removeFilter = document.getElementById('removeFilters');
    removeFilter.addEventListener('click', function () {
        removeFilters();
    });
}

createFilterObject(config.filters);
applyFilters();
filters(config.filters);
removeFiltersButton();

// MAP

// basic nav functions

function goToLocation(location) {
    const clickedListing = location.geometry.coordinates;
    flyToLocation(clickedListing);
    createPopup(location);

    const activeItem = document.getElementsByClassName('active');
    if (activeItem[0]) {
        activeItem[0].classList.remove('active');
    }
    this.parentNode.classList.add('active'); //type error fix

    const divList = document.querySelectorAll('.content');
    const divCount = divList.length;
    for (i = 0; i < divCount; i++) {
        divList[i].style.maxHeight = null;
    }

    for (let i = 0; i < geojsonData.features.length; i++) {
        this.parentNode.classList.remove('active');
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}

function initialZoom(locationData){
    let params = new URLSearchParams((document.location.search.substring(1)));
    let lat = params.get("lat");
    let lon = params.get("lon");
    locationData.features.forEach(function (location, i) {
        if (location.geometry.coordinates[0] + 0.0001 >= lon && location.geometry.coordinates[1] + 0.0001 >= lat &&
            location.geometry.coordinates[0] - 0.0001 <= lon && location.geometry.coordinates[1] - 0.0001 <= lat) {
            goToLocation(location);
        }
    });
}

function flyToLocation(currentFeature) {
    map.flyTo({
        center: currentFeature,
        zoom: 15,
    });
}

function createPopup(currentFeature) {
    const popups = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popups[0]) popups[0].remove();

    info = '<h3>' + currentFeature.properties[config.popupInfo[0]] + '</h3>';

    info += createSocials(currentFeature);

    const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(info)
        .addTo(map);
}

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: true, // Use the geocoder's default marker style
    zoom: 11,
});

function sortByDistance(selectedPoint) {
    const options = { units: 'miles' };
    if (filteredGeojson.features.length > 0) {
        var data = filteredGeojson;
    } else {
        var data = geojsonData;
    }
    data.features.forEach(function (data) {
        Object.defineProperty(data.properties, 'distance', {
            value: turf.distance(selectedPoint, data.geometry, options),
            writable: true,
            enumerable: true,
            configurable: true,
        });
    });

    data.features.sort(function (a, b) {
        if (a.properties.distance > b.properties.distance) {
            return 1;
        }
        if (a.properties.distance < b.properties.distance) {
            return -1;
        }
        return 0; // a must be equal to b
    });
    const listings = document.getElementById('listings');
    while (listings.firstChild) {
        listings.removeChild(listings.firstChild);
    }
    buildLocationList(data);
}

geocoder.on('result', function (ev) {
    const searchResult = ev.result.geometry;
    sortByDistance(searchResult);
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
            },
            error: function (request, status, error) {
                console.log(request);
                console.log(status);
                console.log(error);
            },
        });
    });
});

function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(
        csvData,
        {
            latfield: 'Latitude',
            lonfield: 'Longitude',
            delimiter: ',',
        },
        function (err, data) {
            data.features.forEach(function (data, i) {
                data.properties.id = i;
            });
            geojsonData = data;
            file = iconPath + 'parkicon.png';
            map.loadImage(file, function (error, image) {
                map.addImage('Park', image);
            });
            geojsonData = data;
            file = iconPath + 'urbanparkicon.png';
            map.loadImage(file, function (error, image) {
                map.addImage('Urban Park', image);
            });
            geojsonData = data;
            file = iconPath + 'pocketparkicon.png';
            map.loadImage(file, function (error, image) {
                map.addImage('Pocket Park', image);
            });

            map.addLayer({
                id: 'locationData',
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: geojsonData,
                },
                'layout': {
                    'icon-image': ['get','Subsize'],
                    'icon-size': 0.10,
                    'icon-allow-overlap': true
                },
            });
        }
    );

    map.on('click', 'locationData', function (e) {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['locationData'],
        });
        const clickedPoint = features[0].geometry.coordinates;
        flyToLocation(clickedPoint);
        sortByDistance(clickedPoint);
        createPopup(features[0]);
    });

    map.on('mouseenter', 'locationData', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', function () {
        map.getCanvas().style.cursor = '';
    });
    buildLocationList(geojsonData);
}

// Modal - popup for filtering results
const filterResults = document.getElementById('filterResults');
const exitButton = document.getElementById('exitButton');
const modal = document.getElementById('modal');

filterResults.addEventListener('click', () => {
    modal.classList.remove('hide-visually');
    modal.classList.add('z5');
});

exitButton.addEventListener('click', () => {
    modal.classList.add('hide-visually');
});

const title = document.getElementById('title');
title.innerText = config.title;
const description = document.getElementById('description');
description.innerText = config.description;


/** Generates and returns a link for a given location that can be embedded in a social media share link */
function getLocationLink(currentLocation) {
    var link = window.location.href;

    // Convert link into information that can be embedded into another link
    while (link.includes("/")) {
        link = link.replace("/", "%2F");
    }
    while (link.includes(":")) {
        link = link.replace(":", "%3A");
    }
    if (link.includes("?")) {
        while (link.includes("?")) {
            link = link.replace("?", "%3F");
        }
        link += "%26";
    } else {
        link += "%3F";
    }

    // Add location data
    link += "lat%3D";
    link += currentLocation.geometry.coordinates[1];
    link += "%26lon%3D";
    link += currentLocation.geometry.coordinates[0];

    return link;
}

function createSocials(currentLocation) {
    let link = getLocationLink(currentLocation);

    let twt = "<button id='tweet' class='txt-bold btn btn--stroke mr0-ml mr12 px18-ml px6'>\n" +
        "<a href=\"https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&amp;" +
        "ref_src=twsrc%5Etfw&amp;text=Just%20visiting!&amp;tw_p=tweetbutton&amp;url=" + link +
        "\" class=\"btn\" id=\"b\"><i></i><span class=\"label\" id=\"l\">Tweet</span></a></button>";

    return twt;
}

function transformRequest(url, resourceType) {
    var isMapboxRequest =
        url.slice(8, 22) === 'api.mapbox.com' ||
        url.slice(10, 26) === 'tiles.mapbox.com';
    return {
        url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
    };
 }