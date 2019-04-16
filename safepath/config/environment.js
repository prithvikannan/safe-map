var environments = {
	staging: {
		// FIREBASE_API_KEY: 'AIzaSyALypkEEcmBgQFclXeuOdWqBPkULaxn0XA',
		// FIREBASE_AUTH_DOMAIN: 'vision-api-demo-f281f.firebaseapp.com',
		// FIREBASE_DATABASE_URL: 'https://vision-api-demo-f281f.firebaseio.com',
		// FIREBASE_PROJECT_ID: 'vision-api-demo-f281f',
		// FIREBSE_STORAGE_BUCKET: 'vision-api-demo-f281f.appspot.com',
		// FIREBASE_MESSAGING_SENDER_ID: '886041712634',
		// GOOGLE_CLOUD_VISION_API_KEY: 'AIzaSyC4De2aQaO90IS5-hRHSlye-27ZrKMlo7c'
	FIREBASE_API_KEY: 'AIzaSyBZlDGT1h2y9EMU-UpYyzS-QmVkqkciA20',
    FIREBASE_AUTH_DOMAIN: 'dont-come-out-the-house.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://dont-come-out-the-house.firebaseio.com/',
    FIREBASE_PROJECT_ID: 'dont-come-out-the-house',
    FIREBASE_STORAGE_BUCKET: 'dont-come-out-the-house.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '769196411379',
    GOOGLE_CLOUD_VISION_API_KEY: 'AIzaSyCY3NyYe92Qal20oGv_kr9bFWP7NukelZQ'
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