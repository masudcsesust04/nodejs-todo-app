# Sample NodeJS TODO application using Express

1. Clone the source code 

2. Open terminal then check installed nodejs version by running 'node -v'. if you are running nodejs below 5 then you need to update the node js version. Follow this link to update the node version. http://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version

3. Then run 'npm -v' to check node package manager if already installed. If not then install npm.

4. Now navigate the unzipped project directory(ex- home/todos/). Then run 'npm install' this will install necessary node modules defined in packages.json file.

5. Run 'npm install mysql' this will install node mysql package.

6. create a database "todos"

7. Then create below table -
```
CREATE TABLE items (
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     description TEXT(1000),
     PRIMARY KEY (id)
);
```

8. Open app.js file find the below code block then change the database host, user, password and db name you have created earlier.

```
var con = mysql.createConnection({
  host: "localhost",
  user: "db_username",
  password: "db_password",
  database: "db_name"
});
```

9. Now run 'node app.js' to run the server defined in app.js file. this will run application in 4000 port defined in app.js.

10. Now visit "localhost:4000"
