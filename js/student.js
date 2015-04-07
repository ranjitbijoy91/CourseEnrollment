
var app = angular.module('student', []);
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
          $http.get('/testjson/test.json').success(function(data){
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
            $http.get('/testjson/test.json').success(function(data){
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
          }],
          controllerAs: 'hdCtrl'
        };
      });




