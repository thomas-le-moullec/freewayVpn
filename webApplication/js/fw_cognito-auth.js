var fwVpn = window.fwVpn || {};

(function ($) {
    var userPool;

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    if (!(_config.cognito.userPoolId &&
          _config.cognito.userPoolClientId &&
          _config.cognito.region)) {
        alert("Please return to original config.js file.");
        return;
    }

    // GET User Pool based on Pool Data defined in Config.js
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    fwVpn.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };


    // Create Promise to get Auth Token through Cognito User Pool ; User Pool will be group by company in the Future.
    fwVpn.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: emailToUsername(email),
            Pool: userPool
        });
    }

    function emailToUsername(email) {
        return email.replace('@', '-at-');
    }

    $(function onDocReady() {
        // $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        // $('#verifyForm').submit(handleVerify);
    });


    // Register Section

    //Prepare Success and Failure Functions
    function handleRegister(event) {
        var email = $('#emailInputRegister').val();
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    // Register function
    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(emailToUsername(email), password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    // Verify Section to Do
    // Sign in Section to Do
}(jQuery));