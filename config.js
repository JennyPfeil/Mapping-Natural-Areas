
const config = {
    style: "mapbox://styles/mapbox/light-v10",
    accessToken: "pk.eyJ1IjoiamVubmlmZXJwZmVpbCIsImEiOiJja2puNzZpdW0wcjN6MnluMDY0MWQyM21pIn0.qfZ6ocRVbznPiGbB-omH3Q",
    CSV: "naturalareasdata.csv",
    center: [-79.39775965337452,43.663461999999996], //Lng, Lat
    zoom: 11, //Default zoom
    title: "Natural Areas Database",
    description: "Find the space that best fits you! Search through our natural areas database by filtering various park attributes below.",
    sideBarInfo: ["Name", "Cover Image", "Address", "Blurb"],
    popupInfo: ["Name", "Address"],
    filters: [
        {
            type: "dropdown",
            title: "Size Categorization: ",
            columnHeader: "Subsize",
            listItems: [
                'Park',
                'Parkette'
            ]
        },
        {
            type: "checkbox",
            title: "Usage: ",
            columnHeader: "Usage",
            listItems: ["Walking", "Cycling", "Tennis Courts", "Skating", "Swimming", "Sports Fields", "Dog Park"]
        },
        {
            type: "checkbox",
            title: "Environment: ",
            columnHeader: "Attributes",
            listItems: ["Hill", "Open Fields", "Pond", "Wooded", "River", "Lake", "Beach", "Urban Farm"]
        },
    ]

};
