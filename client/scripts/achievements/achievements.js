angular.module('fm.achievements',[])

.controller('AchievementsCtrl', function ($scope, $http, User) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.getUserInfo = function(){
      User.getInfo()
        .then(function(user){
          $scope.userInfo = user;
          $scope.totalSteps = user.lifetimeSteps;
          $scope.totalFlights = user.lifetimeSteps;
          if(!$scope.totalFlights){
            $scope.totalFlights = 0;
          }

          $scope.getPercent = function(goal, progress){  //used to set width of progress in bar
            if((progress/goal) < 1){
              return progress/goal * 100;
            } else{
              return 100;
            }
          };

          $scope.achievements = [{
            name: 'First Steps',
            description:'Walk across the Golden Gate Bridge!',
            goal: 3400,
            unit:'steps',
            width: $scope.getPercent(3400, $scope.totalSteps),
            current: $scope.totalSteps, 
            image: "background-image: url(../images/GoldenGateBridge.jpg); background-size: cover;"
          },
          {
            name: 'Bay to Breakers',
            description:'Get from AT&T Park to Lands End!',
            goal: 15000,
            unit:'steps',
            width: $scope.getPercent(15000, $scope.totalSteps),
            current: $scope.totalSteps,
            image: "background-image: url(../images/bayToBreakers.jpg); background-size: cover;"
          }, 
          {
            name: 'Shire to Mordor',
            description:'Can one simply walk to Mordor?',
            goal: 3600000,
            unit: 'steps',
            width: $scope.getPercent(3600000, $scope.totalSteps),
            current: $scope.totalSteps,
            image: "background-image: url(../images/Mordor.jpg); background-size: cover;"

          },
          {
            name: 'Hike the Burj Khalifa',
            description:'Climb the worlds tallest building!',
            goal: 290,  
            unit: 'flights',
            width: $scope.getPercent(290, $scope.totalFlights),
            current: $scope.totalFlights,
            image: "background-image: url(../images/Burj.jpg); background-size: cover;"
          },
          {
            name: 'Everest Challenge',
            description:'Climb 2900 flights of stairs!',
            goal: 1200,
            unit: 'flights',
            width: $scope.getPercent(1200, $scope.totalFlights),
            current: $scope.totalFlights,
            image: "background-image: url(../images/Everest_background.jpg); background-size: cover;"   

          },
          {
            name: 'Walk Across America',
            description:'Trek from SF to NY!',
            goal: 5146000,
            unit: 'steps',
            width: $scope.getPercent(5146000, $scope.totalSteps),
            current: $scope.totalSteps,
            image: "background-image: url(../images/america.jpg); background-size: cover;"
          }
          ]          
          
          //get total stairs    
        });
    }
    $scope.getUserInfo();
    
  });
