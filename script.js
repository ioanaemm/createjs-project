let placesData;
const mainTflUrl = 'https://api.tfl.gov.uk/';
const serviceTypesUrl = 'Journey/Meta/Modes';
const radius = 1500;
const stage = new createjs.Stage('demoCanvas');

let stationContainer = new createjs.MovieClip();
stationContainer.x = 300;
stationContainer.y = 80;
stage.addChild(stationContainer);
stationContainer.visible = false;

let serviceContainer = new createjs.MovieClip();
serviceContainer.x = 0;
serviceContainer.y = 0;
stage.addChild(serviceContainer);


let detailsContainer = new createjs.MovieClip();
detailsContainer.x = 700;
detailsContainer.y = 0;
stage.addChild(detailsContainer);


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
  const placesURL = `${mainTflUrl}/Place?type=NaptanMetroStation,NaptanRailStation&lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=${radius}`;
  axios.get(placesURL).then(response => {
    placesData = response.data;
    console.log(placesData);

    const title = new createjs.Text(`Stations within ${radius}m from you`, '20px Lato', '#444');
    title.x = 0;
    title.y = 0;
    title.textBaseLine = "alphabetic";
    stationContainer.addChild(title);

    const subtitle = new createjs.Text('(click on them for details)', '14px Lato', '#444');
    subtitle.x = 0;
    subtitle.y = 25;
    subtitle.textBaseLine = "alphabetic";
    stationContainer.addChild(subtitle);

    placesData.places.forEach((station, index) => {
      const stationItem = new createjs.MovieClip();
      stationItem.x = 0;
      stationItem.y = index * 80 + 65;
      stationItem.data = station;
      stationItem.cursor = 'pointer';

      const bg = new createjs.Shape();
      bg.graphics.beginFill('#2c3e50').drawRect(0,0, 370, 60);
      stationItem.addChild(bg);

      stationItem.addEventListener('click', stationClickHandler);

      const stationName = new createjs.Text(station.commonName,  '15px Lato', '#fff');
      stationName.x = 10;
      stationName.y = 10;
      stationName.textBaseLine = "alphabetic";
      stationName.mouseEnabled = false;

      const distance = new createjs.Text( `Distance: ${parseInt(station.distance)}m`, '13px Lato', '#fff');
      distance.x = 10;
      distance.y = 30;
      distance.textBaseLine = "alphabetic";
      distance.mouseEnabled = false;
      stationItem.addChild(distance);

      stationItem.addChild(stationName);
      stationContainer.addChild(stationItem);
    });
  });

}

function stationClickHandler(event) {
  detailsContainer.removeAllChildren();
  const data = event.target.parent.data;

  const title = new createjs.Text('Transport modes from this station', '20px Lato', '#444');
  title.x = 0;
  title.y = 0;
  title.textBaseLine = "alphabetic";
  detailsContainer.addChild(title);

  data.lineModeGroups.forEach((group, index) => {
    const bg = new createjs.Shape();
    bg.graphics.beginFill('#2c3e50').drawRect(0,0, 300, 60);
    detailsContainer.addChild(bg);
    bg.x = 0;
    bg.y = index * 70 + 35;

    const groupType = new createjs.Text(group.modeName, '20px Lato', '#fff');
    groupType.x = 10;
    groupType.y = index * 70 + 40;
    groupType.textBaseLine = "alphabetic";
    detailsContainer.addChild(groupType);

    const groupIdentifier = new createjs.Text(group.lineIdentifier.join(",  "), '13px Lato', '#fff');
    groupIdentifier.x = 10;
    groupIdentifier.y = index * 70 + 70;
    groupIdentifier.textBaseLine = "alphabetic";
    detailsContainer.addChild(groupIdentifier);
  });
}

function displayCurrentPosition(position) {
  position.coords.loaded = true;

  const bg = new createjs.Shape();
  bg.graphics.beginFill('#2c3e50').drawRect(0,0, 370, 35);
  bg.x = 300;
  bg.y = 30;
  stage.addChild(bg);

  var crtLocationResponse = `Latitude: ${position.coords.latitude.toFixed(2)} | Longitude: ${position.coords.longitude.toFixed(2)}`;
  var crtLocation = new createjs.Text(crtLocationResponse, '13px Lato', '#fff');
  crtLocation.x = 310;
  crtLocation.y = 40;
  crtLocation.textBaseLine = "alphabetic";
  stage.addChild(crtLocation);



  var title = new createjs.Text('Your current location:', '20px Lato', '#444');
  title.x = 300;
  title.y = 0;
  title.textBaseLine = "alphabetic";
  stage.addChild(title);
}

function requestTflServices() {
  axios
    .get(mainTflUrl + serviceTypesUrl)
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
    menuButton.alpha = 0.8;
    menuButton.pointer = 'cursor';
    serviceContainer.addChild(menuButton);
    var rectangle = new createjs.Shape();
    rectangle.graphics.beginFill('#2c3e50').drawRect(0,0, 280, 23);
    rectangle.x = 0;
    rectangle.y = 0;
    menuButton.addChild(rectangle);
    var text = new createjs.Text(dashlessMode, '18px Lato', '#ecf0f1');
    text.x = 30;
    text.y = 0;
    text.textBaseLine = "alphabetic";
    text.mouseEnabled = false;

    menuButton.addChild(text);
    menuButton.addEventListener("click", serviceClickHandler);
  });
}

function displayNearbyStations() {
  stationContainer.visible = true;
}
function serviceClickHandler(event) {
  serviceContainer.children.forEach(serviceItem => {
    serviceItem.alpha = 0.8;
  });
  event.target.parent.alpha = 1;

  displayNearbyStations();
}
