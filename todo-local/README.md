Minimal "To-Do app" web application
===========

Starting
-------
1. Open `todo.html` in your web browser.

Stopping
--------
1. Close the tab.


Limitations
-----------
Because state is stored in a cookie, your list is not accessible on other devices or browsers; and will be destroyed if you clear your cookies. Depending on your browser configuration, closing the window may also wipe out cookies.

Also, cookies have a maximum size of 4096 bytes, meaning that larger to-do lists are impossible.

The size and persistance issues could be ameliorated by using an alternative form of local (in-browser) storage, such as IndexedDB. However, the data would still be inaccessible on other devices.