const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const {lat,lon} = JSON.parse(body);

  const url = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`;
  return request(url);
};

const nextISSTimesForMyLocation = () =>{
  return fetchMyIP()
    .then(body => fetchCoordsByIP(body))
    .then(body => fetchISSFlyOverTimes(body))
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};
module.exports = {nextISSTimesForMyLocation};