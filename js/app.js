var app = angular.module("app", ["ngRoute"]);

// Routing
app.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");

    $routeProvider
        .when("/", {
            redirectTo: "currencies"
        })
        .when("/currencies", {
            templateUrl: "/views/currencies.html"
        })
        .when("/crypto", {
            templateUrl: "/views/crypto.html"
        })
        .otherwise({
            redirectTo: "/currencies"
        });
});