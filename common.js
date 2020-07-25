const DEBUG = true;
const DISPLAY_DEBUG_TIME = false;
const LIMIT_DELTA_TIME = 3; // In Seconds
const googleGreen = "#009688";
const googleAquaBlue = "#00BBD3";
const crunchyrollOrange = "#F78C25";
const defaultcolorOptions = [googleGreen, googleAquaBlue, crunchyrollOrange];

const Actions = {
  PLAY: 'play',
  PAUSE: 'pause',
  READY: 'ready',
  ENDED: 'ended',
  TIMEUPDATE: 'timeupdate',
}

const States = {
  PLAYING: 'playing',
  PAUSED: 'paused',
}

const BackgroundMessageTypes = {
  REMOTE_UPDATE: 'remote_update',
  CONNECTION: 'connection', 
  SKIP_MARKS: 'skip_marks'
}

const WebpageMessageTypes = {
  LOCAL_UPDATE: 'local_update',
  CONNECTION: 'connection',
}

function log() {
  const args = DISPLAY_DEBUG_TIME ? [(new Date()).toJSON()] : [];
  args.push(...arguments);
  return DEBUG && console.log(...args);
}

function getParameterByName(url, name = 'rollTogetherRoom') {
  const queryString = /\?[^#]+(?=#|$)|$/.exec(url)[0];
  const regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
  const results = regex.exec(queryString);

  if (!results || results.length < 2) {
    return null;
  }

  return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

function executeScript(tabId, obj) {
  return new Promise(
    callback => chrome.tabs.executeScript(tabId, obj, callback)
  );
}

function getExtensionColor() {
  return new Promise(callback => {
    chrome.storage.sync.get({ extensionColor: crunchyrollOrange }, function (data) {
      callback(data.extensionColor);
    });
  });
}

function getColorMenu() {
  return new Promise(callback => {
    chrome.storage.sync.get({ colorOptions: defaultcolorOptions }, function (data) {
      callback(data.colorOptions);
    });
  });
}