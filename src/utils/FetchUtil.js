 const handleGet = (methodUrl, userToken, params) => {
    var host = process.env.REACT_APP_API_URL || 'http://34.68.202.207:8080';
    var url = new URL(host+methodUrl);
    if (params) {
        url.search = new URLSearchParams(params).toString();
    }
    var result =  fetch( url, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
            "Accept": "application/json",
            "Authorization" : userToken
        }
    });
   
    return result;
}

const handlePost = (methodUrl, userToken, payload) => {
    var host = process.env.REACT_APP_API_URL || 'http://34.68.202.207:8080';
    var url = host+methodUrl;
    var result = fetch( url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept": "application/json",
            "Authorization" : userToken
        },
        body: payload
    });

    return result;
}

export default {handleGet, handlePost}