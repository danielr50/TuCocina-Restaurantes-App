// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('tuCocina', ['ionic', 'ngCordova', 'tuCocina.controllers', 'tuCocina.services'])

// viene por default con ionic -  
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// router
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('intro', {
      url: '/',
      controller: 'introController'
    })
    .state('mesa', {
      url: '/mesa',
      templateUrl: 'partials/mesa.html',
      controller: 'mesaController'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'partials/home.html',
      controller: 'homeController'
    })
    .state('menu-categorias', {
      url: '/menu-categorias',
      templateUrl: 'partials/menu-categorias.html',
      controller: 'menuCategoriasController'
    })
    .state('platos', {
      url: '/platos',
      templateUrl: 'partials/platos.html',
      controller: 'platosController'
    })
    .state('pedidos', {
      url: '/pedidos',
      templateUrl: 'partials/pedidos.html',
      controller: 'pedidosController'
    })
    .state('resumen', {
      url: '/resumen',
      templateUrl: 'partials/resumen.html',
      controller: 'resumenController'
    });

    $urlRouterProvider.otherwise('/mesa');
});