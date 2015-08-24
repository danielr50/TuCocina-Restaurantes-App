// modulo para de la app para crear los controladores
var app = angular.module('tuCocina.controllers', ['LocalStorageModule']);

//controlar para asignar la mesa
app.controller('mesaController', function($scope, $ionicPopup, $timeout, $location, localStorageService){
	// Triggered on a button click, or some other target
	$scope.showPopup = function() {
	  $scope.data = {}

	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input style="border: 1px black dashed;" type="text" ng-model="data.numMesa">',
	    title: 'Numero de la mesa',
	    subTitle: 'Por favor ingrese el numero de la mesa asignada',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancelar' },
	      {
	        text: '<b>Guardar</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data.numMesa) {
	            //don't allow the user to close unless he enters numMesa password
	            e.preventDefault();
	          } else {
	            return $scope.data.numMesa;
	          }
	        }
	      }
	    ]
	  });
	  myPopup.then(function(res) {
	    console.log('Mesa!', res);
	    localStorageService.set('numMesa', res);
	    $location.url('/home');
	  });
	  // $timeout(function() {
	  //    myPopup.close(); //close the popup after 3 seconds for some reason
	  // }, 3000);
	 };
})

//controlador intro
app.controller('introController', function($scope, $state){
	 // Called to navigate to the main app
	var startApp = function() {
	    $state.go('home');

	    // Set a flag that we finished the tutorial
	    window.localStorage['didTutorial'] = true;
	};

	 // Move to the next slide
  	$scope.next = function() {
   		$scope.$broadcast('slideBox.nextSlide');
 	 };

 	   // Our initial right buttons
  	var rightButtons = [
	    {
	      content: 'STOP SLIDING',
	      type: 'button-positive',
	      tap: function(e) {
	        // Stop sliding
	        $scope.slideBox.stop();
	      }
	    },
	    {
	      content: 'Next',
	      type: 'button-positive button-clear',
	      tap: function(e) {
	        // Go to the next slide on tap
	        $scope.next();
	      }
	    }
  	];

  	  // Our initial left buttons
	  var leftButtons = [
	    {
	      content: 'Skip',
	      type: 'button-positive button-clear',
	      tap: function(e) {
	        // Start the app on tap
	        startApp();
	      }
	    }
	  ];

	   // Bind the left and right buttons to the scope
  	$scope.leftButtons = leftButtons;
  	$scope.rightButtons = rightButtons;

	  	// Called each time the slide changes
	  $scope.slideChanged = function(index) {

	    // Check if we should update the left buttons
	    if(index > 0) {
	      // If this is not the first slide, give it a back button
	      $scope.leftButtons = [
	        {
	          content: 'Back',
	          type: 'button-positive button-clear',
	          tap: function(e) {
	            // Move to the previous slide
	            $scope.$broadcast('slideBox.prevSlide');
	          }
	        }
	      ];
	    } else {
	      // This is the first slide, use the default left buttons
	      $scope.leftButtons = leftButtons;
	    }
	    
	    // If this is the last slide, set the right button to
	    // move to the app
	    if(index == 2) {
	      $scope.rightButtons = [
	        {
	          content: 'Start using MyApp',
	          type: 'button-positive button-clear',
	          tap: function(e) {
	            startApp();
	          }
	        }
	      ];
	    } else {
	      // Otherwise, use the default buttons
	      $scope.rightButtons = rightButtons;
	    }
	  };
}); //fin introControler

//Controlador home
app.controller('homeController', function($scope, $state, $location) {
  $scope.toIntro = function(){
    window.localStorage['didTutorial'] = "false";
    $state.go('intro');
  }

  // $scope.menuCategoria = function(){
  // 	$location.url('/menu-cetegorias');
  // }
});//fin homeControler

// controlador para gestionar las categorias del menu
app.controller('menuCategoriasController', function($scope, $http, $location, localStorageService){
	//traigo todas las cateorias del restaurante
	$http.get('https://api-tucocina.herokuapp.com/api/categorias')
		.success(function(data){
			console.log(data);
			$scope.categorias = data;
		})
		.error(function(err){
			console.log(err);
		});


	$scope.list_platos = function(id){
		localStorageService.set('idPlato', id);
		$location.url('platos');
	}

	$scope.par = function(num){
		if(num % 2 == 1){
			return true;
		}else{
			return false;
		}
	}
});// fin menuCategoriasController

// controlador para gestionar los platos
app.controller('platosController', function($scope, $http, $location, localStorageService){
	id = localStorageService.get('idPlato');
	$http.get('https://api-tucocina.herokuapp.com/api/platos/'+id)
		.success(function(data){
			console.log(data);
			$scope.platos = data;
		})
		.error(function(err){
			console.log(err);
		});

	$scope.ingre = function(id_plato){
		localStorageService.set('idPlato', id_plato);
		$location.url('/pedidos');
	}
});//fin platosController

// controlador para gestionar los pedidos
app.controller('pedidosController', function($scope, $location, $http, localStorageService){
	//traigo todos los ingredientes de un plato
	idplato = localStorageService.get('idPlato');
	$http.get('https://api-tucocina.herokuapp.com/api/ingredientes/'+idplato)
		.success(function(data){
			console.log(data);
			$scope.ingredientes = data;
		})
		.error(function(err){
			console.log(err);
		});

	$scope.resumen = function(){
		$location.url('/resumen');
	}
});//fin pedidosController

// controlador para gestionar el resumen del pedido
app.controller('resumenController', function($scope, $ionicPopup, $timeout){
	$scope.hacerPedido = true;
	// A confirm dialog
 $scope.confirmarPedido = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmación de envío',
     template: 'Estas seguro que deseas hacer el pedido?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('Dijo que si');
        var alertPopup = $ionicPopup.alert({
	    title: 'Enviado!',
	    template: 'Su pedido ha sido enviado con éxito!'
	   	});
	   	alertPopup.then(function(res) {
	     	console.log('Se fue el pedido xD');
	     	$scope.hacerPedido = false;
	  	 });

     } else {
       console.log('Dijo que no');
     }
   });
 };
}); //fin resumenController


