var fwVpn = window.fwVpn || {};

(function ($) {

    var authToken;
    var signinUrl = "signin.html";
    var apiAvailableServers = "/availableServers";

    fwVpn.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        }
        else {
            window.location.href = signinUrl;    
        }
    }).catch(function handleAuthToken(error) {
        alert(error);
        window.location.href = signinUrl;
    });

    function requestAvailableServers() {
        // Get available server from API.
        $.ajax({
            method: 'GET',
            url: _config.api.invokeUrl_webApp_users + apiAvailableServers,
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
            }),
            contentType: 'application/json',
            success: displayAvailableServers,
            error: function errorDisplayAvailableServers(jqXHR, textStatus, errorThrown) {
                console.error('Error requesting available servers: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('Error while trying to fetch the data from API to display available servers:\n' + jqXHR.responseText);
            }
        });
    }

    function displayAvailableServers() {
        console.log("displayAvailableServers");
    }

    $(function onDocReady() {
        $('#showAvailableServers').click(handleShowAvailableServersClick);
    });

    function handleShowAvailableServersClick(event) {
        //requestAvailableServers();
        console.log(authToken);
    }

}(jQuery));