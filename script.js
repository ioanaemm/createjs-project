let placesData;
const mainTflUrl = 'https://api.tfl.gov.uk/';
const serviceTypesUrl = 'Journey/Meta/Modes';
const stage = new createjs.Stage('demoCanvas');

init();

function init() {
  requestTflServices();
  requestLocation();
  createjs.Touch.enable(stage);
  stage.enableMouseOver(10);
  createjs.Ticker.addEventListener("tick", stage);
}


function requestLocation() {
  if ("geolocation" in navigator) {
    /* geolocation is available */
    navigator.geolocation.getCurrentPosition(useCurrentPosition);
  } else {
    /* geolocation IS NOT available */
  }
}

function useCurrentPosition(position) {
  displayCurrentPosition(position);
  const placesURL = `${mainTflUrl}/Place?type=NaptanMetroStation,NaptanRailStation&lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=1000`;
  axios.get(placesURL).then((response) => {
    placesData = response.data;

    // displayNearbyStations();
    console.log(placesData);
  });

}

function displayCurrentPosition(position) {
  position.coords.loaded = true;
  console.log(position);
  var crtLocationResponse = 'Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude;
  var crtLocation = new createjs.Text(crtLocationResponse, '20px Lato', '#e74c3c');
  crtLocation.x = 300;
  crtLocation.y = 0;
  crtLocation.textBaseLine = "alphabetic";
  stage.addChild(crtLocation);
}

function requestTflServices() {
  axios.get(mainTflUrl + serviceTypesUrl)
    .then(response => {
      var tflServices = response.data.filter(value => value.isTflService);
      displayTflServices(tflServices);
    });
}


function displayTflServices(services) {
  services.forEach((mode, index) => {
    var uppercasedMode = mode.modeName.charAt(0).toUpperCase() + mode.modeName.substring(1);
    var dashlessMode = uppercasedMode.replace("-", " ");
    var menuButton = new createjs.MovieClip();
    menuButton.x = 0;
    menuButton.y = index * 25;
    stage.addChild(menuButton);
    var rectangle = new createjs.Shape();
    rectangle.graphics.beginFill('#2c3e50').drawRect(0,0, 280, 23);
    rectangle.x = 0;
    rectangle.y = 0;
    menuButton.addChild(rectangle);
    var text = new createjs.Text(dashlessMode, '18px Lato', '#ecf0f1');
    text.x = 30;
    text.y = 0;
    text.textBaseLine = "alphabetic";
    menuButton.addChild(text);
    menuButton.addEventListener("click", (event) => {
      rectangle.graphics.beginFill('#000').drawRect(0,0, 280, 23);
      displayNearbyStations();

    });
  });
}

function displayNearbyStations() {
  //alert('aaa');

  if(!placesData) return;
  var tubeStationsNearCrtLocation = placesData.places;
  //alert('aaa');
  console.log(tubeStationsNearCrtLocation);
  tubeStationsNearCrtLocation.forEach((tubeStation, index) =>{
    var tubeStationsContainer = new createjs.MovieClip();
    tubeStationsContainer.x = 0;
    tubeStationsContainer.y = 30;
    stage.addChild(tubeStationsContainer);
    var tubeStationsList = new createjs.Text(tubeStation.commonName,  '15px Lato', '#e74c3c');
    tubeStationsList.x = 300;
    tubeStationsList.y = index * 20;
    tubeStationsList.textBaseLine = "alphabetic";
    tubeStationsContainer.addChild(tubeStationsList);
  });
}
