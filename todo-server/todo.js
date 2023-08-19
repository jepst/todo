"use strict";

/*

    Server-based to-do list.

    Items can be added or removed with the buttons.
    The current list of items is stored in the_list.
    The data is persisted on the flask server,
    accessed via an API.


*/

var the_list;

/*
    Generate DOM corresponding to current list
*/
function rerender() {
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
    Talk to the server
*/
function setState(state) {
    fetch("http://localhost:5000/api/set_list", {
        method: "POST", 
        cache: "no-cache", 
        headers: {
            "Content-Type": "application/json",
        },        
        body: JSON.stringify({
            the_list: the_list
        })
    });
}

function getState(deflt) {
    fetch("http://localhost:5000/api/get_list", {method: "GET", cache: "no-cache"}).
        then(result => result.json()).
        then(json => { the_list = json; rerender(); });
}
