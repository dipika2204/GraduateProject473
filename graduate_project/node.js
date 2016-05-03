var nano = require("nano")("http://localhost:5984");
var express = require("express");
var bodyparser = require("body-parser");
var app = express();
app.use(express.static("."));
app.use(bodyparser.json());

//ALL THE DATABASES:
var user_info = nano.use("user_info");
var user_transaction = nano.use("user_transaction");
var metro_info = nano.use("metro_info");
var params = { include_docs: true, limit: 10, descending: true };

//CHECK THE USER'S LOGIN INFO
var flag=0;
app.post("/user_info_login", function (req, res) {
var check_username=req.body.user;
//console.log(req.body);
var check_password=req.body.pass;
user_info.view('des_username', 'view_username', { keys: [check_username] }, function (err, body) {
       var details=body.rows;
       details.forEach(function(index){
         if(check_username==index.value.username)
          {
              flag=1;
          }
          if(flag==1){
              if(check_password==index.value.password) {
                  console.log("TRUE");
                  res.send("TRUE");
              }
       }
       else{
            console.log("FALSE");
           res.send("FALSE");
       }
       });
       
    });    

});

//TO INSERT USER'S HISTORY
app.post("/user_transaction", function (req, res) {  
  user_transaction.insert( req.body, null ,function (err, body) {
 });
});

//TO GET USER'S HISTORY
app.post("/user_history", function (req, res) {
    var history_details = [];
    var user_hi=req.body.username;
 user_transaction.list(params, function (error, body, headers) {
      var history=body.rows;
           history.forEach(function(index){
            if(user_hi==index.doc.username){
            history_details.push(index.doc);              
           }
           });
 res.send(history_details);
 });
});

//TRAIN INFO
app.post("/train_info", function (req, res) {
    var source = req.body.source;
    var destination = req.body.destination;
    var name_station = [];
    var seq_source, seq_destination;
    var flag = 0;
    metro_info.view('des_Source', 'view_Source', { keys: [source] }, function (err, body) {
        //console.log(body.rows);
        if(!err){
        body.rows.forEach(function (index) {
            name_station = [];

            name_station.push(index.value.stations);
            name_station.forEach(function (element) {
                flag=0;
                element.forEach(function (i) {
                    
                    if (source == i.name) {
                        flag = 1;
                        
                    }
                    if (flag == 1) {
                        if (destination == i.name) {
                           console.log(index.value);
                           res.send(index.value);
                        }                  
                    }
                        
                });

            });

        });
    }
    else
    {
        res.send("ERROR");
    }
    });
});

//INSERT NEW USER
app.post("/user_info", function (req, res) {
    console.log(req.body);
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var username=req.body.username;
    var password=req.body.password;
    var age=req.body.age;
    var dob=req.body.dob;
    var emailid=req.body.emailid;
    
    
    var data = { "firstname":firstname,"lastname":lastname,"username":username,"password":password,"age":age,"dob":dob,"emailid":emailid };
    user_info.insert( data,username, function (err, body) {
   });
});

//Station Name
app.get("/metro_station_info", function (req, res) {
    var metro_station_details = [];
    metro_info.list(params, function (error, body, headers) {
        var trial = body.rows;
        //console.log(trial);
        trial.forEach(function (element) {
            //res.send(element.doc);
            //station_details.push(element.doc);
            //console.log(element);
            if (element.doc.stations) {
                element.doc.stations.forEach(function (station) {
                    metro_station_details.push(station.name);
                }, this);
            }
        }, this);
        var unique = metro_station_details.filter(onlyUnique);
        res.send(unique);
    });

});

//TO GET UNIQUE VALUES FROM ARRAY
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


app.listen(5000, function () {
    console.log("Example app listening on port HELLO 5000!");
});
