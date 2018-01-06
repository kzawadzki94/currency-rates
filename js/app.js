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
  $scope.countries = {
    PLN: "polski złoty",
    EUR: "euro",
    USD: "dolar amerykański",
    GBP: "funt brytyjski",
    CHF: "frank szwajcarski",
    AUD: "dolar australijski",
    BGN: "lew bułgarski",
    BRL: "real brazylijski",
    CAD: "dolar kanadyjski",
    CNY: "chiński Juan (Renminbi)",
    CZK: "korona czeska",
    DKK: "korona duńska",
    HKD: "dolar hongkoński",
    HRK: "kuna chorwacka",
    HUF: "forint węgierski",
    IDR: "rupia indonezyjska",
    ILS: "nowy szekel izraelski",
    INR: "rupia indyjska",
    JPY: "jen japoński",
    KRW: "won południowokoreański",
    MXN: "peso meksykańskie",
    MYR: "ringgit malezyjski",
    NOK: "korona norweska",
    NZD: "dolar nowozelandzki",
    PHP: "peso filipińskie",
    RON: "nowa leja rumuńska",
    RUB: "rubel rosyjski",
    SEK: "korona szwedzka",
    SGD: "dolar singapurski",
    THB: "baht tajski",
    TRY: "nowa lira turecka",
    ZAR: "rand południowoafrykański"
  };

  $scope.names = Object.keys($scope.countries);
  $scope.base = $scope.names[0];

  $scope.getData = function() {
    dataFactory.getCurrencies($scope.base).then(
      function(response) {
        $scope.currencies = getCurrencyArray(response.data.rates);
      },
      function(error) {
        console.log(error.message);
      }
    );

    $scope.sortType = localStorage.getItem("sortType");
    $scope.sortReverse = JSON.parse(localStorage.getItem("sortReverse"));
  };

  var getCurrencyArray = function(data) {
    var formatted = [];
    var names = Object.keys(data);
    var rates = Object.values(data);

    for (var i = 0; i < names.length; i++) {
      formatted.push({
        name: names[i],
        fullname: $scope.countries[names[i]],
        rate: rates[i]
      });
    }
    return formatted;
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
});

app.factory("dataFactory", function($http) {
  var dataFactory = {};
  var currencyApi = "https://api.fixer.io/latest?base=";

  dataFactory.getCurrencies = function(baseCurrency) {
    var request = currencyApi + baseCurrency;
    return $http.get(request);
  };

  return dataFactory;
});
