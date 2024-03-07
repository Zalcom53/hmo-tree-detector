document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([29.11581244934719, -110.9923636201875], 13);

    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, Maxar, GeoEye, Earthstar Geographics'
    });

    var geojsonLayer = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                fillColor: 'green',
                color: 'green',
                weight: 1,
                fillOpacity: 0.7,
                radius: 10
            });
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    }).addTo(map);

    function loadGeoJSON() {
        fetch('data.geojson')
            .then(response => response.json())
            .then(geojsonData => {
                geojsonLayer.clearLayers();
                geojsonLayer.addData(geojsonData);
                map.fitBounds(geojsonLayer.getBounds());
            })
            .catch(error => console.error('Error al cargar el archivo GeoJSON:', error));
    }

    function toggleSatelliteView() {
        if (map.hasLayer(osmLayer)) {
            map.removeLayer(osmLayer);
            map.addLayer(satelliteLayer);
        } else {
            map.removeLayer(satelliteLayer);
            map.addLayer(osmLayer);
        }
    }

    function countCoordinates() {
        var count = 0;
        geojsonLayer.eachLayer(function (layer) {
            count++;
        });
        alert('Número de coordenadas: ' + count);
    }

    function locateUser() {
        map.locate({ setView: true, maxZoom: 15 });
    }

    document.getElementById('toggleSatelliteView').addEventListener('click', toggleSatelliteView);
    document.getElementById('countCoordinatesBtn').addEventListener('click', countCoordinates);
    document.getElementById('locateUserBtn').addEventListener('click', locateUser);

    loadGeoJSON();
});
