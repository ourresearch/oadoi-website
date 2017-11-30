angular.module('app', [

    // external libs
    'ngRoute',
    'ngMessages',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngMaterial',
    'ngProgress',

    // this is how it accesses the cached templates in ti.js
    'templates.app',

    // services
    'numFormat',

    // pages
    "landing",
    "staticPages"

]);




angular.module('app').config(function ($routeProvider,
                                       $mdThemingProvider,
                                       $locationProvider) {
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette("blue")



});




angular.module('app').run(function($route,
                                   $rootScope,
                                   $q,
                                   $timeout,
                                   $cookies,

                                   $http,
                                   $location) {

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-23384030-5', 'auto');





    $rootScope.$on('$routeChangeStart', function(next, current){
    })
    $rootScope.$on('$routeChangeSuccess', function(next, current){
        //window.scrollTo(0, 0)
        ga('send', 'pageview', { page: $location.url() });

    })



    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        console.log("$routeChangeError! here's some things to look at: ", event, current, previous, rejection)

        $location.url("page-not-found")
        window.scrollTo(0, 0)
    });
});



angular.module('app').controller('AppCtrl', function(
    ngProgressFactory,
    $rootScope,
    $scope,
    $route,
    $location,
    NumFormat,
    $http,
    $mdDialog,
    $sce){

    console.log("the angular app is running")

    var progressBarInstance = ngProgressFactory.createInstance();

    $rootScope.progressbar = progressBarInstance
    $scope.progressbar = progressBarInstance
    $scope.numFormat = NumFormat
    $scope.moment = moment // this will break unless moment.js loads over network...

    $scope.global = {}

    $scope.pageTitle = function(){
        if ($scope.global.title){
            return "oaDOI: " + $scope.global.title
        }
        else {
            return "oaDOI"
        }
    }





    $rootScope.$on('$routeChangeSuccess', function(next, current){
        if (current.loadedTemplateUrl) {
            $scope.global.template = current.loadedTemplateUrl
                .replace("/", "-")
                .replace(".tpl.html", "")
        }


        $scope.global.title = null
    })

    $scope.trustHtml = function(str){
        return $sce.trustAsHtml(str)
    }

    var showAlert = function(msgText, titleText, okText){
        if (!okText){
            okText = "ok"
        }
          $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(titleText)
                    .textContent(msgText)
                    .ok(okText)
            );
    }
    $rootScope.showAlert = showAlert
})
















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











angular.module("numFormat", [])

    .factory("NumFormat", function($location){

        var commas = function(x) { // from stackoverflow
            if (!x) {
                return x
            }
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }


        var short = function(num, fixedAt){
            if (typeof num === "string"){
                return num  // not really a number
            }

            // from http://stackoverflow.com/a/14994860/226013
            if (num === null){
                return 0
            }
            if (num === 0){
                return 0
            }

            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 100000) { // no decimal if greater than 100thou
                return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'k';
            }

            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }


            if (num < 1) {
                return Math.round(num * 100) / 100;  // to two decimals
            }

            return Math.ceil(num);
        }

        var round = function(num){
            return Math.round(num)
        }

        var doubleUrlEncode = function(str){
            return encodeURIComponent( encodeURIComponent(str) )
        }

        // from http://cwestblog.com/2012/09/28/javascript-number-getordinalfor/
        var ordinal = function(n) {
            n = Math.round(n)
            var s=["th","st","nd","rd"],
                v=n%100;
            return n+(s[(v-20)%10]||s[v]||s[0]);
        }

        var decimalToPerc = function(decimal, asOrdinal){
            var ret = Math.round(decimal * 100)
            if (asOrdinal){
                ret = ordinal(ret)
            }
            return ret
        }
        return {
            short: short,
            commas: commas,
            round: round,
            ordinal: ordinal,
            doubleUrlEncode: doubleUrlEncode,
            decimalToPerc: decimalToPerc

        }
    });
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











angular.module('templates.app', ['api-v1.tpl.html', 'api-v2.tpl.html', 'api.tpl.html', 'browser-tools.tpl.html', 'faq.tpl.html', 'footer.tpl.html', 'landing.tpl.html', 'sfx.tpl.html', 'sla.tpl.html', 'team.tpl.html', 'unpaywall.tpl.html']);

angular.module("api-v1.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("api-v1.tpl.html",
    "<div class=\"page api api-v2\">\n" +
    "\n" +
    "    <h1>API Version 1</h1>\n" +
    "    <div class=\"version-warning\">\n" +
    "        This is currently the default version; however <a href=\"api/v2\">v2</a> will become the default\n" +
    "        on October 1, 2017, so we recommend new users build on v2.\n" +
    "    </div>\n" +
    "\n" +
    "     <p>\n" +
    "        There are two ways to get access to the oaDOI dataset: the API is best for most\n" +
    "        uses because it's simple, fast, and easy to get running; the datasets are great for\n" +
    "        large-scale research and data mining. Whichever you're using, we recommend you subscribe to the\n" +
    "        <a href=\"https://groups.google.com/forum/#!forum/oadoi-users\">mailing list</a> in order\n" +
    "        to stay up-to-date when there are changes or new features.\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "    <h2>Limits and authentication</h2>\n" +
    "    <p>\n" +
    "        The REST API gives anyone free, programmatic access to all of oaDOI's data.\n" +
    "        There's no rate limit, but if you need more than 100k calls/day you\n" +
    "        may want to download the datasets instead.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Requests must include your email, so that we can\n" +
    "        get in touch if something breaks, and so we can report usage to our funders.\n" +
    "        Add the email as a parameter at the end of the URL, like this:\n" +
    "        <code>?email=YOUR_EMAIL</code>.\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "    <h2>Endpoints</h2>\n" +
    "\n" +
    "\n" +
    "    <div class=\"endpoint\">\n" +
    "        <code class=\"endpoint\">GET /</code>\n" +
    "\n" +
    "        <h3>Description</h3>\n" +
    "        <p>Gets an API status object that describes this API.</p>\n" +
    "\n" +
    "        <h3>Example</h3>\n" +
    "         <a href=\"https://api.oadoi.org?email=test@example.com\">https://api.oadoi.org?email=test@example.com</a>\n" +
    "\n" +
    "        <h3>Response Keys</h3>\n" +
    "\n" +
    "        <table class=\"api-responses\">\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">documentation_url</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    Where you can find documentation for this version.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">msg</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    Relevant messages.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">version</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    Version string.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    Example: <code>1.3.0</code>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"endpoint\">\n" +
    "        <code class=\"endpoint\">GET /:doi</code>\n" +
    "        <h3>Description</h3>\n" +
    "        <p>Gets OA status and bibliographic info for an given DOI-assigned resource.</p>\n" +
    "\n" +
    "        <h3>Example</h3>\n" +
    "        <p>\n" +
    "            <a href=\"https://api.oadoi.org/10.1038/nature12373?email=test@example.com\">https://api.oadoi.org/10.1038/nature12373?email=test@example.com</a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h3>Response Keys</h3>\n" +
    "\n" +
    "        <table class=\"api-responses\">\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">algorithm_version</span>\n" +
    "                    <span class=\"type\">Integer</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    Indicates the data collection approaches used for this article.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <h4>Possible values</h4>\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\"><code>1</code></span>\n" +
    "                            <span class=\"notes\">\n" +
    "                                First-generation hybrid detection. Uses only data from the Crossref API to determine hybrid status. Does a good job for Elsevier articles and a few other publishers, but most publishers are not checked for hybrid.\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\"><code>2</code></span>\n" +
    "                            <span class=\"notes\">\n" +
    "                                Second-generation hybrid detection. Uses additional sources, checks all publishers for hybrid. Gets about 10x as much hybrid. <code>data_standard==2</code> is the version used in the paper we wrote about oaDOI.\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">doi</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    The requested DOI.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">doi_resolver</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    The organization in charge of issuing and resolving this DOI.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <h4>Possible values</h4>\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\"><code>crossref</code></span>\n" +
    "                            <span class=\"notes\">\n" +
    "                                This is a Crossref DOI\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\"><code>datacite</code></span>\n" +
    "                            <span class=\"notes\">\n" +
    "                                This is a Datacite DOI.\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">evidence</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    Free-text string describing how we found the <code>free_fulltext_url</code>.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <p>\n" +
    "                        Used for debugging. Don’t depend on the exact contents of this for anything, because values are subject to change without warning.\n" +
    "\n" +
    "                    </p>\n" +
    "                    <h4>Example values</h4>\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\"><code>oa journal (via journal title in doaj)</code></span>\n" +
    "                            <span class=\"notes\">\n" +
    "                                We found the name of the journal that publishes this article in the DOAJ database.\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\"><code>oa repository (via pmcid lookup)</code></span>\n" +
    "                            <span class=\"notes\">\n" +
    "                                We found this article in an index of PubMed Central articles.\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <span class=\"value\">...</span>\n" +
    "                            <span class=\"notes\">\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">free_fulltext_url</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    URL where the best fulltext copy of this article lives.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <p>\n" +
    "                        The fulltext can be in various formats, including PDF, HTML, or even Word.\n" +
    "                    </p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">is_boai_license</span>\n" +
    "                    <span class=\"type\">Boolean</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    True whenever the <code>license</code> is <code>cc-by</code>, <code>cc0</code>, or <code>PD</code>.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <p>\n" +
    "                        This key attempts to identify articles that meets the widely-used <a\n" +
    "                            href=\"https://www.wikiwand.com/en/Budapest_Open_Access_Initiative#/Definition_of_open_access\">BOAI</a> definition of Open Access.\n" +
    "                    </p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">is_free_to_read</span>\n" +
    "                    <span class=\"type\">Boolean</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    True whenever the <code>free_fulltext_url</code> is not <code>None</code>.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">is_subscription_journal</span>\n" +
    "                    <span class=\"type\">Boolean</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    True whenever the journal is <em>not</em> in the DOAJ or DataCite.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">license</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    The license under which the article is published.\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <h4>Example values</h4>\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            Creative Commons licenses are uniformly abbreviated and lowercased. Example: <code>cc-by-nc</code>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            Publisher-specific licenses are normalized using this format: <code>acs-specific: authorchoice/editors choice usage agreement</code>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">oa_color</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    Provides information about the host of the OA copy\n" +
    "                </td>\n" +
    "                <td class=\"notes\">\n" +
    "                    <h4>Possible values</h4>\n" +
    "                    <ul>\n" +
    "                        <li>\n" +
    "                            <code>Gold</code> means the <code>free_fulltext_url</code> is served by the article's publisher.\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <code>Green</code> means the <code>free_fulltext_url</code> is served from an OA repository.\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <tr>\n" +
    "                <td class=\"key\">\n" +
    "                    <span class=\"name\">url</span>\n" +
    "                    <span class=\"type\">String</span>\n" +
    "                </td>\n" +
    "                <td class=\"contents\">\n" +
    "                    The URL that the DOI resolves to.\n" +
    "                </td>\n" +
    "                <td class=\"notes\"></td>\n" +
    "            </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        </table>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("api-v2.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("api-v2.tpl.html",
    "<div class=\"page api api-v2\">\n" +
    "    <h1>API Version 2</h1>\n" +
    "    <div class=\"version-good\">\n" +
    "        Version 2 will become the default version on October 1, 2017, and we recommend that new users build on this version. Use it now by prepending <code>/v2</code> to each endpoint.\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"toc\">\n" +
    "        <li><a href=\"#limits\">Limits and authentication</a></li>\n" +
    "        <li>\n" +
    "            <a href=\"#endpoints\">Endpoints</a>\n" +
    "            <ul>\n" +
    "                <li><a href=\"#get-base\">GET /v2</a></li>\n" +
    "                <li><a href=\"#get-doi\">GET /v2/:doi</a></li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"#response-objects\">Response objects</a>\n" +
    "            <ul>\n" +
    "                <li><a href=\"#api-status-object\">API Status object</a></li>\n" +
    "                <li><a href=\"#oa-location-object\">OA Location object</a></li>\n" +
    "                <li><a href=\"#doi-object\">DOI object</a></li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <h2 class=\"anchor\"  id=\"limits\">Limits and authentication</h2>\n" +
    "    <p>\n" +
    "        The REST API gives anyone free, programmatic access to all of oaDOI's data.\n" +
    "        There's no rate limit, but if you need more than 100k calls/day you\n" +
    "        may want to download the datasets instead.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Requests must include your email, so that we can\n" +
    "        get in touch if something breaks, and so we can report usage to our funders.\n" +
    "        Add the email as a parameter at the end of the URL, like this:\n" +
    "        <code>?email=YOUR_EMAIL</code>.\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "        If you're using the API, we recommend you subscribe to the\n" +
    "        <a href=\"https://groups.google.com/forum/#!forum/oadoi-users\">mailing list</a> in order\n" +
    "        to stay up-to-date when there are changes or new features.\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "    <h2 class=\"anchor\"  id=\"endpoints\">Endpoints</h2>\n" +
    "\n" +
    "\n" +
    "    <div class=\"endpoint\" id=\"get-base\">\n" +
    "        <code class=\"endpoint\">GET /</code>\n" +
    "\n" +
    "        <table class=\"endpoint\">\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Description\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    Gets an API status object that describes this API.\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Returns\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    <a href=\"#api-status-object\">API Status object</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Example\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    <a href=\"https://api.oadoi.org/v2?email=test@example.com\">https://api.oadoi.org/v2?email=test@example.com</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"endpoint\" id=\"get-doi\">\n" +
    "        <code class=\"endpoint\">GET /:doi</code>\n" +
    "        <table class=\"endpoint\">\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Description\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    Gets OA status and bibliographic info for an given DOI-assigned resource.\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Accepts\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    A valid DOI.\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Returns\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    <a href=\"#doi-object\">DOI object</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "                <td class=\"k\">\n" +
    "                    Example\n" +
    "                </td>\n" +
    "                <td class=\"v\">\n" +
    "                    <a href=\"https://api.oadoi.org/v2/10.1038/nature12373?email=test@example.com\">https://api.oadoi.org/v2/10.1038/nature12373?email=test@example.com</a>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </table>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <!-------------------------------------------------------------------------\n" +
    "\n" +
    "    RESPONSE OBJECTS\n" +
    "\n" +
    "    --------------------------------------------------------------------------->\n" +
    "\n" +
    "    <h2 class=\"anchor\"  id=\"response-objects\">Response objects</h2>\n" +
    "    <p>The API returns three different types of response objects. Really two, since more users won't ever need the API Status object, which just defines the root of the API. The OA Location object describes a place we found an OA copy of an article. There are one or more of these associated with DOI object, which describes a given DOI-assigned resource.</p>\n" +
    "\n" +
    "\n" +
    "    <h3 class=\"anchor\" id=\"api-status-object\">API Status object</h3>\n" +
    "    <table class=\"api-responses\">\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">documentation_url</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Where you can find documentation for this version.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">msg</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Relevant messages.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">version</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Version string.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Example: <code>2.0.1</code>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <h3 class=\"anchor\" id=\"oa-location-object\">OA Location object</h3>\n" +
    "    <p>The OA Location object describes particular location where we found a given OA article. The same article is often available from multiple locations. There may be differences in format, version, and license from one location to another, even if it's the same article in all cases.</p>\n" +
    "    <table class=\"api-responses\">\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">evidence</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                How we found this OA location.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>\n" +
    "                    Used for debugging. Don’t depend on the exact contents of this for anything, because values are subject to change without warning. Example values:\n" +
    "\n" +
    "                </p>\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        <span class=\"value\"><code>oa journal (via journal title in doaj)</code></span>\n" +
    "                        <span class=\"notes\">\n" +
    "                            We found the name of the journal that publishes this article in the DOAJ database.\n" +
    "                        </span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"value\"><code>oa repository (via pmcid lookup)</code></span>\n" +
    "                        <span class=\"notes\">\n" +
    "                            We found this article in an index of PubMed Central articles.\n" +
    "                        </span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">host_type</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The type of host that serves this OA location.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>\n" +
    "                    There are two possible values:\n" +
    "                </p>\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        <span class=\"value\"><code>publisher</code></span>\n" +
    "                        <span class=\"notes\">\n" +
    "                            means the this location is served by the article’s publisher (in practice, this means it is hosted on the same domain the DOI resolves to).\n" +
    "                        </span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"value\"><code>repository</code></span>\n" +
    "                        <span class=\"notes\">\n" +
    "                            means this location is served by an Open Access repository.\n" +
    "                        </span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">license</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The license under which this copy is published.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>We return several types of licenses:</p>\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        Creative Commons licenses are uniformly abbreviated and lowercased. Example: <code>cc-by-nc</code>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        Publisher-specific licenses are normalized using this format: <code>acs-specific: authorchoice/editors choice usage agreement</code>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        When we have evidence that an OA license of <em>some</em> kind was used, but it’s not reported directly on the webpage at this location, this field returns <code>implied-oa</code>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">updated</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Time when the data for this location was last updated.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Returned as an <a href=\"https://xkcd.com/1179/\">ISO8601-formatted</a> timestamp. Example: <code>2017-08-17T23:43:27.753663</code>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">url</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The URL where you can find this OA copy.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>\n" +
    "                    Although this URL points to fulltext of <em>some</em> kind, there is (for now) no format normalization...it could be PDF, HTML, or even Word or TeX.\n" +
    "                </p>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">versions</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The content version accessible at this location.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>\n" +
    "                    We use the <a href=\"https://wiki.surfnet.nl/display/DRIVERguidelines/DRIVER-VERSION+Mappings\">DRIVER Guidelines v2.0 VERSION standard</a> to define  versions of a given article; see those docs for complete definitions of terms. Here's the basic idea, though, for the three version types we support:\n" +
    "                </p>\n" +
    "                <ul>\n" +
    "                    <li><code>submittedVersion</code> is not yet peer-reviewed.</li>\n" +
    "                    <li><code>acceptedVersion</code> is peer-reviewed, but lacks publisher-specific formatting.</li>\n" +
    "                    <li><code>publishedVersion</code> is the version of record.</li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <h3 class=\"anchor\" id=\"doi-object\">DOI object</h3>\n" +
    "    <p>The DOI object describes a given DOI-assigned resource. It contains metadata about the resource itself, as well as information about its OA status.</p>\n" +
    "\n" +
    "    <table class=\"api-responses\">\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">best_oa_location</span>\n" +
    "                <span class=\"type\">Object|null</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The best <a href=\"#oa-location-object\">OA Location</a> object we could find for this DOI.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>\n" +
    "                    The \"best\" location is determined using an algorithm that prioritizes publisher-hosted content first (eg Hybrid or Gold), then prioritizes versions closer to the version of record (<code>PublishedVersion</code> over <code>AcceptedVersion</code>), then more authoritative repositories (PubMed Central over CiteSeerX).\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    Returns <code>null</code> if we couldn't find any OA Locations.\n" +
    "                </p>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">data_standard</span>\n" +
    "                <span class=\"type\">Integer</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Indicates the data collection approaches used for this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                <p>Possible values</p>\n" +
    "                <ul>\n" +
    "                    <li>\n" +
    "                        <span class=\"value\"><code>1</code></span>\n" +
    "                        <span class=\"notes\">\n" +
    "                            First-generation hybrid detection. Uses only data from the Crossref API to determine hybrid status. Does a good job for Elsevier articles and a few other publishers, but most publishers are not checked for hybrid.\n" +
    "                        </span>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"value\"><code>2</code></span>\n" +
    "                        <span class=\"notes\">\n" +
    "                            Second-generation hybrid detection. Uses additional sources, checks all publishers for hybrid. Gets about 10x as much hybrid. <code>data_standard==2</code> is the version used in the paper we wrote about oaDOI.\n" +
    "                        </span>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">doi</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The DOI of this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                This is always lowercase.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">is_oa</span>\n" +
    "                <span class=\"type\">Boolean</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                <code>True</code> if there is an OA copy of this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Convenience attribute; returns <code>true</code> when <code>best_oa_location</code> is not <code>null</code>.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">journal_is_oa</span>\n" +
    "                <span class=\"type\">Boolean</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Is this resource published in a completely OA journal\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Useful for most definitions of Gold OA. Currently this is based entirely on inclusion in the <a\n" +
    "                    href=\"http://doaj.org\">DOAJ,</a> but eventually may use additional ways of identifying all-OA journals.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">journal_issns</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Any ISSNs assigned to the journal publishing this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Separate ISSNs are sometimes assigned to print and electronic versions of the same journal. If there are multiple ISSNs, they are separated by commas. Example: <code>1232-1203,1532-6203</code>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">journal_name</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The name of the journal publishing this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                The same journal may have multiple name strings (eg, \"J. Foo\", \"Journal of Foo\", \"JOURNAL OF FOO\", etc). These have not been fully normalized within our database, so use with care.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">oa_locations</span>\n" +
    "                <span class=\"type\">List</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                List of all the <a href=\"#oa-location-object\">OA Location</a> objects associated with this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                This list is unnecessary for the vast majority of use-cases, since you probably just want the <code>best_oa_location</code>. It's included primarily for research purposes.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">publisher</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The name of this resource's publisher.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Keep in mind that publisher name strings change over time, particularly as publishers are acquired or split up.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">title</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                The title of this resource.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                It's the title. Pretty straightforward.\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr>\n" +
    "            <td class=\"key\">\n" +
    "                <span class=\"name\">updated</span>\n" +
    "                <span class=\"type\">String</span>\n" +
    "            </td>\n" +
    "            <td class=\"contents\">\n" +
    "                Time when the data for this resource was last updated.\n" +
    "            </td>\n" +
    "            <td class=\"notes\">\n" +
    "                Returned as an <a href=\"https://xkcd.com/1179/\">ISO8601-formatted</a> timestamp. Example: <code>2017-08-17T23:43:27.753663</code>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "\n" +
    "    </table>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("api.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("api.tpl.html",
    "<div class=\"page api\">\n" +
    "    <h1>API and datasets</h1>\n" +
    "\n" +
    "\n" +
    "     <p>\n" +
    "        There are are two main ways to access oaDOI's data: the API and the datasets.\n" +
    "\n" +
    "     </p>\n" +
    "    <p>\n" +
    "         The API is much easier to use, so it's probably your best bet.\n" +
    "        Most applications will not have scale problems using the\n" +
    "         API, as it can handle 100k/day from your application, and average return time is <200ms.\n" +
    "        The datasets are quite large (90M and 19M rows) and so using them requires some extra work, but\n" +
    "        they are great for some large research projects. The API is free for both commercial\n" +
    "        and noncommercial use.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Whichever you're using, we recommend you subscribe to the\n" +
    "        <a href=\"https://groups.google.com/forum/#!forum/oadoi-users\">mailing list</a> in order\n" +
    "        to stay up-to-date when there are changes or new features.\n" +
    "    </p>\n" +
    "\n" +
    "    <h2>API Version 1</h2>\n" +
    "    <p>\n" +
    "        This is currently the default version; however <a href=\"api/v2\">v2</a> will become the default\n" +
    "        on October 1, 2017, so we recommend new users build on v2. <a href=\"/api/v1\">Read the v1 documentation here.</a>\n" +
    "    </p>\n" +
    "\n" +
    "    <h2>API Version 2</h2>\n" +
    "    <p>\n" +
    "        Version 2 will become the default version on October 1, 2017, and we recommend that new users build on this version. <a href=\"/api/v2\">Read the v2 documentation here.</a>\n" +
    "    </p>\n" +
    "\n" +
    "    <h2>Datasets</h2>\n" +
    "    <p>\n" +
    "        The datasets behind the oaDOI API are available for download as two big CSV files.\n" +
    "        They are free for use in\n" +
    "        non-commercial academic research.\n" +
    "        <a href=\"mailto:team@impactstory.org\">Contact us</a> if you're interested in downloading them.\n" +
    "\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        If you'd like to download the datasets for commercial\n" +
    "        use, check out our\n" +
    "        <a href=\"sla\">service-level agreement</a> program.\n" +
    "    </p>\n" +
    "</div>");
}]);

angular.module("browser-tools.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("browser-tools.tpl.html",
    "<div class=\"page browser-tools\">\n" +
    "    <h1>Browser tools</h1>\n" +
    "\n" +
    "        <p>\n" +
    "        The power of oaDOI is now available as a Chrome Extension!  As you browse,\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "    <!--\n" +
    "        <p>\n" +
    "            These tools do more or less the same thing: when you're\n" +
    "            viewing the landing page for a scholarly article, they'll use oaDOI to find\n" +
    "            any open versions of that article. Both of them only work on pages\n" +
    "            with DOIs.\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h2>Chrome Extension</h2>\n" +
    "        <p>\n" +
    "            The beta release is now available! Install it via the Chrome Web Store:\n" +
    "            <a href=\"https://chrome.google.com/webstore/detail/getthepdf/iplffkdpngmdjhlpjmppncnlhomiipha\">\n" +
    "                un\n" +
    "            </a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h2>Bookmarklet <span class=\"beta\">beta</span> </h2>\n" +
    "        <p>\n" +
    "            Drag the link up to your bookmarks toolbar. When you're viewing an article\n" +
    "            landing page, click the bookmark. If we can find open fulltext for it anywhere,\n" +
    "            we'll redirect you there.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <span class=\"instructions\">\n" +
    "                Drag this link to your bookmarks toolbar:\n" +
    "            </span>\n" +
    "            <a class=\"bookmarklet-link\" href=\"javascript:(function () {var jsCode = document.createElement('script'); jsCode.setAttribute('src', '//oadoi.org/browser-tools/bookmarklet.js');document.body.appendChild(jsCode);  }());\">oaDOI it</a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <p>\n" +
    "            The tool is in beta right now, so we're really interested in your feedback.\n" +
    "            <a href=\"mailto:team@impactstory.org\">Drop us a line</a> with bug reports\n" +
    "            and feature ideas!\n" +
    "        </p>\n" +
    "\n" +
    "    -->\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("faq.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("faq.tpl.html",
    "<div class=\"page faq\">\n" +
    "    <h1>Frequently asked questions</h1>\n" +
    "\n" +
    "    <dl>\n" +
    "\n" +
    "        <dt id=\"data-sources\">How can I make sure my institutional repository is indexed in oaDOI?</dt>\n" +
    "        <dd>\n" +
    "            We're working on a web interface that will walk you through adding your repository to the index. That's not done yet.  For now,\n" +
    "             <a href=\"mailto:team@impactstory\">drop us an email</a> and we'll get you set up.\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"data-sources\">Where does your data come from?</dt>\n" +
    "        <dd>\n" +
    "            We use a number of different data sources to find open versions of articles\n" +
    "            (or in many cases, to determine that the articles are open already):\n" +
    "            <ul>\n" +
    "                <li>The <a href=\"https://doaj.org/\">Directory of Open Access Journals</a> to see if it’s in their index of OA journals.</li>\n" +
    "                <li><a href=\"http://crossref.org/\">CrossRef’s</a> license metadata field, to see if the publisher has reported an open license.</li>\n" +
    "                <li>Our own custom list DOI prefixes, to see if it's in a known preprint repository.</li>\n" +
    "                <li>Institutional repositories, like <a href=\"https://dash.harvard.edu/\">Harvard's DASH</a>,\n" +
    "                    <a href=\"https://deepblue.lib.umich.edu/documents\">University of Michigan's Deep Blue</a>, and thousands more.</li>\n" +
    "                <li>Subject repositories, like <a href=\"https://arxiv.org\">arXiv</a>, <a href=\"https://www.ncbi.nlm.nih.gov/pmc/\">PMC</a>, and many others.</li>\n" +
    "                <li>Journal article pages directly, to see if there’s a free PDF link from the publisher.</li>\n" +
    "            </ul>\n" +
    "        </dd>\n" +
    "\n" +
    "        <p>\n" +
    "            We used to use the <a href=\"https://www.base-search.net/\">BASE OA search engine</a> to help us find OA copies.  It's a great service.\n" +
    "            However, BASE has some reuse restrictions on their data that weren't a good fit for us,\n" +
    "            so we've reimplemented our own repository aggregator and no longer use BASE.\n" +
    "        </p>\n" +
    "\n" +
    "        <dt id=\"creators\">Who is behind oaDOI?</dt>\n" +
    "        <dd>\n" +
    "            We're <a href=\"http://impactstory.org/about\">Impactstory,</a>\n" +
    "            a nonprofit working to make science more open and reusable online.\n" +
    "\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"funding\">How is oaDOI funded?</dt>\n" +
    "        <dd>\n" +
    "            Impactstory is supported by grants from <span class=\"funders\">\n" +
    "            the National Science Foundation and the Alfred P. Sloan Foundation.</span> We'll be supporting\n" +
    "            oaDOI as spinoff of existing projects for the next year, but we're looking for additional funding to expand the\n" +
    "            service even further. Possible models include grants and Service-Level Agreements with\n" +
    "            data users. No matter what funding models we end up with, the API will always remain free and open.\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"different-results-from-unpaywall\">Why does the Unpaywall extension sometimes give different results from oaDOI?</dt>\n" +
    "        <dd>\n" +
    "            Our Unpaywall browser extension uses oaDOI to find fulltext whenever you run into paywalled articles.\n" +
    "            It supplements oaDOI with other data sources, too; for instance,\n" +
    "            Unpaywall tries to parse and understand scholarly article pages\n" +
    "            as you view them. Consequently,\n" +
    "             Unpaywall's results are a bit more comprehensive than what you'd get by calling oaDOI directly.\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"report-bugs\">I found a bug</dt>\n" +
    "        <dd>\n" +
    "            Sorry about that! The problem may be that a given repository is not yet\n" +
    "            <a href=\"https://www.base-search.net/about/en/about_sources_date.php?menu=2&submenu=1\">indexed by BASE</a>\n" +
    "            (which is where most of our Green OA information comes from). Then there's also typos,\n" +
    "            dead links,  inconsistent formatting, and other gotchas.\n" +
    "            The good news is, we're getting better all the\n" +
    "            time, and your feedback helps. When you find errors, please let us know by\n" +
    "            <a href=\"https://goo.gl/forms/kFZUUZUeM9ze9uXr2\" target=\"_blank\" >completing this form.</a>\n" +
    "             From there it'll go in our bug\n" +
    "            queue. We'll drop you a line when it's fixed.\n" +
    "        </dd>\n" +
    "\n" +
    "    </dl>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("footer.tpl.html",
    "<div class=\"page-footer\">\n" +
    "    <div class=\"by\">\n" +
    "        Made with <i class=\"fa fa-heart-o\"></i> by\n" +
    "        <a href=\"http://impactstory.org/about\">Impactstory.</a>\n" +
    "    </div>\n" +
    "    <div class=\"spacer\"></div>\n" +
    "    <div class=\"links\">\n" +
    "        <a href=\"mailto:team@impactstory.org\">\n" +
    "            <i class=\"fa fa-envelope-o\"></i>\n" +
    "            <span class=\"text\">email</span>\n" +
    "        </a>\n" +
    "        <a href=\"http://twitter.com/oadoi_org\">\n" +
    "            <i class=\"fa fa-twitter\"></i>\n" +
    "            <span class=\"text\">twitter</span>\n" +
    "        </a>\n" +
    "        <a href=\"https://github.com/Impactstory/oadoi\">\n" +
    "            <i class=\"fa fa-github\"></i>\n" +
    "            <span class=\"text\">github</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("landing.tpl.html",
    "<div class=\"page landing\">\n" +
    "    <div class=\"content\">\n" +
    "        <div class=\"main-banner\">\n" +
    "            <div class=\"tagline\">\n" +
    "                Find fulltext for scholarly articles.\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"subtagline\">\n" +
    "                We index 90 million articles and deliver open-access\n" +
    "                fulltext versions over a free, fast, open API.\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"info\">\n" +
    "            <p>\n" +
    "                Our data powers\n" +
    "                <a href=\"http://unpaywall.org\">Unpaywall,</a> a free browser extension that lets you\n" +
    "                bypass paywalls on scholarly articles. <a href=\"http://unpaywall.org\">Give it a try.</a>\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                For libraries, we support an <a href=\"http://blog.impactstory.org/oadoi-in-sfx/\">SFX integration</a>\n" +
    "                that finds open fulltext when there's\n" +
    "                no subscription access; more than 600 libraries use it worldwide.\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                Want to build on our data? Awesome! We handle a million calls a\n" +
    "                week and we'd love to add yours. Check out the\n" +
    "                <a href=\"/api\">API documentation.</a>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("sfx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sfx.tpl.html",
    "<h1>SFXY!</h1>");
}]);

angular.module("sla.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sla.tpl.html",
    "<div class=\"page sla\">\n" +
    "    <h1>Service-Level Agreement</h1>\n" +
    "    <p>\n" +
    "        Interested in commercial reuse of data from oaDOI? Check out our\n" +
    "        Service-Level Agreement (SLA). Here are the benefits:\n" +
    "    </p>\n" +
    "    <ul>\n" +
    "        <li>\n" +
    "            You can download our whole database as a single file, and use it for\n" +
    "            commercial purposes.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            You can get weekly updates on what changed in the oaDOI database. So, if you start\n" +
    "            with the download file, then subscribe to the weekly updates, you'll be able to\n" +
    "            maintain an exact copy of our database, on your own local servers.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            You'll get enterprise-level service and support established and guaranteed in writing.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            You help support oaDOI and keep it sustainable over the long term.\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <p>\n" +
    "        Of course, if you don't need  these features,\n" +
    "        you can always just use the\n" +
    "        <a href=\"api\">API;</a> it's free to everyone for\n" +
    "        any use, and always will be.\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "        Our pricing on the SLA is flexible, depending on your revenue and use-case.\n" +
    "        So if you're interested, please <a href=\"mailto:team@impactstory.org\">contact us;</a>\n" +
    "        we'd love to hear from you!\n" +
    "\n" +
    "\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("team.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team.tpl.html",
    "<div class=\"page team\">\n" +
    "    <h1>Team</h1>\n" +
    "    <p>\n" +
    "        oaDOI is being built at <a href=\"http://impactstory.org\">Impactstory</a>\n" +
    "        by <a href=\"http://twitter.com/researchremix\">Heather Piwowar<a/> and\n" +
    "        <a href=\"http://twitter.com/jasonpriem\">Jason Priem</a>, funded by the Alfred P. Sloan foundation.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        We'd like to thank all of the people who've worked on earlier projects\n" +
    "        (<a href=\"http://ananelson.github.io/oacensus/\">OA Census</a>,\n" +
    "        <a href=\"https://github.com/CottageLabs/OpenArticleGauge\">Open Article Gauge</a>,\n" +
    "        <a href=\"http://dissem.in/\">Dissemin</a>,\n" +
    "        <a href=\"https://cottagelabs.com/ \">Cottage Labs</a>, and the\n" +
    "        <a href=\"https://openaccessbutton.org/\">Open Access Button</a>)\n" +
    "        for sharing ideas in conversations and open source code -- in particular <a href=\"http://doai.io/\">DOAI</a>\n" +
    "        for inspiring the DOI resolver part of this project.  Thanks also to <a href=\"/about\"> the\n" +
    "        data sources</a> that make oaDOI possible.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        All of the code behind oaDOI is <a href=\"http://github.com/impactstory/oadoi\">open source on GitHub</a>.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Questions or ideas?  You can reach us at <a href=\"mailto:team@impactstory.org\">team@impactstory.org</a>\n" +
    "        or <a href=\"http://twitter.com/oadoi_org\">@oadoi_org</a>.\n" +
    "    </p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("unpaywall.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("unpaywall.tpl.html",
    "<h1>unpaywall!</h1>");
}]);
