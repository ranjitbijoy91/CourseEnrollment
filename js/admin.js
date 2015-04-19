
var app = angular.module('admin', []);
    	//app.controller('',);


    	app.controller('AdminPanelController', function(){
        this.tab = 0;
        this.setTab=function(tab){
         this.tab = tab;
       };
       this.isSelected = function(tab){
         return this.tab === tab;
       };
     });
    	app.directive('changeSettings', function(){
        return{
         restrict: 'E',
         templateUrl: 'admin/change-settings.html',
         controller: ['$http', function($http){
          var ctrl = this;
          ctrl.stuff = [];          
          ctrl.numMaxClasses = 3;
          ctrl.numTerms = 5;
          ctrl.submit = function(){
            ctrl.alert = "Attempting to submit settings...";
            $http.post('http://cs6311.duckdns.org:5002/simulations', {"numTerms": ctrl.numTerms.toString(),"numMaxClasses": ctrl.numMaxClasses.toString()}).
            success(function() {
              ctrl.alert = "Settings have successfully changed.";
            }).
            error(function(headers) {
              ctrl.alert = headers.message;
            });
          };
        }],
        controllerAs: 'csCtrl'
      };
    });

      app.directive('studentPreferences', function(){
        return{
          restrict: 'E',
          templateUrl: 'admin/student-preferences.html',
          controller: ['$http', function($http){
            var ctrl = this;
            ctrl.reverse = false;
            ctrl.alert = "Retrieving student preference history...";
            ctrl.prefs = [];
            $http.get('http://cs6311.duckdns.org:5002/studentPreferences').success(function(data){
              ctrl.prefs = data;
              ctrl.uniqueStudents = [];
              for(var key in ctrl.prefs){
                if (ctrl.prefs.hasOwnProperty(key)) {
                  var pref = ctrl.prefs[key];
                  if(!ctrl.objContains(ctrl.uniqueStudents, {"id":pref.student.id})){
                    ctrl.uniqueStudents.push({"id":pref.student.id});  
                  }
                }
              }
              ctrl.alert = "Successfully retrieved student preference history.";
            }).
            error(function(headers) {
              ctrl.alert = "SERVER ERROR: Failed to retrieve student preference history.";
            });
            ctrl.objContains = function(a,b){
              for(var key in a){
                if (a.hasOwnProperty(key)) {
                  var current = a[key];
                  if(current.id == b.id){
                    return true;
                  }
                }
              }
            };

            
            ctrl.populateStudentPrefs = function(){
              ctrl.studentData = [];
              for(var key in ctrl.prefs){
                if (ctrl.prefs.hasOwnProperty(key)) {
                  var pref = ctrl.prefs[key];
                  if(pref.student.id == ctrl.selectedPref.id){
                    console.log(pref.student.id);
                    ctrl.studentData.push({"datetime": pref.timestamp, "prefs" : pref.student.enrollments});
                  }
                }
              }

            };


            ctrl.head = ["DateTime","Preferences"];
            ctrl.testData =
            [{datetime:'2015/03/07 08:23:37', preference:'(CS6310 CS6307)'},
            {datetime:'2015/03/04 09:23:22', preference:'(CS6310 CS6306)'},
            {datetime:'2015/03/03 10:01:02', preference:'(CS6310 CS6301)'},
            {datetime:'2015/03/02 08:24:52', preference:'(CS6310 CS6307)'}];

          }],
          controllerAs: 'spCtrl'
        };
      });

app.directive('recommendationHistory', function(){
  return{
    restrict: 'E',
    templateUrl: 'admin/recommendation-history.html',
    controller: ['$http', function($http){
      var ctrl = this;
      ctrl.rh = [];
      ctrl.unlockedAlert = false;
      ctrl.alert = "Retrieving recommendation history...";
      $http.get('http://cs6311.duckdns.org:5002/simulations').
      success(function(data) {
        ctrl.rh = data;
        ctrl.alert = "Successfully retrieved recommendation history.";
        ctrl.unlockedAlert = true;
      }).
      error(function(headers) {
        ctrl.alert = "SERVER ERROR: Failed to retrieve recommendation history.";
      });
      ctrl.students = [];
      $http.get('http://cs6311.duckdns.org:5002/students').
      success(function(data) {
        ctrl.students = data;
      }).
      error(function(headers) {
        ctrl.alert = "SERVER ERROR: Failed to retrieve recommendation history.";
      });

      ctrl.refresh = function(){
        ctrl.alert = "Retrieving recommendation history...";
        ctrl.unlockedAlert = false;
        $http.get('http://cs6311.duckdns.org:5002/simulations').
        success(function(data) {
          ctrl.rh = data;
          ctrl.alert = "Successfully retrieved recommendation history.";
          ctrl.unlockedAlert = true;
        }).
        error(function(headers) {
          ctrl.alert = "SERVER ERROR: Failed to retrieve recommendation history.";
        });

      };

      ctrl.date = [];
      ctrl.student = [];
      ctrl.filter = function(){
        if(ctrl.unlockedAlert && ctrl.selectedDate == undefined){
          ctrl.alert = "Please select a date."; 
        }else if(ctrl.unlockedAlert && ctrl.selectedStudent == undefined){
          ctrl.alert = "Please select a student."; 
        }else if (ctrl.unlockedAlert){
          for(var key in ctrl.rh){
            if (ctrl.rh.hasOwnProperty(key)) {
              var current = ctrl.rh[key];
              if(current.timestamp == ctrl.selectedDate.timestamp){
                for(var key in current.studentRecommendations){
                  if (current.studentRecommendations.hasOwnProperty(key)) {
                    var currentRec = current.studentRecommendations[key];
                    if(currentRec.student.id == ctrl.selectedStudent.id){
                      ctrl.termRecommendations = currentRec.termRecommendations;
                    }
                  }
                }
              }
            }
          }
        }
      };
    }],
    controllerAs: 'rhCtrl'
  };
});




