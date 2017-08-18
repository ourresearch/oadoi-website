angular.module('staticPages', [
    'ngRoute',
    'ngMessages'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/unpaywall', {
            templateUrl: "unpaywall.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/sfx', {
            templateUrl: "sfx.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/api', {
            templateUrl: "api.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/api/v1', {
            templateUrl: "api-v1.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/api/v2', {
            templateUrl: "api-v2.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/faq', {
            templateUrl: "faq.tpl.html",
            controller: "StaticPageCtrl"
        })
    })
    .config(function ($routeProvider) {
        $routeProvider.when('/sla', {
            templateUrl: "sla.tpl.html",
            controller: "StaticPageCtrl"
        })
    })


    .config(function ($routeProvider) {
        $routeProvider.when('/about', {redirectTo: "/faq"})
    })


    .controller("StaticPageCtrl", function ($scope,
                                             $http,
                                             $rootScope,
                                             $timeout) {


        $scope.global.title = $scope.global.template

        console.log("static page ctrl")
        //$timeout(function(){
        //    if ($scope.global.template.indexOf("api") >= 0){
        //        hljs.initHighlighting();
        //    }
        //
        //}, 0)

    })










