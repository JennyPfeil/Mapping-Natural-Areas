
const config = {
    style: "mapbox://styles/mapbox/light-v10",
    accessToken: "pk.eyJ1IjoiamVubmlmZXJwZmVpbCIsImEiOiJja2puNzZpdW0wcjN6MnluMDY0MWQyM21pIn0.qfZ6ocRVbznPiGbB-omH3Q",
    CSV: "naturalareasdata.csv",
    center: [-79.39775965337452,43.663461999999996], //Lng, Lat
    zoom: 11, //Default zoom
    title: "Natural Areas Database",
    description: "You can search by address to sort the list below by distance. You can also filter the park usage, environment and historical significance.",
    sideBarInfo: ["Name", "Cover Image", "Blurb"],
    popupInfo: ["Name"],
    filters: [
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
        {
            type: "dropdown",
            title: "Title of filter: ",
            columnHeader: "Column Name",
            listItems: [
                'filter one',
                'filter two',
                'filter three',
                'filter four',
                'filter five',
                'filter six',
                'filter seven'
            ]
        }
    ]

};
