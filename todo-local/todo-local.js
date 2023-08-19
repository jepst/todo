"use strict";

/*

    Local-only to-do list.

    Items can be added or removed with the buttons.
    The current list of items is stored in the_list.
    Items are persisted in a cookie named appState.

    Limitations:
        Because state is stored in a cookie, your
        list is not accessible on other devices
        and will be destroyed if you clear your cookies.
        Depending on your browser config, closing
        the window may also wipe out cookies.

        Also, cookies have a maximum size of 4096 bytes,
        meaning that larger to-do lists are impossible.

*/

var the_list = getState([]);

/*
    Generate DOM corresponding to current list
*/
function rerender() {
    setState(the_list);
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
        rerender();
    }
}


/*
    Cookie management
*/
function setState(state) {
    document.cookie = "appState="+btoa(JSON.stringify(state))+"; SameSite=None; Secure; expires=Fri, 31 Dec 9999 23:59:59 GMT";    
}

function getState(deflt) {
    var result = document.cookie.split("; ")
      .find(function(row){ return row.startsWith("appState=")})?.split("=")[1];
    if (result) {
        return JSON.parse(atob(result));
    }
    else {
        return deflt;
    }
}
