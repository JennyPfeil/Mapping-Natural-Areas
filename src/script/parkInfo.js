let columnHeaders = config.sideBarInfo;

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
        let leftSide = listing.appendChild(document.createElement('div'));
        leftSide.className = 'column';
        leftSide.style = 'margin-bottom: 5px';

        let image = leftSide.appendChild(document.createElement('img'));
        image.src = coverImgPath + prop[columnHeaders[1]];

        let rightSide = listing.appendChild(document.createElement('div'));
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

        link.addEventListener('click', goToLocation.bind(this, location, popupInfo(location)));
    });
}

/** Returns the HTML that should go inside a popup */
function popupInfo(currentLocation) {
    return '<h3>' + currentLocation.properties[config.popupInfo[0]] + '</h3>'+ buildSocials(currentLocation);
}

/** Generates and returns the HTML for a bar of social media links */
function buildSocials(currentLocation) {
    let twt = "<a class=\"twitter-share-button\"\n" +
        "  href=\"https://twitter.com/intent/tweet?text=Just%20visiting!&amp;url=" +
        getLocationLink(currentLocation) + "&amp;hashtags=nature\">\n" + "Tweet</a>";

    let group = "<div id=\"social-buttons\" class=\"social-bar\">\n" + twt + "</div>";

    return group;
}

/** Generates and returns a link for a given location that can be embedded in a social media share link */
function getLocationLink(currentLocation) {
    var link = pageURL;

    link += "%3F";

    // Add location data
    link += "lat%3D";
    link += currentLocation.geometry.coordinates[1];
    link += "%26lon%3D";
    link += currentLocation.geometry.coordinates[0];

    return link;
}