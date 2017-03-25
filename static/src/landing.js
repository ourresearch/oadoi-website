angular.module('landing', [
    'ngRoute',
    'ngMessages',
    'duScroll'
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
                                             $location,
                                             $document,
                                             $interval,
                                             $timeout) {

        console.log("landing page.")
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        var oneServedEvery = 604;  // one served every 2000 ms
        var startTimestampMs = 1485907200 * 1000;  // feb 1 2017
        var elapsedMs = Date.now() - startTimestampMs;
        var numServed = Math.floor(elapsedMs / oneServedEvery);


        $scope.d = {}
        $scope.d.numServed = numberWithCommas(numServed)

        function tick(){
            var fuzz = Math.random() + .5;
            var waitFor = oneServedEvery * fuzz
            numServed += 1
            $scope.d.numServed = numberWithCommas(numServed)
            console.log("tick")

            if ($location.pathname){
                return false
            }
            else {
                return $timeout(tick, waitFor)
            }

        }

        //tick()


        var moreSection = angular.element(document.getElementById('show-rest-of-landing-page'));

        $scope.scrollToMore = function(){
            console.log("scroll to about!", moreSection)
            $document.scrollToElement(moreSection, 0, 1000);
        }


        //$interval(function(){
        //    numServed += 1
        //    $scope.d.numServed = numberWithCommas(numServed)
        //    console.log("tick")
        //}, oneServedEvery)







    })










