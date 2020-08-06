let counter = 0;

// Animation / interval Vars

var animLoop = false,
    animIndex = 0,
    planePath = false,
    trailPath = false;

// Reference of city lat / long points

var places = {
    paris: [48.8566, 2.3522],
    ambala: [30.3752, 76.7821],
};

// Set up a google maps object with disabled user interaction (no zoom, no pan etc.)

function loadMap() {
    var options = {
        zoom: 3,
        center: new google.maps.LatLng(40, 40),
    };
    mapObject = new google.maps.Map(
        document.getElementById("mapCanvas"),
        options
    );
    const goldStar = {
        path:
            "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
        fillColor: "yellow",
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: "gold",
        strokeWeight: 14,
    };
    console.log("sdgsfdg");
    m1 = new google.maps.Marker({
        position: { lat: 48.8566, lng: 2.3522 },
        mapObject,
        title: "Paris",
        // icon: goldStar,
        visible: true,
    });
    m2 = new google.maps.Marker({
        position: { lat: 30.3752, lng: 76.7821 },
        mapObject,
        title: "Ambala",
    });
    planePath = new google.maps.Polyline({
        path: [
            { lat: 48.8566, lng: 2.3522 },
            { lat: 30.3752, lng: 76.7821 },
        ],
        strokeColor: "#f03d30",
        strokeWeight: 5,
        icons: [
            {
                icon: planeSymbol,
                offset: "0%",
            },
        ],
        map: mapObject,
        geodesic: true,
    });
    m1.setMap(mapObject);
    m2.setMap(mapObject);
}

// Plane Symbol - uses an SVG path

var planeSymbol = {
    path:
        "M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z",
    fillColor: "#fff",
    fillOpacity: 1.5,
    scale: 1.2,
    anchor: new google.maps.Point(11, 11),
    strokeWeight: 1,
    strokeColor: "#000",
};

function animate(startPoint, endPoint) {
    (startPoint = places[startPoint]), (endPoint = places[endPoint]);

    // Convert the points arrays into Lat / Lng objects
    var sP = new google.maps.LatLng(startPoint[0], startPoint[1]);
    var eP = new google.maps.LatLng(endPoint[0], endPoint[1]);

    // Create a polyline for the planes path

    planePath = new google.maps.Polyline({
        path: [sP, eP],
        strokeColor: "#0f0",
        strokeWeight: 0,
        icons: [
            {
                icon: planeSymbol,
                offset: "0%",
            },
        ],
        map: mapObject,
        geodesic: true,
    });

    trailPath = new google.maps.Polyline({
        path: [sP, sP],
        strokeColor: "#2eacd0",
        strokeWeight: 2,
        map: mapObject,
        geodesic: true,
    });

    // Start the animation loop
    animLoop = window.requestAnimationFrame(function () {
        tick(sP, eP);
    });
}

function tick(startPoint, endPoint) {
    animIndex += 1;

    // Draw trail
    var nextPoint = google.maps.geometry.spherical.interpolate(
        startPoint,
        endPoint,
        animIndex / 100
    );
    trailPath.setPath([startPoint, nextPoint]);
    planePath.icons[0].offset = Math.min(animIndex, 100) + "%";
    planePath.setPath(planePath.getPath());

    // Ensure the plane is in the center of the screen
    // mapObject.panTo(nextPoint);

    // We've reached the end, clear animLoop
    if (animIndex >= 100) {
        window.cancelAnimationFrame(animLoop);
        animIndex = 0;
    } else {
        animLoop = window.requestAnimationFrame(function () {
            tick(startPoint, endPoint);
        });
    }
}

// Get values from select boxes, run the animation.

function go() {
    if (counter < 5) {
        animIndex = 0;
        window.cancelAnimationFrame(animLoop);
        animate(
            document.getElementById("s_from").options[
                document.getElementById("s_from").selectedIndex
            ].value,
            document.getElementById("s_to").options[
                document.getElementById("s_to").selectedIndex
            ].value
        );
        counter++;
        // if (counter == 5) alert("Rafale successfully delivered to India");
    } else {
        alert("Rafale successfully delivered to India");
    }
}
