Minimal "To-Do app" web application
===========

Starting
-------
1. Install docker and docker-compose
2. Run `docker-compose up --build -d` from this directory
3. Open `http://localhost:5003` in your web browser

Stopping
--------
1. Run `docker-compose down`

Using
-----
The main web client user interface is running on [port 5003](http://localhost:5003).

You can access the database through phpMyAdmin on [port 5001](http://localhost:5001/). Log in with username `root`, password `root`. Click on `sampledb` to see the current state of the database.

The API server is running on port 5000. You can access the API directly using `curl` or similar commands. For example:

```
curl -X POST http://localhost:5000/api/set_list -H 'Content-Type: application/json' -H 'username: johnjacobjingleheimer' -d '{"the_list":["Buy a banana", "Buy an avocado"]}'
```

About React
-----------
The web client is in written using React, a front-end framework. React uses a variant of JavaScript called JSX, which allows merging traditional JavaScript syntax with HTML-like syntax.

Monitoring
----------
You can monitor the actions on the server through its logs. Run this command:

```
docker logs todo_api_container  -f
```

Type Ctrl-C to exit log listing.

Limitations
---------
Same as previous iteration.