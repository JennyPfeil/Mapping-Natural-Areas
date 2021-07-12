// setting up filters
const filteredGeojson = {
    type: 'FeatureCollection',
    features: [],
};

const filterSettings = config.filters;

const checkboxFilters = [];

const currentFilters = [];

/** Sets up the full filter list */
function setupFilters() {
    let modal = document.getElementById('modal'); // filters popup

    // make popup openable
    let filterResults = document.getElementById('filterResults');
    filterResults.addEventListener('click', () => {
        modal.classList.remove('hide-visually');
        modal.classList.add('z5');
    });

    // make popup closable
    let exitButton = document.getElementById('exitButton');
    exitButton.addEventListener('click', () => {
        modal.classList.add('hide-visually');
    });

    //
    createFilterObject();
    applyFilters();
    filterSettings.forEach(function (filter) {
        buildFilterList(filter.title, filter.listItems);
    });
    removeFiltersButton();
}

// SETUP HELPERS

/** Sets up the checkboxFilters list */
function createFilterObject() {
    filterSettings.forEach(function (filter) {
        let columnHeader = filter.columnHeader;
        let listItems = filter.listItems;

        const keyValues = {};
        Object.assign(keyValues, { header: columnHeader, value: listItems });
        checkboxFilters.push(keyValues);
    });
}

/** Builds the html for each filter sublist */
// TODO: Clean up code - for every third checkbox, create a div and append new checkboxes to it
function buildFilterList(title, listItems) {
    // setting variables to point to HTML
    let filtersDiv = document.getElementById('filters');

    let mainDiv = document.createElement('div');

    let filterTitle = document.createElement('div');
    filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');

    let formatContainer = document.createElement('div');
    formatContainer.classList.add(
        'center',
        'flex-parent',
        'flex-parent--column',
        'px3',
        'flex-parent--space-between-main'
    );

    let secondLine = document.createElement('div');
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
    for (let i = 0; i < listItems.length; i++) { // for each item
        let container = document.createElement('label');

        container.classList.add('checkbox-container');

        // Add a new checkbox
        let input = document.createElement('input');
        input.classList.add('px12', 'filter-option');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', listItems[i]);
        input.setAttribute('value', listItems[i]);

        // Wrap it up in HTML
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

// FILTER APPLICATION



/** Apply filters as selected */
function applyFilters() {
    // Add a filtering function to watch for any change to the checkboxes
    const filterForm = document.getElementById('filters');

    filterForm.addEventListener('change', function () {
        const filterOptionHTML = this.getElementsByClassName('filter-option');
        const filterOption = [].slice.call(filterOptionHTML);

        const geojCheckboxFilters = [];
        filteredFeatures = [];
        filteredGeojson.features = [];

        // Go through and push the checked options into a list
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
        });

        // If nothing has been checked, push all parks through to the filtered list
        if (geojCheckboxFilters.length === 0) {
            geojsonData.features.forEach(function (feature) {
                filteredGeojson.features.push(feature);
            });
        }

        // Otherwise, if there has been a change, empty out the filteredGeojson data and filter all the parks through it
        else if (geojCheckboxFilters.length !== currentFilters.length) {
            let i = 0;

            while (i < filteredGeojson.features.length) {
                filteredGeojson.features.pop();
                i++;
            }

            let filteredParks = recursiveFilter(geojCheckboxFilters, 0, geojsonData);

            filteredParks.features.forEach(function (feature) {
                filteredGeojson.features.push(feature);
            });
        }

        map.getSource('locationData').setData(filteredGeojson);
        buildLocationList(filteredGeojson);
    });
}

/** A recursive filter to make sure filtering works subtractively
 * Input: the full list of filters, the index up to which it has been filtered, and the
 * featureCollection of parks that have passed through the filters thus far
 * Output: the list, fully filtered through all filters i and above*/
function recursiveFilter(filterList, i, filteredParksList) {
    // takes in the list of all filters being used, the index the function is currently on, and the list of parks
    // filtered by all filters up to index i
    if (i < filterList.length) {
        let filter = filterList[i];
        let filteredAgain = {
            type: 'FeatureCollection',
            features: [],
        };

        filteredParksList.features.forEach(function (feature) {
            if (feature.properties[filter[0]].includes(filter[1])) {
                filteredAgain.features.push(feature);
            }
        });

        return recursiveFilter(filterList, i+1, filteredAgain);
    } else {
        return filteredParksList;
    }
}

/** Create the button to remove all filters */
function removeFiltersButton() {
    let removeFilter = document.getElementById('removeFilters');
    removeFilter.addEventListener('click', function () {
        removeFilters();
    });
}

/** Remove all filters (function triggered by the filter removal button) */
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