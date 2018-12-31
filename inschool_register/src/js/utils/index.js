function ajaxCall({
    action,
    urlParams = null,
    postData = null,
    altPath = null,
    responseType = "json"
}) {
    if (typeof action == undefined) throw new Error('Missing param: "action" ');

    const baseUrl =
        process.env.NODE_ENV == "production"
            ? "http://app4-test.cymcass.edu.hk"
            : "http://localhost:8000";

    const fetchPath = altPath ? altPath : "/ajaxFetch.php";
    let urlParamString = "";

    if (urlParams != null)
        Object.keys(urlParams).forEach(key => {
            urlParamString += "&" + key + "=" + urlParams[key];
        });

    const url = baseUrl + fetchPath + "?action=" + action + urlParamString;

    let formData = new FormData();

    if (postData != null) {
        Object.keys(postData).forEach(key => {
            formData.append(key, postData[key]);
        });
    }

    const options =
        postData == null
            ? {
                  credentials: "same-origin"
              }
            : {
                  credentials: "same-origin",
                  method: "POST",
                  body: formData
              };

    return fetch(url, options).then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response[responseType]();
    });
}

export { ajaxCall };
