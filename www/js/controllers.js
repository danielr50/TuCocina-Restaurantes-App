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
app.controller('homeController', function($scope, $state, $location,localStorageService) {
  $scope.toIntro = function(){
    window.localStorage['didTutorial'] = "false";
    $state.go('intro');
  }

  localStorageService.set('numPedido', 1);

  // $scope.menuCategoria = function(){
  // 	$location.url('/menu-cetegorias');
  // }
});//fin homeControler

// controlador para gestionar las categorias del menu
app.controller('menuCategoriasController', function($scope, $http, $location, localStorageService, $ionicLoading, $timeout){
	// Setup the ionic loader
	  $ionicLoading.show({
	    content: 'Loading',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 0
	  });
	
	//traigo todas las cateorias del restaurante
	$http.get('https://api-tucocina.herokuapp.com/api/categorias')
		.success(function(data){
			$ionicLoading.hide();

			console.log(data);
			// guardo lo que me llega en categorias
			$scope.categorias = data;

			// funcion para cortar el array que llega
			// para desplegarlo en dos columnas
			function chunk(arr, size) {
			  var newArr = [];
			  for (var i=0; i<arr.length; i+=size) {
			    newArr.push(arr.slice(i, i+size));

			  }
			  console.log(newArr);
			  return newArr;
			}
			$scope.chunkedData = chunk($scope.categorias, 2);
		
		})
		.error(function(err){
			console.log(err);

		});	


		

	$scope.list_platos = function(id){
		localStorageService.set('idPlato', id);
		console.log(id);
		$location.url('platos');
	}


	
	



});// fin menuCategoriasController

// controlador para gestionar los platos
app.controller('platosController', function($scope, $http, $location, localStorageService){
	id = localStorageService.get('idPlato');
	$http.get('https://api-tucocina.herokuapp.com/api/platos_categorias/'+id)
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
app.controller('pedidosController', function($scope, $location, $http, localStorageService, $timeout, $ionicLoading){
	// Setup the loader
	  $ionicLoading.show({
	    content: 'Loading',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 0
	  });

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

	$http.get('https://api-tucocina.herokuapp.com/api/platos/'+idplato)
		.success(function(data){
			$ionicLoading.hide();

			console.log("Plato");
			console.log(data);
			$scope.plato = data;
			localStorageService.set('valorPlato', data.valor);
		})
		.error(function(err){
			console.log(err);
		});

	$http.get('https://api-tucocina.herokuapp.com/api/adicionales/'+idplato)
		.success(function(data){
			$scope.adicionales = data;
		})
		.error(function(err){
			console.log(err);
		});



	$scope.noSelect = function(ingre){
		
		// localStorageService.set('ingrediente', ingre);
		// console.log(ingre);
	}



	$scope.activo = false;

	$scope.ingredientesSeleccionados = function(valor){
		console.log('Cambio');
		if (!$scope.activo) {
			$scope.activo = true;
			$scope.plato.valor +=  valor;
		}else{
			$scope.activo = false;
			$scope.plato.valor -=  valor;
		}

		// if ($scope.activo) {
		// 	$scope.plato.valor +=  valor;
		// }else{
		// 	$scope.plato.valor -=  valor;
		// }
	}
	$scope.cantidad = 1;
	 localStorageService.set('cantidad', $scope.cantidad);
	$scope.mas = function(){
		var precio = localStorageService.get('valorPlato');
		$scope.cantidad += +1;
		$scope.plato.valor += precio;
		localStorageService.set('cantidad', $scope.cantidad);
		console.log($scope.plato.valor);
	}
	$scope.menos = function(){
		var precio = localStorageService.get('valorPlato');
		$scope.cantidad += -1;
		$scope.plato.valor -= precio;
		localStorageService.set('cantidad', $scope.cantidad);
		console.log($scope.plato.valor);
	}

	$scope.resumen = function(){
		divCont = document.getElementById('dinamicos');
		checks  = divCont.getElementsByTagName('input');
		console.log(checks.length);
		var ingre = [];
		for(var i =0; i < checks.length; i++){
		    if(checks[i].checked == true){
		    	console.log('valor de i: '+i);
		    	var  text = checks[i].value;
		    	ingre[i] = text;
		    	
		    }
		}
		console.log('Seleccionados: '+text);
		console.log(ingre);

		var mesa = localStorageService.get('numMesa');
		var numPedido = localStorageService.get('numPedido');
		var cantidad = localStorageService.get('cantidad');

		// creo un objeto con los datos del pedido
		var pedido = {
			plato: $scope.plato.nombrePlato,
			precio: $scope.plato.valor,
			mesa: mesa,
			cantidad: cantidad
		};
		localStorageService.set('pedido-'+numPedido, pedido);

		// var numPedido = localStorageService.get('numPedido');
		numPedido = numPedido+1;
		localStorageService.set('numPedido', numPedido);

		$location.url('/resumen');
	}
});//fin pedidosController

// controlador para gestionar el resumen del pedido
app.controller('resumenController', function($scope, $ionicPopup, $timeout, $location, localStorageService, $ionicLoading, $http){
	$scope.hacerPedido = true;
	$scope.precioFinal = 0;
	// listar pedidos
	var pedido = localStorageService.get('pedido');
	var numPedido = localStorageService.get('numPedido');
	var pedidos = [];
	for(var i = 1; i <= numPedido; i++){
		var mypedido = localStorageService.get('pedido-'+i);
		pedidos[i] = mypedido;
		// $scope.precioFinal += pedido.precio;
		if(mypedido != null){
			console.log('pedido: '+mypedido.precio);
			$scope.precioFinal = $scope.precioFinal + mypedido.precio;
			localStorageService.set('precioFinal', $scope.precioFinal);
		}
	}

	console.log(pedidos);

	// Setup the loader
	  $ionicLoading.show({
	    content: 'Loading',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 0
	  });
		  
	  // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
	  $timeout(function () {
	    $ionicLoading.hide();
		$scope.pedido = pedidos.filter(Boolean);
	  }, 2000);

	$scope.otro_plato = function(){
		$location.url('/menu-categorias');
	}

// A confirm dialog
 $scope.confirmarPedido = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmación de envío',
     template: 'Estas seguro que deseas hacer el pedido?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('Dijo que si');
       // envio el pedido
       	var pedido = localStorageService.get('pedido');
		var numPedido = localStorageService.get('numPedido');
		var pedidos = [];
		for(var i = 1; i <= numPedido; i++){
			var mypedido = localStorageService.get('pedido-'+i);
			pedidos[i] = mypedido;
			// $scope.precioFinal += pedido.precio;
		}
		var precioFinal = localStorageService.get('precioFinal');

		var pedidoFinal = pedidos.filter(Boolean);

		var pedido = {
			pedido: pedidoFinal,
			precioFinal: precioFinal
		};

		$http.post('https://api-tucocina.herokuapp.com/api/pedidos', pedido)
			.success(function(data){
				console.log(data);
				var alertPopup = $ionicPopup.alert({
			    title: 'Enviado!',
			    template: 'Su pedido ha sido enviado con éxito!'
			   	});
			   	alertPopup.then(function(res) {
			     	console.log('Se fue el pedido xD');

			     	var pedido = localStorageService.get('pedido');
					var numPedido = localStorageService.get('numPedido');
					var pedidos = [];
					for(var i = 1; i <= numPedido; i++){
						var mypedido = localStorageService.remove('pedido-'+i);
					}

			     	$scope.hacerPedido = false;
			     	localStorageService.set('numPedido', 1);
			     	localStorageService.remove('precioFinal', 'valorPlato', 'idPlato', 'cantidad');
					$location.url('/home');
			  	});
				})
			.error(function(err){
				console.log(err);
			});

     } else {
       console.log('Dijo que no');
     }
   });
 };
}); //fin resumenController


