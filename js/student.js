
var app = angular.module('student', ['ui.bootstrap']);
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
         controller: ['$http', function($http){
          var ctrl = this;
          ctrl.stuff = [];
          $http.get('http://cs6311.duckdns.org:5002/courses/student/53042193').success(function(data){
            ctrl.stuff = data;
          });
        }],
        controllerAs: 'cpCtrl'
      };
    });

      app.directive('recommendedCourses', function(){
        return{
          restrict: 'E',
          templateUrl: 'student/recommended-courses.html',
          controller: ['$http', function($http){
            var ctrl = this;
            ctrl.stuff = [];

            $http.get('http://cs6310.duckdns.org:5001/courses').success(function(data){
              ctrl.stuff = data;
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




