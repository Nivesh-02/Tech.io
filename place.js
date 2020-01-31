const Locations = [
  {
    placename: "LC",
    latitude: 25.260708,
    longitude: 82.986878
  }
];

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
            icon.setAttribute('gltf-model', './assets/technexonlygltf.gltf');
            icon.setAttribute('rotation', '0 180 0');
            //icon.setAttribute('animation-mixer', '');
            icon.setAttribute('scale', '15 15 15');
            icon.addEventListener('loaded', () => {
                window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
            });
            const clickListener = function(ev) {
                ev.stopPropagation();
                ev.preventDefault();

                const name = ev.target.getAttribute('name');

                const el = ev.detail.intersection && ev.detail.intersection.object.el;

                if (el && el === ev.target) {
                    const label = document.createElement('span');
                    const container = document.createElement('div');
                    container.setAttribute('id', 'place-label');
                    label.innerText = name;
                    container.appendChild(label);
                    document.body.appendChild(container);

                    setTimeout(() => {
                        container.parentElement.removeChild(container);
                    }, 1500);
                };
            };

            icon.addEventListener('click', clickListener);

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

