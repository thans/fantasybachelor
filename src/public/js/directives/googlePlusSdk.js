app.directive('googlePlusSdk', function() {
    return {
        template : '\
        <meta name="google-signin-clientid" content="880460427562-dcpc30c3n8n94semsr77m0o35j9k3v6i.apps.googleusercontent.com" />\
        <meta name="google-signin-scope" content="profile" />\
        <meta name="google-signin-requestvisibleactions" content="http://schema.org/AddAction" />\
        <meta name="google-signin-cookiepolicy" content="single_host_origin" />\
        <script src="https://apis.google.com/js/client:platform.js?onload=googlePlusSdkLoad"></script>'
    }
});