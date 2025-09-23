// j07-settimeout-var-let.js: 7. Uso de setTimeout con var y let dentro del bucle
// Uso de operaciones asíncronas, aquí modeladas con la función setTimeout.
//Note el valor de i asociado a las ejecuciones de las temporizaciones.
//Uso de la sentencia let.

var i = 0;

do {
	let k = i;
	setTimeout(function(){console.log(k)},k*1000);
	i++;
    
} while (i<10);

console.log("Terminado codigo script","   valor actual de i: ",i);
