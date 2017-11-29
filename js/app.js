var app = angular.module("app", ["ngRoute"]);

// Routing
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/", {
      redirectTo: "currencies"
    })
    .when("/currencies", {
      templateUrl: "/views/currencies.html",
      controller: "currencyController"
    })
    .when("/crypto", {
      templateUrl: "/views/crypto.html"
    })
    .otherwise({
      redirectTo: "/currencies"
    });
});

app.controller("currencyController", function ($scope, dataFactory) {
  $scope.base = "USD";

  $scope.getData = function () {
    dataFactory.getCurrencies($scope.base).then(
      function (response) {
        $scope.currencies = getCurrencyArray(response.data.rates);
      },
      function (error) {
        console.log(error.message);
      }
    );
  };

  var getCurrencyArray = function (data) {
    var formatted = [];
    var names = Object.keys(data);
    var rates = Object.values(data);

    for (var i = 0; i < names.length; i++) {
      formatted.push({
        name: names[i],
        rate: rates[i]
      });
    }

    return formatted;
  };
});

app.factory("dataFactory", function ($http) {
  var dataFactory = {};
  var currencyApi = "https://api.fixer.io/latest?base=";

  dataFactory.getCurrencies = function (baseCurrency) {
    var request = currencyApi + baseCurrency;
    return $http.get(request);
  };

  return dataFactory;
});