export const FBLogin = () => {
  console.log('Attempting login FB!');
  FB.login(
    function (response) {
      if (response.authResponse) {
        console.log('Login success!');
        FB.api('/me', function (response) {
          console.log('Got user FB info!');
          me.fbMe = response;
          //          console.log(myFB);
          socket = io.connect();
          socketEvents();
        });
      } else {
        console.log('Redirecting to FB page!');
        window.location = 'https://www.facebook.com/twingjitsu';
      }
    },
    {
      scope: 'public_profile,email',
    }
  );
};

export function loginWithFacebook() {
  if (document.referrer) {
    // In the facebook iframe, redirect wont work.
    if (document.referrer.match(/apps.facebook.com/)) {
      console.log('FB App canvas detected!');
      FBLogin();
    } else {
      console.log('No FB App canvas detected, redirecting to FB login page!');
      FBLogin();
      // window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=527804323931798&redirect_uri=" + currentUrl + "&response_type=token");
    }
  } else {
    console.log('No FB App canvas detected, redirecting to FB login page!');
    FBLogin();
    // window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=527804323931798&redirect_uri=" + currentUrl + "&response_type=token");
  }
}
