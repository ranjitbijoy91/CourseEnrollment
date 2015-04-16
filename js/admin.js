
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
          console.log(ctrl.numTerms.toString());
          ctrl.submit = function(){
            console.log('yo1');
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
            ctrl.students = [];
            $http.get('http://cs6310.duckdns.org:5001/students').success(function(data){
              ctrl.students = data;
            });

            ctrl.studentData = [];
            ctrl.populateStudentPrefs = function(){
              console.log(ctrl.selectedStudent.id);
              $http.get('http://cs6310.duckdns.org:5001/students/'+ctrl.selectedStudent.id).success(function(data){
              ctrl.studentData = data;
              });
              //http get request for testData below
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

app.directive('prefsHistory', function(){
  return{
    restrict: 'E',
    templateUrl: 'admin/prefs-history.html',
    controller: ['$http', function($http){
      var ctrl = this;
      ctrl.testData = [];
      $http.get('/testjson/testPH.json').success(function(data){
        ctrl.testData = data;
      });
      ctrl.semesters = [];
      $http.get('/testjson/testS.json').success(function(data){
        ctrl.semesters = data;
      });
      ctrl.populateStats = function(){
        console.log(ctrl.selectedSemester);
        //change stats table here with http get request 
      };
    }],
    controllerAs: 'phCtrl'
  };
});

app.directive('recommendationHistory', function(){
  return{
    restrict: 'E',
    templateUrl: 'admin/recommendation-history.html',
    controller: ['$http', function($http){
      var ctrl = this;
      ctrl.recs = [];
      ctrl.dates = [];
      $http.get('/testjson/testRec.json').success(function(data){
        ctrl.recs = data;
      });
      $http.get('/testjson/testDates.json').success(function(data){
        ctrl.dates = data;
      });
      ctrl.populateRecs = function(){
        console.log(ctrl.selectedDate);
        //change rec info here with http get request 
      };
    }],
    controllerAs: 'rhCtrl'
  };
});




