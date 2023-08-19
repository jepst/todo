Minimal "To-Do app" web application
===========

Starting
-------
1. Install docker and docker-compose
2. Run `docker-compose up --build -d` from this directory
3. You *are* using Linux, right?

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

About docker-compose
-----------
`Docker-compose.yml` describes the services forming this application. There are four:

* mysql (actually mariadb): the database where we keep our data
* phpMyAdmin: a user interface to allow the app administrator to access the database directly
* api: the flask-based web API
* web: a simple JavaScript app that provides user interface and talks to the API

One could easily extend this architecture with other clients. For example, you might want to add an Android front-end that provides its own user interface and communicates through the same API.

Monitoring
----------
You can monitor the actions on the server through its logs. Run this command:

```
docker logs todo_api_container  -f
```

Type Ctrl-C to exit log listing.

Production
---------
This version of the app is okay for learning about app architecture, but it is *not* suitable for use in a real, live, public-facing production system. Here are some things that would need to be addressed before this could be made public:

* The site would have to be hosted somewhere. We could serve from an Amazon EC2 instance, for example.
* You'd probably want a domain name, like `the-todo-app.com`, which would point to your hosting service.
* The app is served over un-encrypted HTTP, it should use HTTPS. For that we'd need a proxy like nginx and appropriate certificates.
* The API server talks to the database using the `root` user, which is bad. We should change these passwords and use a non-root user.
* There's no user authentication. Users should be required to create an account and log in with a password. The database would need to keep track of user accounts in a `users` table.
* We're serving both the web client and the API server with minimal, non-threaded server. Flask even warns us about this. We should use a production-ready server.