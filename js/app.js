var app = angular.module("app", ["ngRoute"]);

// Routing
app.config(function($routeProvider, $locationProvider) {
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

app.controller("currencyController", function($scope, dataFactory) {
  $scope.base = "PLN";
  $scope.getData = function() {
    dataFactory.getJSONFromFile("/js/currency-fullnames.json").then(
      function(response) {
        $scope.fullnames = response.data.fullnames;
        $scope.names = Object.keys($scope.fullnames);

        dataFactory.getRates($scope.base).then(
          function(response) {
            $scope.rates = getFormattedRates(response.data.rates);
          },
          function(error) {
            console.log(error.message);
          }
        );
      },
      function(error) {
        console.log(error.message);
      }
    );

    $scope.sortType = localStorage.getItem("sortType");
    $scope.sortReverse = JSON.parse(localStorage.getItem("sortReverse"));
  };

  $scope.setSorting = function(type) {
    localStorage.setItem("sortType", type);

    if (type == localStorage.sortType) {
      localStorage.sortReverse =
        localStorage.sortReverse == "true" ? false : true;
    } else {
      localStorage.sortReverse = false;
    }
  };

  var getFormattedRates = function(data) {
    var formatted = [];
    var names = Object.keys(data);
    var rates = Object.values(data);

    for (var i = 0; i < names.length; i++) {
      formatted.push({
        name: names[i],
        fullname: $scope.fullnames[names[i]],
        rate: rates[i]
      });
    }
    return formatted;
  };
});

app.factory("dataFactory", function($http) {
  var dataFactory = {};
  var currencyApi = "https://api.fixer.io/latest?base=";

  dataFactory.getJSONFromFile = function(filePath) {
    return $http.get(filePath);
  };

  dataFactory.getRates = function(baseCurrency) {
    var request = currencyApi + baseCurrency;
    return $http.get(request);
  };

  return dataFactory;
});
