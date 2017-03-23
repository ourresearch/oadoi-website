angular.module('landing', [
    'ngRoute',
    'ngMessages'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/landing/:landingPageName', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })

    .controller("LandingPageCtrl", function ($scope,
                                             $http,
                                             $rootScope,
                                             $interval,
                                             $timeout) {

        console.log("landing page.")
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        var oneServedEvery = 2000;  // one served every 2000 ms
        var startTimestampMs = 1485907200 * 1000;  // feb 1 2017
        var elapsedMs = Date.now() - startTimestampMs;
        var numServed = Math.floor(elapsedMs / oneServedEvery);


        $scope.d = {}
        $scope.d.numServed = numberWithCommas(numServed)


        $interval(function(){
            numServed += 1
            $scope.d.numServed = numberWithCommas(numServed)
            console.log("tick")
        }, oneServedEvery)






    })










