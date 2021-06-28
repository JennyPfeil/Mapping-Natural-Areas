
const config = {
    style: "mapbox://styles/mapbox/light-v10",
    accessToken: "pk.eyJ1IjoiamVubmlmZXJwZmVpbCIsImEiOiJja2puNzZpdW0wcjN6MnluMDY0MWQyM21pIn0.qfZ6ocRVbznPiGbB-omH3Q",
    CSV: "../lib/naturalareasdata.csv",
    center: [-79.39775965337452,43.663461999999996], //Lng, Lat
    zoom: 11, //Default zoom
    title: "Natural Areas Database",
    description: "Find the space that best fits you! Search through our natural areas database by filtering various park attributes below.",
    sideBarInfo: ["Name", "Cover Image", "Address", "Blurb", "Subpage"],
    popupInfo: ["Name"],
    filters: [
        {
            type: "checkbox",
            title: "Size Categorization:",
            columnHeader: "Subsize",
            listItems: ["Pocket Park", "Urban Park", "Park"]
        },
        {
            type: "checkbox",
            title: "Environment:",
            columnHeader: "Environment",
            listItems: ["Open Field", "Dense Tree Coverage", "Groupings of Trees", "Pond", "Hill", "Ravine"]
        },
        {
            type: "checkbox",
            title: "Usage:",
            columnHeader: "Usage",
            listItems: ["Cycling Trails", "Hiking Trails", "Dog Park", "Picnic Tables", "Benches"]
        },
        {
            type: "checkbox",
            title: "Infrastructure:",
            columnHeader: "Infrastructure",
            listItems: ["Sports Facilities", "Zoo", "Farm", "Farmer Market", "Plant Conservatory", "Public Art", "Playground", "None"]
        },
        {
            type: "checkbox",
            title: "Sports Facilities: ",
            columnHeader: "Sports Facilities",
            listItems: ["Tennis Court", "Baseball Diamond", "Ice Skating Rink", "Soccer Field", "Skating Park", "Swimming Pool", "Track Field", "Volleyball Court", "Bocce Court", "Cricket Field"]
        },
        {
            type: "checkbox",
            title: "Iconic Wildlife:",
            columnHeader: "Iconic Wildlife",
            listItems: ["Swan", "Beaver", "None"]
        },
        {
            type: "checkbox",
            title: "Iconic Plants:",
            columnHeader: "Iconic Plants",
            listItems: ["Cherry Blossom Tree", "Magnolia Tree", "None"]
        },
    ]

};
