# CSM-Web-Application

## React Client Application Routes

- Route /: contains the main navbar component, "NavbarWithLogin," which has several children depending on what is displayed on the screen. The default child is the "Office" component containing the list of public and private pages.
- Route /newpage: contains the "NewPage" component with the form for adding a new page to the system. Since this is a protected route, there is a ternary operator to check the user's login status; if not logged in, it redirects to "/login".
- Route /mypages: contains the "Mypages" component displaying the list of pages inserted into the system by the logged-in user. Since this is a protected route, there is a ternary operator to check the user's login status; if not logged in, it redirects to "/login".
- Route /edit/:pageId: contains the "EditPage" component with the form for editing a page within the system. Since this is a protected route, there is a ternary operator to check the user's login status; if not logged in, it redirects to "/login".
- Route page/:pageId: contains the "ShowPage" component, handling the front-end display of the page. Unlike the other routes, this one is public since any user can view a page.
- Route /login: unlike the previous routes, this one is not a direct child of / as it only contains the "Login" component, which does not display the navbar.
- Route /*: handles all URLs that do not match the previous routes.

# API Server

- GET /api/isLogged
   - no parameters
   - if the system verifies that the user is logged in, it receives their data in response.
- GET /api/images
   - no parameters
   - in response, it receives the images uploaded to the server.
- GET /api/loadpage/:pageId
   - pageId
   - in response, it sends the data of the specified page for editing, if logged in.
- GET /api/getmypages
   - no parameters
   - if the system verifies that the user is logged in, it receives the pages they have inserted in response.
- GET /api/showpage/:pageId
   - pageId
   - in response, it sends the data of the specified page for display, if logged in.
- GET /api/getpublicpages
   - no parameters
   - in response, it sends all pages published relative to the current date.
- GET /api/getallpages
   - no parameters
   - in response, it sends all pages inserted into the system.
- GET /api/getauthors
   - no parameters
   - in response, it sends all names of authors in the system.
- GET /api/getcms
   - no parameters
   - in response, it sends the name of the site.
- POST /api/addpage
   - parameters: title, publication date, author, and blocks to insert on the page.
   - in response, it receives the id of the inserted page.
- POST /api/login
   - parameters: username and password.
   - in response, it receives the data of the authenticated user.
- PUT /api/edit/:pageId
   - parameters: pageId, title, publication date, author, and blocks of the page.
   - modifies the page with the new data.
- PUT /api/editcms
   - parameters: new site name.
   - modifies the page with the new name.

## Database Tables

Table users: containing unique id, unique email, unique name, password hash, salt, and account type.
Table pages: containing unique page id, owner user id, insertion date, publication date, title, and author name.
Table blocks: containing page id and block order as the primary key, type, and content of the block.
Table images: containing the names of the files saved in the static folder.
Table general: containing general data regarding the site.


## Main React Components

Content: manages the representation and handling of blocks. It receives the block type, content, and a function to change the type as input.
Edit: manages page editing, receives the user from the context or a parameter from the URL indicating the page.
Login: manages login to the system.
MyPages: manages the list of pages of a specific user.
NavBar: manages the navbar, the main component of the site.
NewPage: manages the page addition form, receiving the user from the context.
Office: manages the front-office and back-office, their graphical representation. Receives the login state and the user from the context.
ShowPage: handles the display of the page, receiving the page id as a parameter to load.


## Users Credentials
    username         , password
- john.doe@email.com, test
- user2@polito.it, test
- amministratore@polito.it
- user3@polito.it, test


## LICENSE

This project is under the MIT LICENSE

