# intro-nodejs-part1


## Índice

0. [Uso de `this` y `bind()` en funciones y objetos en JavaScript](#0-uso-de-this-y-bind-en-funciones-y-objetos-en-javascript)

1. [Funciones y clausuras en JavaScript](#1-funciones-y-clausuras-en-javascript)

2. [Clausuras de variables y funciones](#2-clausuras-de-variables-y-funciones)

3. [Clausuras y funciones anidadas](#3-clausuras-y-funciones-anidadas)

4. [Uso de operaciones asíncronas con setTimeout](#4-uso-de-operaciones-asincronas-con-settimeout)

5. [Uso de setTimeout con cierre de variables](#5-uso-de-settimeout-con-cierre-de-variables)

6. [Uso de setTimeout con let](#6-uso-de-settimeout-con-let)

7. [Uso de setTimeout con var y let dentro del bucle](#7-uso-de-settimeout-con-var-y-let-dentro-del-bucle)

8. [Uso de setTimeout con for, let y IIFE](#8-uso-de-settimeout-con-for-let-y-iife)

9. [Uso de setTimeout con var y cierre de variables](#9-uso-de-settimeout-con-var-y-cierre-de-variables)

10. [Uso de setTimeout con paso de argumentos](#10-uso-de-settimeout-con-paso-de-argumentos)

11. [Uso de setTimeout con función auxiliar y closure](#11-uso-de-settimeout-con-funcion-auxiliar-y-closure)

---

## 0. Uso de `this` y `bind()` en funciones y objetos en JavaScript

**Código:** [`j00-this-bind.js`](./j00-this-bind.js/)

Ejemplo que muestra cómo funciona `this` en JavaScript, el uso de `bind()` y cómo el mismo código puede devolver distintos valores según el objeto desde el que se invoque.

#### Resultado de la ejecución:
```bash
> node .\j00-this-bind.js


obj01.valor:   -10
obj01.fun()():   -10
__________________________________________________________

fx1():   -10
obj02.valor:   fun no me referencia
obj02.fun():   -10
obj02.fan():   fun no me referencia
__________________________________________________________

obj01.valor:   nuevo valor
obj02.fun():   nuevo valor
obj02.fan():   fun no me referencia
```

#### Explicación:
**1. `this` depende del objeto que llama a la función**

El valor de `this` depende del **objeto desde el cual se invoca la función**, no de dónde fue definida.
```javascript
var obj02 = {
    valor: "fun no me referencia",
    fan: g
};

console.log(obj02.fan()); // "fun no me referencia"
```
- `g()` devuelve `this.valor`.
- Como `fan` se llama desde `obj02`, `this` apunta a `obj02` y devuelve `"fun no me referencia"`.

**2. `bind()` fija el contexto de `this`**

`bind()` crea una nueva función con `this` apuntando al objeto que se indique, **sin importar desde dónde se invoque**.  
```javascript
var gg = g.bind(obj01);
console.log(gg()); // -10
```
- Aunque se llame desde otra variable u objeto, `this` sigue apuntando a `obj01`.

**3. Guardar funciones en variables mantiene el binding**

Si guardamos la función devuelta por `obj01.fun()` en otra variable, `this` sigue atado al objeto original.
```javascript
fx1 = obj01.fun();
console.log(fx1()); // -10
```
- Aunque la llamemos desde `obj02` más tarde, seguirá apuntando a `obj01`.

**4. Cambiar propiedades del objeto afecta a todas las referencias que usan `bind()`**

Si modificamos `obj01.valor`, todas las funciones con `bind()` apuntando a `obj01` reflejarán el nuevo valor.

```javascript
obj01.valor = "nuevo valor";
console.log(obj02.fun()); // "nuevo valor"
```
- `bind()` mantiene el contexto, pero no copia los valores de las propiedades.

**5. Funciones sin `bind()` toman `this` dinámicamente**

Las funciones normales dependen del objeto desde donde se llaman.

```javascript
console.log(obj02.fan()); // "fun no me referencia"
```
- Cambiar `obj01` no afecta a `obj02.fan()`, porque no se aplicó `bind()`.

### Conclusiones resumidas de `j00-this-bind.js`

- `this` depende del objeto que llama a la función.
- `bind()` fija el contexto de `this` y lo mantiene aunque la función se asigne a otra variable.
- Cambiar propiedades del objeto original se refleja en todas las funciones se refleja en todas las funciones con `this` fijado a `obj01`.
- Funciones normales sin `bind()` toman `this` dinámicamente.
- `bind()` es útil para callbacks y eventos donde el contexto puede variar.
- Este comportamiento muestra que JavaScript interpreta y ejecuta funciones según el contexto en tiempo de ejecución.


## 1. Funciones y clausuras en JavaScript

**Código:** [`j01-funciones-clausuras.js`](./j01-funciones-clausuras.js/)

#### Resultado de la ejecución:
```bash
> node .\j01-funciones-clausuras.js
argumentos de f: 0  ---  100
función x:       0       100      Infinity
función w:       0       100     -1000
función ww:      0       100     -1000
ww(): -900
u=  Infinity
```

#### Explicación:
**1. Variables iniciales**
```javascript
var x;
var w, ww;
var u = Infinity;
```
- `x`, `w`, `ww` se declaran sin valor.
- `u` se declara globalmente con valor Infinity.

**2. Definición de `f(y,z)`**
- Dentro de `f` se crean las funciones:

- `x`: recuerda `y`, `z` y la variable global `u`.

- `w(u)`: tiene su propio parámetro `u` y además define `ww`, que usará ese `u` junto con `y` y `z`.

- `f` imprime los argumentos recibidos.

**3. Ejecución de `f(0,100)`**
- Se definen `x` y `w` con `y = 0` y `z = 100`.

**4. Llamada a `x()`**
- Usa `y = 0`, `z = 100` y la `u` global (`Infinity`).

**5. Llamada a `w(-1000)`**
- Usa `y = 0`, `z = 100`, `u = -1000` (parámetro local de `w`).
- Además, define `ww` con ese `u`.

**6. Llamada a `ww()`**
- `ww` usa `y = 0`, `z = 100`, `u = -1000`.  
- Imprime y devuelve `0 + 100 + (-1000) = -900`.

**7. Extra: variable global `u`**
- Aquí se imprime la `u` global, que sigue siendo `Infinity`.

### Conclusiones resumidas de `j01-funciones-clausuras.js`

- Las clausuras permiten que funciones internas recuerden el contexto de la función que las creó.  
- Variables de la función exterior (`y`, `z`) permanecen accesibles dentro de funciones internas.  
- Parámetros locales (`u`) pueden ocultar variables globales.  
- `ww` mantiene `y` y `z` de `f` y `u` de `w`, mostrando cómo funciona el entorno léxico en JavaScript.

## 2. Clausuras de variables y funciones

**Código:** [`j02-clausuras-variables-funciones.js`](./j02-clausuras-variables-funciones.js/)

##### Resultado de la ejecución:
```bash
> node .\j02-clausuras-variables-funciones.js
y: -99
incremento de x:  101
y+g():  2
y: -98
incremento de x:  102
y+g():  4
y: -97
incremento de x:  103
y+g():  6
```

### Conclusiones resumidas de `j02-clausuras.js`

- Una clausura recuerda las variables de su entorno, incluso después de que la función externa haya terminado.  
- En este caso, `z` mantiene acceso a `y` y `x`.  
- Cada llamada a `z()` sigue modificando los mismos `y` y `x`, mostrando cómo las clausuras permiten manejar estados internos de forma privada.  

## 3. Clausuras y funciones anidadas

**Código:** [`j03-clausuras-avanzadas.js`](./j03-clausuras-avanzadas.js/)

#### Resultado de la ejecución:
```bash
> node .\j03-clausuras-avanzadas.js
        traza:  inicio
g1: incremento de y:  -99
        traza:  inicio-g1
g0: incremento de x:  2
        traza:  inicio-g1-g0
g1: incremento de y:  -97
        traza:  inicio-g1-g0-g1
g0: incremento de x:  4
        traza:  inicio-g1-g0-g1-g0
g1: incremento de y:  -95
        traza:  inicio-g1-g0-g1-g0-g1
g0: incremento de x:  6
        traza:  inicio-g1-g0-g1-g0-g1-g0
g1: incremento de y:  -93
        traza:  inicio-g1-g0-g1-g0-g1-g0-g1
g0: incremento de x:  8
        traza:  inicio-g1-g0-g1-g0-g1-g0-g1-g0
g1: incremento de y:  -91
        traza:  inicio-g1-g0-g1-g0-g1-g0-g1-g0-g1
g0: incremento de x:  10
        traza:  inicio-g1-g0-g1-g0-g1-g0-g1-g0-g1-g0
-100
```
#### Explicación:

**Primera iteración (`main(-100)`):**  
- `y = -100`  
- `x = 100 + (-100) = 0` → par → `x % 2 == 0` → llama a `g1()`  

`g1()` hace:  
- `traza += "-g1"` → `"inicio-g1"`  
- `y++` → `y = -99`  
- `return f(y)` → llama `f(-99)`  

**Segunda iteración (`f(-99)`):**  
- `x = 100 + (-99) = 1` → impar → llama a `g0()`  

`g0()` hace:  
- `traza += "-g0"` → `"inicio-g1-g0"`  
- `x++` → `x = 2`  
- `return f(++y)` → `y = -98`, llama `f(-98)`  


**Patrón:**  
- Se alternan `g1` y `g0` porque `x` alterna par/impar.  
- Cada `g1` incrementa `y`.  
- Cada `g0` incrementa `x`.  
- `traza` acumula el historial de llamadas. 

### Conclusiones resumidas de `j03-clausuras-avanzadas.js`

- La variable `traza` acumula el historial de llamadas (`g1`, `g0`) y muestra cómo se conserva el estado entre ejecuciones.  
- El flujo alterna entre `g1` y `g0` porque `x` cambia entre par e impar.  
- La práctica muestra cómo las clausuras permiten mantener y manipular múltiples estados internos de forma independiente (como `y`, `x` y `traza`).  
- `console.log(gety())` imprime `-100` porque `gety` apunta a `getY()`, que devuelve la `y` original de `main`. 
- Los incrementos de `y` en `f` y `g1` no afectan a esa `y` inicial, solo a las copias locales.  

## 4. Uso de operaciones asíncronas con setTimeout

**Código:** [`j04-settimeout-asincrono.js`](./j04-settimeout-asincrono.js/)

#### Resultado de la ejecución:
```bash
> node .\j04-settimeout-asincrono.js
Terminado codigo script  valor actual de i:  10
10
10
10
10
10
10
10
10
10
10
```

#### Explicación:

- El `for` se ejecuta inmediatamente, incrementando `i` hasta que vale `10`.  
- Cuando acaba el bucle, la variable `i` ya es `10`.  
- `setTimeout(...)` no ejecuta la función en ese momento, sino que la agenda para más tarde.  
- Todas las funciones que has pasado a `setTimeout` son **closures** que capturan la misma `i` (la del ámbito global del bucle).  
- Como `i` ya vale `10` cuando se ejecutan los `setTimeout`, todas imprimen `10`, no `0, 1, 2...`.  

### Conclusiones resumidas de `j04-asincronas-settimeout.js`

- `setTimeout` agenda la ejecución de funciones para después del flujo principal.  
- Todas las funciones acceden a la misma variable `i` debido a closures.  
- Muestra cómo Node.js maneja asincronía y el event loop.

## 5. Uso de setTimeout con cierre de variables

**Código:** [`j05-settimeout-clausura.js`](./j05-settimeout-clausura.js/)

#### Resultado de la ejecución:

```bash
> node .\j05-settimeout-clausura.js 
Terminado codigo script  valor actual de i:  10
índice:  0
índice:  1
índice:  2
índice:  3
índice:  4
índice:  5
índice:  6
índice:  7
índice:  8
índice:  9
```

#### Explicación:

- El `for` corre de inmediato, dejando `i = 10` al terminar.  
- Cada llamada a `setTimeout` recibe como *callback* el resultado de ejecutar la función anónima con el valor actual de `i`.  
- Es decir, en cada iteración se ejecuta `function(índice){ ... }(i)` en cada iteración.

- Eso devuelve otra función (**un closure**) que recuerda el valor concreto de `índice`.

- Ahora cada temporizador tiene su propia copia de `índice` (`0, 1, 2, …, 9`).

- Por eso, cuando se ejecutan los `setTimeout`, imprimen los valores correctos en lugar de todos `10`.


### Conclusiones resumidas de `j05-settimeout-clausura.js`

- Las clausuras capturan el valor de cada iteración del bucle.  
- Cada callback conserva su propio estado independiente.  
- Evita el problema de la práctica 4, donde todos compartían la misma `i`.  
- Ejemplo de cómo combinar asincronía con closures en Node.js.

## 6. Uso de setTimeout con let

**Código:** [`j06-settimeout-let.js`](./j06-settimeout-let.js/)

#### Resultado de la ejecución:
```bash
> node .\j06-settimeout-let.js     
Terminado codigo script  valor actual de i:  10
10
10
10
10
10
10
10
10
10
10
```

#### Explicación de la práctica `j06-settimeout-let.js`

- Aquí se usa `let` en lugar de `var` para declarar `i`.

- La diferencia clave es que `let` crea un nuevo *binding* de `i` en cada iteración del bucle.

- Cada callback de `setTimeout` captura el valor propio de `i` en esa iteración.

- Por eso los `setTimeout` imprimen correctamente `0, 1, 2, ..., 9`.

- Con `var` (como en la práctica 4), todos los callbacks compartían la misma `i` y se imprimía siempre `10`.

### Conclusiones resumidas de `j06-settimeout-let.js`

- `let` soluciona el problema de cierre de variables en bucles asincrónicos.  
- Cada iteración conserva su propio valor de `i`. 

## 7. Uso de setTimeout con var y let dentro del bucle

**Código:** [`j07-settimeout-var-let.js`](./j07-settimeout-var-let.js/)

#### Resultado de la ejecución:
```bash
> node .\j07-settimeout-var-let.js
Terminado codigo script    valor actual de i:  10
0
1
2
3
4
5
6
7
8
9
```

En este ejemplo se usa `var` para la variable `i`, pero dentro del bucle se declara `let k = i`.  

De esta manera:  

- `i` se comporta como una variable global al bucle (`var` no crea un nuevo binding en cada iteración).  
- Pero `k` es un nuevo binding en cada iteración gracias a `let`.  
- Cada callback de `setTimeout` captura su propio `k`, que mantiene el valor correcto en cada iteración (0, 1, 2, ..., 9).  

Así se consigue el mismo resultado que en la práctica 6, pero usando una variable auxiliar `k`.  

### Conclusiones resumidas de `j07-settimeout-var-let.js`

- `var` no es adecuado para bucles asincrónicos porque no crea un binding nuevo en cada iteración.  
- Al introducir `let` dentro del bucle (en `k`), cada callback tiene su propia copia.  
- Es una solución alternativa al uso directo de `let` en la variable del bucle.  

## 8. Uso de setTimeout con for, let y IIFE

**Código:** [`j08-settimeout-for-let.js`](./j08-settimeout-for-let.js/)

#### Resultado de la ejecución:
```bash
> node .\j08-settimeout-for-let.js
Terminado codigo script
0
1
2
3
4
5
6
7
8
9
```

En este ejemplo se combina:

- `let i` en el `for`, lo que ya garantiza que cada iteración tenga su propio valor de `i`.  
- Una **IIFE (Immediately Invoked Function Expression)** que recibe `i` como parámetro (`function(x){ ... }(i)`), devolviendo un closure que recuerda ese valor.  

Esto hace que cada `setTimeout` tenga su copia propia de `i`, exactamente como en prácticas anteriores.  
En este caso, la IIFE es redundante, porque `let` ya soluciona el problema por sí mismo.

Esa línea `console.log("i= ",i);` provocaría un error de referencia (`ReferenceError: i is not defined`).

Esto se debe a que `i` fue declarada con `let` dentro del `for`, y su ámbito es solo el bucle.

A diferencia de `var`, no se "filtra" al ámbito exterior.

#### Conclusiones resumidas de `j08-settimeout-for-let-iife.js`

- `let` dentro del `for` ya crea un binding nuevo de `i` en cada iteración.  
- La IIFE asegura el mismo efecto, pero aquí resulta innecesaria.  
- Intentar acceder a `i` fuera del `for` da error porque está fuera de su ámbito.

## 9. Uso de setTimeout con var y cierre de variables

**Código:** [`j09-settimeout-var-clausura.js`](./j09-settimeout-var-clausura.js/)

#### Resultado de la ejecución:
```bash
> node .\j09-settimeout-var-clausura.js
Terminado codigo script    valor actual de i:  10
índice:   0   i:   10
índice:   1   i:   10
índice:   2   i:   10
índice:   3   i:   10
índice:   4   i:   10
índice:   5   i:   10
índice:   6   i:   10
índice:   7   i:   10
índice:   8   i:   10
índice:   9   i:   10
```

- El `for` usa `var i`, que tiene **ámbito de función**, así que todos los `setTimeout` comparten la misma `i`. Al final del bucle, `i = 10`.

- La IIFE `(function(índice){ ... })(i)` crea un **closure** para capturar el valor actual de `i` en `índice`.

- Cada `setTimeout` se ejecuta después de `i * 1000` ms, mostrando `índice` correcto (0–9) y `i` siempre 10.

- El `console.log` final se ejecuta **antes** de los `setTimeout`, mostrando `i = 10`.

### Conclusiones resumidas de `j09-settimeout-var-clausura.js`

- La IIFE permite capturar el valor de la iteración (`índice`) en un closure.  
- La variable `i` sigue siendo compartida y su valor final se refleja en todos los callbacks.  
- Este patrón combina asincronía y closures para mantener valores individuales en bucles con `var`.

## 10. Uso de setTimeout con paso de argumentos

**Código:** [`j10-settimeout-args.js`](./j10-settimeout-args.js/)

#### Resultado de la ejecución:
```bash
> node .\j10-settimeout-args.js
Terminado codigo script    valor actual de i:  10
índice:   0   i:   10
índice:   1   i:   10
índice:   2   i:   10
índice:   3   i:   10
índice:   4   i:   10
índice:   5   i:   10
índice:   6   i:   10
índice:   7   i:   10
índice:   8   i:   10
índice:   9   i:   10
```

- Aquí se usa el tercer parámetro de `setTimeout` para pasar argumentos a la función callback.

- La función callback recibe `índice`, pero dentro del closure se sigue usando `i`, que es `var` y está compartida.

- Como `i` ya vale 10 cuando se ejecutan los temporizadores, todos los logs muestran `i: 10`.

- Los valores de `índice` provienen del argumento que pasa `setTimeout` y son correctos (0 a 9).

### Conclusiones resumidas de `j10-settimeout-args.js`

- Pasar argumentos a `setTimeout` no soluciona el problema de `var` compartida.  
- Cada callback recibe su propio `índice` correctamente, pero `i` sigue siendo compartida.  
- Muestra cómo combinar argumentos con closures y temporizadores en Node.js.

## 11. Uso de setTimeout con función auxiliar y closure

**Código:** [`j11-settimeout-funcion.js`](./j11-settimeout-funcion.js/)

#### Resultado de la ejecución:
```bash
> node .\j11.js                
Terminado codigo script    valor actual de i:  10
índice:   0   i:   10
índice:   1   i:   10
índice:   2   i:   10
índice:   3   i:   10
índice:   4   i:   10
índice:   5   i:   10
índice:   6   i:   10
índice:   7   i:   10
índice:   8   i:   10
índice:   9   i:   10
```

- La función `tempo` recibe el valor de `índice` como argumento en cada iteración.

- Dentro de `setTimeout`, la función callback recuerda `índice` gracias al parámetro de `tempo` (closure).

- La variable `i` sigue siendo global y compartida (`var`), así que todos los callbacks ven `i = 10`.

- Cada `setTimeout` imprime correctamente `índice` (0 a 9) y siempre `i = 10`.

### Conclusiones resumidas de j11-settimeout-funcion

- Pasar el valor como argumento a otra función permite crear closures que recuerdan la iteración.
- La variable global `i` sigue compartida, mostrando su valor final en todos los callbacks.
- Este patrón es útil para evitar problemas de bucles con `var` en callbacks asincrónicos.


