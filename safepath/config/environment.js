var environments = {
	staging: {
	FIREBASE_API_KEY: 'AIzaSyBZlDGT1h2y9EMU-UpYyzS-QmVkqkciA20',
    FIREBASE_AUTH_DOMAIN: 'dont-come-out-the-house.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://dont-come-out-the-house.firebaseio.com/',
    FIREBASE_PROJECT_ID: 'dont-come-out-the-house',
    FIREBASE_STORAGE_BUCKET: 'dont-come-out-the-house.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '----',
    GOOGLE_CLOUD_VISION_API_KEY: '----'
	},
	production: {

	}
};

function getReleaseChannel() {  
  let releaseChannel = Expo.Constants.manifest.releaseChannel;
  if (releaseChannel === undefined) {
    return 'staging';
  } else if (releaseChannel === 'staging') {
    return 'staging';
  } else {
    return 'staging';
  }
}
function getEnvironment(env) {  
  console.log('Release Channel: ', getReleaseChannel());
  return environments[env];
}
var Environment = getEnvironment(getReleaseChannel());  
export default Environment;  
