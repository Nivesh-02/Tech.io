const Locations = [
  {
    placename: "LT1",
    latitude: 25.260215,
    longitude: 82.991178
  },
  {
    placename: "LC",
    latitude: 25.260708,
    longitude: 82.986878
  },
  {
    placename: "IITBHU",
    latitude: 25.263308,
    longitude: 82.989659
  },
  {
    placename: "VISHAWANATH TEMPLE",
    latitude: 25.265955,
    longitude: 82.987942
  },{
    placename: "SURAJ SAINI ROOM",
    latitude: 25.258398,
    longitude: 82.985758
  },{
    placename: "SAMPREETHDEVARAKONDA ROOM",
    latitude: 25.257775,
    longitude: 82.985382
  },{
    placename: "Karma Center",
    latitude: 25.258140,
    longitude: 82.985531
  },
];


// getting places from APIs
function loadPlaces(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'ITMLBP4EKCI4XPBM2KT1MGT14G45GLJQVDEWS4EIC0FTFAMM',
        clientSecret: 'NKYQCYSNWYZXY0KZ4W0HZGUZUSOEABYNDUQVW43X0G4NSNLU',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30 
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        Locations.forEach((place) => {
            const latitude = place.latitude;
            const longitude = place.longitude;

            const icon = document.createElement('a-entity');
            icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
            icon.setAttribute('name', place.placename);
            icon.setAttribute('gltf-model', './assets/signal.gltf');
            icon.setAttribute('rotation', '0 180 0');
            icon.setAttribute('animation-mixer', '');
            icon.setAttribute('scale', '30 30 30');
            icon.addEventListener('loaded', () => {
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
            });

            scene.appendChild(icon);
        })
        /*loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const placeText = document.createElement('a-link');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', place.name);
                    placeText.setAttribute('scale', '15 15 15');
                    
                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);
                });
            })*/
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};


