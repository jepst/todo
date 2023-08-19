"use strict";

/*

    Server-based to-do list.

    Items can be added or removed with the buttons.
    The current list of items is stored in the_list.
    The data is persisted on the flask server,
    accessed via an API.

    The flask server in turn talk to a mysql database.
    
*/

var the_list;

/*
    Generate DOM corresponding to current list
*/
function rerender() {

    var title = document.getElementById('title');
    title.innerHTML='To-Do List for ' + getUserName();


    var list_div = document.getElementById("thelist");

    // clear all displayed list items
    while(list_div.firstChild) 
        list_div.removeChild(list_div.lastChild);

    for (var item_text of the_list) {
        var newitem = document.createElement('div');

        newitem.className = 'listitem';

        // add item text
        var text = document.createElement('div');
        text.className='text';
        text.appendChild(document.createTextNode(item_text));
        newitem.appendChild(text);

        // add the delete button
        var deletebutton = document.createElement('div');
        deletebutton.className='button right';
        deletebutton.appendChild(document.createTextNode("Delete"));
        deletebutton.text = item_text;
        deletebutton.addEventListener('click', function() {
            var pos = the_list.indexOf(this.text);
            if (pos>=0)
                the_list.splice(pos,1);
            setState(the_list);
            rerender();
        });
        newitem.appendChild(deletebutton);

        list_div.appendChild(newitem);
    }
}

/*
    Handle adding a new item.
*/
function onAdd() {
    var newitem = prompt("Please enter the new item.","");
    if (newitem != null) {
        the_list.push(newitem);
        setState(the_list);
        rerender();
    }
}


/*
    Update current user's list on the server
*/
function setState(state) {
    fetch("http://localhost:5000/api/set_list", {
        method: "POST", 
        cache: "no-cache", 
        headers: {
            "Content-Type": "application/json",
            "username": getUserName(),
        },        
        body: JSON.stringify({
            the_list: the_list
        })
    });
}



/*
    Request current user's list from the server
*/
function getState(deflt) {
    login();
    fetch("http://localhost:5000/api/get_list", {
            method: "GET", 
            cache: "no-cache",
            headers: {
                "username": getUserName(),
            },        
        }).
        then(result => result.json()).
        then(json => { the_list = json; rerender(); });
}


/*
    Ask user for their name
*/
function login() {
    if (getUserName(null)==null) {
        var name;
        while (true) {
            name = prompt("Please enter your username", "");
            if (name.length<3) {
                alert("Username must be at least 3 characters");
                continue;
            }
            break;
        }
        setUserName(name);
    }
}

/*
    Delete stored login info
*/
function logout() {
    document.cookie = "username=; SameSite=None; Secure; expires=Thu, 01 Jan 1970 00:00:01 GMT";   
    location.reload();
}

/*
    Store new username into a cookie
*/
function setUserName(username) {
    document.cookie = "username="+btoa(JSON.stringify(username))+"; SameSite=None; Secure; expires=Fri, 31 Dec 9999 23:59:59 GMT";    
}

/*
    Return current logged-in user if any
*/
function getUserName(deflt) {
    var result = document.cookie.split("; ")
      .find(function(row){ return row.startsWith("username=")})?.split("=")[1];
    if (result) {
        return JSON.parse(atob(result));
    }
    else {
        return deflt;
    }
}
