

export const getDirections = (opts) => {
  var fromCoords = opts.fromCoords;
  var toCoords = opts.toCoords;
  var url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking&';
  url += 'origin=' + fromCoords.latitude + ',' + fromCoords.longitude;
  url += '&destination=' + toCoords.latitude + ',' + toCoords.longitude + '&key=AIzaSyDUWVHvYA-psNWSTrpwIFlLM84soy3PxzA';

  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => {
      return response.json();
    }).then((json) => {
      resolve(json);
    }).catch((err) => {
      reject(err);
    });
  });
};

export const getLocation = (placeId) => {

  let url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';
  url += placeId;
  url += '&key=' + 'AIzaSyDUWVHvYA-psNWSTrpwIFlLM84soy3PxzA';
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => {
      return response.json();
    }).then((json) => {
      resolve(json);
    }).catch((err) => {
      reject(err);
    });
  });
};

export const getFacebookPhoto = (userInfo) => {
 var api = `https://graph.facebook.com/v2.3/${userInfo.userID}/picture?width=${200}&redirect=false&access_token=${userInfo.accessToken}`;

 return new Promise((resolve, reject) => {
   fetch(api)
   .then((response) => response.json())
   .then((json) => {
     resolve(json);
   }).catch((err) => {
     reject(err);
   });
 });
};
