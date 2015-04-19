
var app = angular.module('student', ['ui.bootstrap', 'ngCookies']);
    	//app.controller('',);


    	app.controller('StudentPanelController', function(){
        this.tab = 0;
        this.setTab=function(tab){
         this.tab = tab;
       };
       this.isSelected = function(tab){
         return this.tab === tab;
       };
     });
    	app.directive('classPreferences', function(){
        return{
         restrict: 'E',
         templateUrl: 'student/class-preferences.html',
         controller: ['$http', '$cookieStore', function($http, $cookieStore){
          var ctrl = this;
          ctrl.studentId = $cookieStore.get('id');
          ctrl.classes = [];
          $http.get('http://cs6311.duckdns.org:5002/courses/student/'+ctrl.studentId).success(function(data){
            ctrl.classes = data;
          });

          ctrl.jsonPacket = function(){
            var rank = 3;
            var moreThanOne = false;
            var jsonString = '{"student":{"id":'+ctrl.studentId+'},"classPreferences": [';
            if(ctrl.selectedPreference1!=undefined){
              jsonString += '{"course": {"id": "'+ ctrl.selectedPreference1.id+'"},"ranking": "'+rank+'"}';
              moreThanOne = true;
              rank--;
            }
            if(ctrl.selectedPreference2!=undefined){
              if(moreThanOne){
                jsonString+=",";
              }
              jsonString += '{"course": {"id": "'+ ctrl.selectedPreference2.id+'"},"ranking": "'+rank+'"}';
              moreThanOne = true;
              rank--;
            }
            if(ctrl.selectedPreference3!=undefined){
              if(moreThanOne){
                jsonString+=",";
              }
              jsonString += '{"course": {"id": "'+ ctrl.selectedPreference3.id+'"},"ranking": "'+rank+'"}';
            }
            return jsonString + "]}";
          };

          ctrl.submit = function(){
            ctrl.alert = "Attempting to submit class preferences...";
            if(ctrl.undefinedCheck() && ctrl.uniquePreferences()){
              $http.post('http://cs6311.duckdns.org:5002/studentPreferences', ctrl.jsonPacket()).
              success(function() {
                ctrl.alert = "Settings have successfully changed.";
              }).
              error(function(headers) {
                ctrl.alert = headers.message;
              });
            }else{
              console.log('invalid');
            }

          };
          ctrl.uniquePreferences = function(){
            if((ctrl.uniquePreferencesCheck(ctrl.selectedPreference1,ctrl.selectedPreference2))&&(ctrl.uniquePreferencesCheck(ctrl.selectedPreference1,ctrl.selectedPreference3))&&(ctrl.uniquePreferencesCheck(ctrl.selectedPreference2,ctrl.selectedPreference3))){
              return true;
            }
            ctrl.alert = "ERROR: Each class can only be selected once.";
            return false;
          };
          ctrl.uniquePreferencesCheck = function(a,b){
            if (a == undefined && b == undefined){
              return true;
            }else if (a == b){
              return false;
            }else{
              return true;
            }
          };
          ctrl.undefinedCheck = function(){
            var count = 0;
            if(ctrl.selectedPreference1==undefined){
              count++;
            }
            if(ctrl.selectedPreference2==undefined){
              count++;
            }
            if(ctrl.selectedPreference3==undefined){
              count++;
            }
            if(count == 3){
              ctrl.alert = "ERROR: You must select at least 1 class preference.";
            }
            return (count<3);
          };

        }],
        controllerAs: 'cpCtrl'
      };
    });

app.directive('recommendedCourses', function(){
  return{
    restrict: 'E',
    templateUrl: 'student/recommended-courses.html',
    controller: ['$http', '$cookieStore', function($http, $cookieStore){
      var ctrl = this;
      ctrl.studentId = $cookieStore.get('id');
      ctrl.classes = [];
      $http.get('http://cs6311.duckdns.org:5002/simulations/student/'+ctrl.studentId).success(function(data){
        ctrl.classes = data;
      });
    }],
    controllerAs: 'rcCtrl'
  };
});

app.directive('historicalData', function(){
  return{
    restrict: 'E',
    templateUrl: 'student/historical-data.html',
    controller: ['$http', '$cookieStore', function($http, $cookieStore){
      var tabClasses;
      var ctrl = this;
      ctrl.studentId = $cookieStore.get('id');
      ctrl.recommendations = [];
      $http.get('http://cs6311.duckdns.org:5002/studentRecommendation/'+ctrl.studentId).success(function(data){
        ctrl.recommendations = data;
      });

      ctrl.isCollapsed = true;
      function initTabs() {
        tabClasses = ["",""];
      }

      ctrl.getTabClass = function (tabNum) {
        return tabClasses[tabNum];
      };

      ctrl.getTabPaneClass = function (tabNum) {
        return "tab-pane " + tabClasses[tabNum];
      }

      ctrl.setActiveTab = function (tabNum) {
        initTabs();
        tabClasses[tabNum] = "active";
      };
      initTabs();
      ctrl.setActiveTab(1);

      ctrl.ddl = [];
      $http.get('/testjson/testCourses.json').success(function(data){
        ctrl.ddl = data;
      });

            // ctrl.populateCourseDemand = function(){
            //   console.log(ctrl.selectedCourse.course);
            //   //http get request
            // };
            ctrl.menu = [];
            $http.get('/testjson/testH.json').success(function(data){
              ctrl.menu = data;
            });
          }],
          controllerAs: 'hdCtrl'
        };
      });




