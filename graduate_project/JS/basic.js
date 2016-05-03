//APPLICATION MODULE
var app = angular.module("Booking", []);
//APPLICATION CONTROLLER
app.controller("Booking_controller", ['$scope', '$http', function ($scope, $http) {

    //INITIALIZATION
    $('ul.tabs').tabs();

    $('.slider').slider({ full_width: true });

    $scope.modal_login = function () {
        //opening of modal
        $("#login").openModal();

    };
    $scope.modal_register = function () {
        //opening of modal
        $("#register").openModal();

    };

    //station information
    $scope.trains = [];
    $scope.stations = [];

    $http({
        method: 'GET',
        url: '/metro_station_info'
    }).then(function successCallback(response) {

        //console.log(response);
        $scope.stations = response.data;
        // $scope.train_name = response.data;
        setTimeout(function () { $('select.fromStation').material_select(); }, 1000);
        setTimeout(function () { $('select.toStation').material_select(); }, 1000);

    }, function errorCallback(response) {

    });

    $scope.$watch("fare", function () {
        $('select.ppl').material_select();
    });

    $scope.distance_to = 0;
    $scope.distance_from = 0;
    $scope.price = 0;
    $scope.final = 0;
    var flag = 0;

    $scope.fares = function () {
        $("#fares").openModal();

        angular.forEach($scope.trains.stations, function (station) {
            if (station.name === $scope.tostation) {
                $scope.distance_to = station.distance;
                flag = 1;
            }
            if (flag == 1) {
                if (station.name === $scope.fromstation) {
                    $scope.distance_from = station.distance;
                }
            }
            $scope.price = (($scope.distance_to - $scope.distance_from) * 3) / 5;
            $scope.final = $scope.noofppl * $scope.price;

        });


    };

    //date picker init
    $('#datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });



    $scope.sourceTimes = [];
    $scope.tainIndex = 0;
    $scope.selectedTime = "";
    $scope.setTrainTime = function (index) {

        $scope.tainIndex = $scope.sourceTimes.indexOf($scope.selectedTime);
    };

    //inserting to database
    $scope.adding_to_json = function () {
        // console.log("Trial", $scope.fromstation);
        $http({
            method: 'POST',
            url: '/user_info',
            data: { "firstname": $scope.firstname, "lastname": $scope.lastname, "username": $scope.username, "password": $scope.password, "age": $scope.age, "dob": $scope.dob, "emailid": $scope.emailid }
        }).then(function successCallback(response) {
            console.log(response.data);

        }, function errorCallback(response) {

        });
    };

    //validating login
    $scope.checkforinput = function () {
        //console.log("Trial", $scope.u1);
        $http({
            method: 'POST',
            url: '/user_info_login',
            data: { "user": $scope.u1, "pass": $scope.p1 }
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.data == "TRUE") {
                $("#login").closeModal();
                $scope.show_history($scope.u1);
            }
            else {
                alert("OPPS WRONG LOGIN USERNAME AND PASSWORD!!!!");
            }

        }, function errorCallback(response) {

        });
    };
    
    //instant change
    $scope.trial_history = function () {
        $scope.show_history($scope.u1);
    };
    
    //user's history
    $scope.history = [];
    $scope.show_history = function (user) {
        $http({
            method: 'POST',
            url: '/user_history',
            data: { "username": user }
        }).then(function successCallback(response) {
            $scope.history = response.data;
            console.log(response.data);
        }, function errorCallback(response) {

        });
    };
    
    //get train info
    $scope.check_trains = function () {
        // console.log("Trial", $scope.fromstation);
        $http({
            method: 'POST',
            url: '/train_info',
            data: { "source": $scope.fromstation, "destination": $scope.tostation }
        }).then(function successCallback(response) {
            console.log("trail", response.data);
            if (response.data == "ERROR") {
                alert("NO TRAINS");
            }
            else {
                $scope.trains = response.data;

                angular.forEach($scope.trains.stations, function (station) {
                    if (station.name === $scope.fromstation) {
                        $scope.sourceTimes = station.depature;
                        $scope.selectedTime = $scope.sourceTimes[0]; 
                        //console.log($scope.sourceTimes);
                        setTimeout(function () { $('select.sourceTimeSelect').material_select(); }, 1000);
                    }
                });


            }
        }, function errorCallback(response) {

        });
    };

    //save user's transaction into history
    $scope.save_to_myprofile = function () {
        console.log("Trial", $scope.u1);
        if ($scope.u1 === undefined) {
            alert("PLEASE LOGIN FIRST TO SEE THE FARES!!");
            $("#login").openModal();
        }
        else {

            $http({
                method: 'POST',
                url: '/user_transaction',
                data: { "username": $scope.u1, "fromstation": $scope.fromstation, "tostation": $scope.tostation, "on": $scope.date, "price": $scope.final }
            }).then(function successCallback(response) {
                console.log(response.data);

            }, function errorCallback(response) {

            });
        }
    };


}]);

  
 