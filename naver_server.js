Naver = {};

OAuth.registerService('naver', 2, null, function (query) {

    var requestAccess = getAccessToken(query);
    var identity = getIdentity(requestAccess);
    for (var idx in identity) {
        identity[idx]=identity[idx].length && identity[idx][0] || identity[idx];
    }
    return {
        serviceData: {
            id: identity.id,
            accessToken: requestAccess.access_token
        },
        options: {profile: identity}
    };
});

var getAccessToken = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: 'naver'});
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    var response;
    try {
        response = HTTP.post(
            "https://nid.naver.com/oauth2.0/token", {
                headers: {
                    Accept: 'application/json'
                },
                params: {
                    grant_type: 'authorization_code',
                    client_id: config.clientId,
                    client_secret: OAuth.openSecret(config.secret),
                    code: query.code,
                    state: query.state
                }
            });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Naver. " + err.message),
            {response: err.response});
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Naver. " + response.data.error);
    } else {
        return response.data;
    }
};

var getIdentity = function (requestAccess) {
    try {
        var authorization = requestAccess.token_type + " " + requestAccess.access_token;
        var response = HTTP.post(
            "https://apis.naver.com/nidlogin/nid/getUserProfile.xml", {
                headers: {
                    Authorization: authorization
                }
            });
        var content = xml2js.parseStringSync(response.content);
        return (content && content.data && content.data.response && content.data.response[0]) || {};
    } catch (err) {
        throw _.extend(new Error("Failed to fetch identity from Naver. " + response.content),
            {response: err.response});
    }
};

Naver.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};