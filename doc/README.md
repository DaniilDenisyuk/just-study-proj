# Application documentation
## About
This application emits an online book shop. Implements RESTful API.
#### Project structure
api: stores model that further will handle routes.\
config: configurations for the server, database, server etc.\
db: keeps database initialization files.\
doc: documentation and project description.\
lib: main modules such as server, database api, load balancer etc.\
static: files that emits client.\
test: testing modules for application.\
entry.js: Application`s entry point.\
#### Functionality
Currently, server supports following functionality(not fully):
- following the route /api/authors with GET request you can obtain list of authors;
- with GET request on /api/authors/:id you can get author info and available books\
 written by him by specifying authors id parameter;
- following the route /api/ or /api/books with GET request you can obtain list of books available;
- with GET request on /api/books/:id you will get book's info if book with this id exists;
- with GET request on /api/publishers server respond with list of publishers.
- with GET request on /api/publishers/:id server response will be publisher's info
- with POST request with proper body on /api/books/add you can create a new book, author and publisher.
- with request on /health it will respond with request body so you can check if server\
 responding normally.

