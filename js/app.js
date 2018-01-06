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
  $scope.names = [
    "PLN",
    "EUR",
    "USD",
    "GBP",
    "CHF",
    "AUD",
    "BGN",
    "BRL",
    "CAD",
    "CNY",
    "CZK",
    "DKK",
    "HKD",
    "HRK",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "JPY",
    "KRW",
    "MXN",
    "MYR",
    "NOK",
    "NZD",
    "PHP",
    "RON",
    "RUB",
    "SEK",
    "SGD",
    "THB",
    "TRY",
    "ZAR"
  ];

  $scope.base = $scope.names[0];

  $scope.getData = function () {
    dataFactory.getCurrencies($scope.base).then(
      function (response) {
        $scope.currencies = getCurrencyArray(response.data.rates);
      },
      function (error) {
        console.log(error.message);
      }
    );

    $scope.sortType = localStorage.getItem("sortType");
    $scope.sortReverse = JSON.parse(localStorage.getItem("sortReverse"));
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

  $scope.setSorting = function (type) {
    localStorage.setItem("sortType", type);

    if (type == localStorage.sortType) {
      localStorage.sortReverse = localStorage.sortReverse == "true" ? false : true;
    } else {
      localStorage.sortReverse = false;
    }
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