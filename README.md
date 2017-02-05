# GraduateProject473
Metro ticket booking the basic aim of the web-application is to reduce the time people take to stand in the line and buy tickets for the
metro. Our application will help them book the ticket on-line prior to going to the station for the journey. Our customers will be able to
see the train schedules prior to book their ticket and also see the time slot allotted to the train to travel from different locations.
They  will also be able to check the fare of their travel. Also, they can book tickets for max 5 people (ppl). Thereafter the customer may
proceed to save their transaction and checkout to payment. The customer may also login at a later time and check his saved history.
Steps for installing and running the application:
•	Install CouchDB on the terminal :- 
sudo su -c “apt-get install couchdb”
•	After the installation start the service :-
sudo service couchdb start 
          you can also see on this link :-
            http://localhost:5984/_utils
•	Download and install node.js from https://nodejs.org/ 
•	Install express server by typing the following command on the terminal in your folder of project:-
“npm install express”.
•	Install body-parser by typing the following command on the terminal in your folder of project:-
“npm install body-parser”.
•	Install nano server by typing the following command on the terminal in your folder of project:-
“npm install nano”.
•	In Couchdb we need to create our database for information of trains therefore run a JavaScript file named createdb.js using the following command on the terminal in your folder of project:-
node createdb.js   
•	Run node server using the following commandon the terminal in your folder of project (for running server side javascript file):
“node app.js”.
•	Run the application using the following url on the browser (for running basic.html):
http://localhost:5000/basic.html
