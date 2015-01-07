L.GeoIP = L.extend({

    getPosition: function (ip) {
        var url = "http://ip-api.com/json";
        var result = L.latLng(0, 0);

        if (ip !== undefined) {
            url = url + ip;
        } else {
            //lookup our own ip address
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                console.log(xhr.responseText);
                var geoip_response = JSON.parse(xhr.responseText);
                result.lat = geoip_response.lat;
                result.lon = geoip_response.lon;
                console.log(result.lat);
                console.log(result.lon);
            } else {
                console.log("Leaflet.GeoIP.getPosition failed because its XMLHttpRequest got this response: " + xhr.status);
            }
        };
        xhr.send();
        return result;
    },

    centerMapOnPosition: function (map, zoom, ip) {
        var position = L.GeoIP.getPosition(ip);
        map.setView(position, zoom);
    }
});
