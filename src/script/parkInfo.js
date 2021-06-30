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
    return '<h3>' + currentLocation.properties[config.popupInfo[0]] + buildSocials(currentLocation) +'</h3>';
}

/** Generates and returns the HTML for a bar of social media links */
function buildSocials(currentLocation) {
    let link = getLocationLink(currentLocation);

    let twt = "<button id='tweet' class='txt-bold btn btn--stroke mr0-ml mr12 px18-ml px6'>\n" +
        "<a href=\"https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&amp;" +
        "ref_src=twsrc%5Etfw&amp;text=Just%20visiting!&amp;tw_p=tweetbutton&amp;url=" + link +
        "\" class=\"btn\" id=\"b\"><i></i><span class=\"label\" id=\"l\">Tweet</span></a></button>";

    return twt;
}

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