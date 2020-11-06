const request = require(`request`);
const fetchMyIP = function(callback) {
  request(`https://api.ipify.org/?format=json`,(err,response,body) =>{
   
    if (err) callback(`error occured`,body);
    else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const data = JSON.parse(body);
      callback(null,data[`ip`]);
    }
  });
};
//49.2834816,-123.130087
const fetchCoordsByIP = (ip,callback) => {
  request(`http://ip-api.com/json/${ip}`,(err,response,body) =>{
    if (err) {
      callback(err, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates  
      Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const x = JSON.parse(body);
    const array = [x.lat,x.lon];
    callback(null,array);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords[0]}&lon=${coords[1]}`,(err,response,body) =>{
    if (err) {
      callback(err, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching spacedata.
       Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null,JSON.parse(body).response);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

// const nextISSTimesForMyLocation = function(callback) {
//   fetchMyIP((error, ip)
//     .then(fetchCoordsByIP(ip, (error, loc))
//     .then(fetchISSFlyOverTimes(loc, (error, nextPasses))
//    };
module.exports = { fetchMyIP,fetchCoordsByIP,fetchISSFlyOverTimes,nextISSTimesForMyLocation };