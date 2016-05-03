var nano = require("nano")("http://localhost:5984");
var express = require("express");
var bodyparser = require("body-parser");
var app = express();
app.use(express.static("."));
app.use(bodyparser.json());
var params = { include_docs: true, limit: 10, descending: true };
var first_train="LAEXPRESS";
var second_train="IRVINEEXPRESS";
var ftrain_data={
     "source": "Fullerton",
   "destination": "Los Angeles",
   "train_depature": [
       "8:00am",
       "12:00pm",
       "5:00pm",
       "7:00pm"
   ],
   "train_arrival": [
       "9:35am",
       "1:35pm",
       "6:35pm",
       "8:35pm"
   ],
   "stations": [
       {
           "seq": "1",
           "name": "Fullerton",
           "distance": "0",
           "arrival": [
               "8:00am",
               "12:00pm",
               "5:00pm",
               "7:00pm"
           ],
           "depature": [
               "8:00am",
               "12:00pm",
               "5:00pm",
               "7:00pm"
           ]
       },
       {
           "seq": "2",
           "name": "Buena Park",
           "distance": "10",
           "arrival": [
               "8:10am",
               "12:10pm",
               "5:10pm",
               "7:10pm"
           ],
           "depature": [
               "8:15am",
               "12:15pm",
               "5:15pm",
               "7:15pm"
           ]
       },
       {
           "seq": "3",
           "name": "Santa Fe",
           "distance": "25",
           "arrival": [
               "8:30am",
               "12:30pm",
               "5:30pm",
               "7:30pm"
           ],
           "depature": [
               "8:40am",
               "12:40pm",
               "5:40pm",
               "7:40pm"
           ]
       },
       {
           "seq": "4",
           "name": "Commerce",
           "distance": "40",
           "arrival": [
               "8:55am",
               "12:55pm",
               "5:55pm",
               "7:55pm"
           ],
           "depature": [
               "9:00am",
               "1:00pm",
               "6:00pm",
               "8:00pm"
           ]
       },
       {
           "seq": "5",
           "name": "Los Angeles",
           "distance": "60",
           "arrival": [
               "9:30am",
               "1:35pm",
               "6:35pm",
               "8:35pm"
           ],
           "depature": [
               "9:30am",
               "1:35pm",
               "6:35pm",
               "8:35pm"
           ]
       }
   ]
};
var strain_data={
   "source": "Fullerton",
   "destination": "Irvine",
   "train_depature": [
       "6:00am",
       "12:00pm",
       "6:00pm"
   ],
   "train_arrival": [
       "7:50am",
       "1:50pm",
       "7:50pm"
   ],
   "stations": [
       {
           "seq": "1",
           "name": "Fullerton",
           "distance": "0",
           "arrival": [
               "6:00am",
               "12:00pm",
               "6:00pm"
           ],
           "depature": [
               "6:00am",
               "12:00pm",
               "6:00pm"
           ]
       },
       {
           "seq": "2",
           "name": "Anaheim Canyon",
           "distance": "10",
           "arrival": [
               "6:10am",
               "12:10pm",
               "6:10pm"
           ],
           "depature": [
               "6:15am",
               "12:15pm",
               "6:15pm"
           ]
       },
       {
           "seq": "3",
           "name": "Orange",
           "distance": "25",
           "arrival": [
               "6:30am",
               "12:30pm",
               "6:30pm"
           ],
           "depature": [
               "6:40am",
               "12:40pm",
               "6:40pm"
           ]
       },
       {
           "seq": "4",
           "name": "Santa Ana",
           "distance": "40",
           "arrival": [
               "6:55am",
               "12:55pm",
               "6:55pm"
           ],
           "depature": [
               "7:00am",
               "1:00pm",
               "7:00pm"
           ]
       },
       {
           "seq": "5",
           "name": "Tustin",
           "distance": "60",
           "arrival": [
               "7:30am",
               "1:30pm",
               "7:30pm"
           ],
           "depature": [
               "7:40am",
               "1:40pm",
               "7:40pm"
           ]
       },
       {
           "seq": "6",
           "name": "Irvine",
           "distance": "70",
           "arrival": [
               "7:50am",
               "1:50pm",
               "7:50pm"
           ],
           "depature": [
               "7:50am",
               "1:50pm",
               "7:50pm"
           ]
       }
   ]
};
nano.db.destroy('metro_info', function() {
  // create a new database
  nano.db.create('metro_info', function() {
    // specify the database we are going to use
    var metro_info = nano.use("metro_info");
    // and insert a document in it
    metro_info.insert(ftrain_data, first_train, function(err, body, header) {
      if (err) {
        console.log('[alice.insert] ', err.message);
        return;
      }
      console.log('you have inserted.');
      console.log(body);
    });
    metro_info.insert(strain_data, second_train, function(err, body, header) {
      if (err) {
        console.log('[alice.insert] ', err.message);
        return;
      }
      console.log('you have inserted.');
      console.log(body);
    });
    metro_info.insert({     
     "views": {
       "view_Source": {
           "map": "function(doc) {\nfor(var i in doc.stations){\n  if(doc.stations[i].name && doc.destination){\n emit(doc.stations[i].name, doc);\n}\n}\n}"
       }
   }
}, "_design/des_Source", function (error, response) {
    if(!error){
        console.log("design document created",response);
    }else{
        console.log("design document error");
    }
});
  });
});



nano.db.destroy('user_info', function() {
  // create a new database
  nano.db.create('user_info', function() {
    // specify the database we are going to use
    var user_info = nano.use("user_info");
    // and insert a design in it
   user_info.insert({     
     "views": {
       "view_username": {
           "map": "function(doc) {\n\t\n  if(doc.username && doc.password){\n emit(doc.username, doc);\n\n}\n\n}"
       }
   }
}, "_design/des_username", function (error, response) {
    if(!error){
        console.log("design document created",response);
    }else{
        console.log("design document error");
    }
});
  });
});