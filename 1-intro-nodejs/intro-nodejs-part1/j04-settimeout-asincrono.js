
// j04-settimeout-asincrono.js: Uso de operaciones asíncronas con setTimeout
// Note el valor de i asociado a las ejecuciones de las temporizaciones.


for(var i=0; i<10; i++) setTimeout(function(){console.log(i)},i*1000);


console.log("Terminado codigo script  valor actual de i: ",i);
