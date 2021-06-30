var geojsonData = {};
const iconPath = "../lib/img/icons/";

/** Turn the data in the csv file into geoJSON format */
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
            let file = iconPath + 'parkicon.png';
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

        goToLocation(features[0]); //TODO: use this for url!!
    });

    map.on('mouseenter', 'locationData', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', function () {
        map.getCanvas().style.cursor = '';
    });
}

/** Sort the data items by their distance from a given point */
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
