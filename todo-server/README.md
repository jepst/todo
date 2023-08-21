Minimal "To-Do app" web application
===========

Starting
-------
1. Install python3 and pip3
2. Run `pip3 install -r requirements.txt`
3. Run `./server.sh` from this directory
4. Open `todo.html` in your web browser.

Stopping
--------
1. Type Ctrl-C in flask.


Limitations
-----------
This solution only allows a single list. That is, there is no capacity to support multiple users.

Because data is stored in a simple global variable in the server, this solution will not scale: making the server multi-threaded will result in a data race; making the server multi-process will result in multiple inconsistent copies of data. To handle web traffic in a scalable way, we need a database to store data.
