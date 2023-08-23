/*
    Update current user's list on the server
*/
export function setState(username, state) {
    if (state !== null)
        fetch("http://localhost:5000/api/set_list", {
            method: "POST", 
            cache: "no-cache", 
            headers: {
                "Content-Type": "application/json",
                "username": username,
            },        
            body: JSON.stringify({
                the_list: state
            })
        });
}



/*
    Request current user's list from the server
*/
export function getState(username, callback) {
    fetch("http://localhost:5000/api/get_list", {
            method: "GET", 
            cache: "no-cache",
            headers: {
                "username": username,
            },        
        }).then(result => result.ok ? result.json() : null).then(json => { callback(json); });
}
