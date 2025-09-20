# intro-nodejs-part1


## Índice

0. [Uso de `this` y `bind()` en funciones y objetos en JavaScript](#0-uso-de-this-y-bind-en-funciones-y-objetos-en-javascript)

1. [Funciones y clausuras en JavaScript](#1-funciones-y-clausuras-en-javascript)

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