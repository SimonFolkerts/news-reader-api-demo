### Using the API
#### Simple first test
After running the server, for a quick test in the browser you can go to the following endpoints:

#### Get an article
[GET /articles](http://localhost:3000/articles)

#### Get an article by ID
[GET /articles/:articleId](http://localhost:3000/articles/abc123)

#### Testing the API using a collaorative platform
To test POST, PUT and DELETE requests, we're going to use [Postman](https://www.getpostman.com/).

### Project functionality
#### 1. Set up routes
To create our API, we need to set up routes that can handle incoming requests. If we want an API that can help us implement CRUD functionality for our application, we'll need to set up
routes to handle GET, POST, PUT, and DELETE HTTP request methods.

#### 2. Set up database
For convenience, we're going to use a cloud-based database provider, MongoDB Atlas, for our database. You could choose to install MongoDB onto your own machine, but this is not covered here.

##### Environment variables
In this directory create an ```.env``` file, add your Atlas (or other) connection URL:

````
MONGODB_URI=<YOUR_CONNECTION_URL>
````
##### MongoDB Atlas setup
1. Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (you can just keep the defaults and continue without upgrading)
3. Create a database user
- Go to Security > Database Access, then "Add New User". 
- Enter a Username and password (that you don't use for anything else - you could just autogenerate it) and make a note of these so you don't forget them. 
IMPORTANT: *DON'T* put the password directly into your code. Use a .env file and make sure you have a [.gitignore](https://help.github.com/en/github/using-git/ignoring-files) file in the root of your project that contains a line ```.env```
- Choose "Read and write to any database", then click "Add User".
4. Whitelist your IP address
- In the main menu, go to "Network Access". Choose "Allow access from anywhere" and click "Confirm".
5. Load sample data
- Skip this step.
6. Connect to your cluster
- Go to Atlas > Clusters and click "Connect". Choose "Connect your application" and copy the connection string. 
- Paste it into your .env file as the value for ```MONGODB_URI``` (remember to make sure you've got ```.env``` listed in your ```.gitignore``` file!).
- Change the ```<password>``` in the connection string to the password that you specified when creating the database user.
7. Now run ```npm run dev``` on the directory and you should see ```✔ MongoDB connected```. Your application now has a database!