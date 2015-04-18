
var app = angular.module('student', ['ui.bootstrap', 'ngCookies']);
    	//app.controller('',);


    	app.controller('StudentPanelController', function($cookieStore){
        this.tab = 0;
        this.setTab=function(tab){
         this.tab = tab;
       };
       this.isSelected = function(tab){
         return this.tab === tab;
       };
       this.clearCookie = function(){
        $cookieStore.put("id", "");
       };
     });
    	app.directive('classPreferences', function(){
        return{
         restrict: 'E',
         templateUrl: 'student/class-preferences.html',
         controller: ['$http', '$cookieStore', '$window','$timeout', function($http, $cookieStore, $window,$timeout){
          var ctrl = this;
          ctrl.studentId = '0';
          $timeout(function(){ctrl.studentId = $cookieStore.get('id');}, 1000);
          if(ctrl.studentId == ""){
            $window.location.href = '/index.html';
          }else if(ctrl.studentId == "admin"){
            $window.location.href = '/admin.html';
          }
          ctrl.classes = [];
          $http.get('http://cs6311.duckdns.org:5002/courses/student/'+ctrl.studentId).success(function(data){
            ctrl.classes = data;
          });
          ctrl.submit = function(){
            ctrl.alert = "";
            if(ctrl.undefinedCheck() || ctrl.uniquePreferences()){
              console.log('valid');
            }else{
              console.log('invalid');
            }

          };
          ctrl.uniquePreferences = function(){
            if((ctrl.selectedPreference1!=ctrl.selectedPreference2)&&(ctrl.selectedPreference1!=ctrl.selectedPreference3)&&(ctrl.selectedPreference2!=ctrl.selectedPreference3)){
              return true;
            }
            ctrl.alert = "ERROR: Each class can only be selected once.";
            return false;
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
            return (count>=2);
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
            console.log(ctrl.classes);
          });
    }],
    controllerAs: 'rcCtrl'
  };
});

      app.directive('historicalData', function(){
        return{
          restrict: 'E',
          templateUrl: 'student/historical-data.html',
          controller: ['$http', function($http){
            var tabClasses;
            var ctrl = this;
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

            ctrl.populateCourseDemand = function(){
              console.log(ctrl.selectedCourse.course);
              //http get request
            };

            ctrl.groups = [
            {
              title: "Dynamic Group Header - 1",
              items: [{"item-title": "item 1"}, {"item-title": "item 2"}]
            },
            {
              title: "Dynamic Group Header - 2",
              items: [{"item-title": "item 3"}, {"item-title": "item 4"}]
            }
            ];


            ctrl.menu = [];
            $http.get('/testjson/testH.json').success(function(data){
              ctrl.menu = data;
              console.log(ctrl.menu);
            });
          }],
          controllerAs: 'hdCtrl'
        };
      });




