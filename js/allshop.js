const IVA = 0.21
numCuotasSinInteres = 3
let btnVerTodo = document.getElementById('verTodo') // Botón filtrar 'VER TODO'
let btnRemeras = document.getElementById('remeras') // Botón filtrar 'REMERAS'
let btnBuzos = document.getElementById('buzos') // Botón filtrar 'BUZOS'
let btnPantalones = document.getElementById('pantalones') // Botón filtrar 'PANTALONES'
let showAllShop = document.getElementById('showAllShop') //Contenedor de la seccion 'PRODUCTOS'
let bodyCarrito = document.getElementById('bodyCarrito') // Contenedor del carrito
let cantProductos = document.getElementById('cantProductos') // Contador Carrito
let carrito;
let alertCarrito = document.createElement("h2") /* Alerta carrito vacío */
alertCarrito.setAttribute("class", "carrito_vacio")

// VERIFICACIÓN DE CARRITO EN LOCALSTORAGE

if (JSON.parse(localStorage.getItem('carrito'))) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    cantProductos.innerText = carrito.length
}
else {
    carrito = []
    localStorage.setItem('carrito', JSON.stringify(carrito))
    carrito = JSON.parse(localStorage.getItem('carrito'))
}

// VACIAR LOCALSTORAGE
function vaciarLocalStorage() {
    carrito = []
        localStorage.setItem('carrito', JSON.stringify(carrito))
        bodyCarrito.innerHTML = ``
        cantProductos.innerText = carrito.length
        mostrarCarritoVacio()
}


// MOSTRAR CARRITO VACÍO
function mostrarCarritoVacio() {

    if (!carrito.length) {
        alertCarrito.innerText = ("El carrito está vacío")
        bodyCarrito.append(alertCarrito)
    }

}

mostrarCarritoVacio()


// PETICIÓN PARA OBTENER PRODUCTOS DISPONIBLES
const fetchMostrarProductos = () => {
    fetch('../productos.json').then((response) => response.json())
    .then((resultado) => {   
    mostrarTodosLosProductos(resultado.productos, showAllShop)
    }).catch((error) => {
        console.error(error)
    })
}

fetchMostrarProductos()


// MOSTRAR TODOS LOS PRODUCTOS
function mostrarTodosLosProductos(listaProductos, contenedor) {
    listaProductos.forEach((producto) => {
        const enlace = document.createElement('a')
        contenedor.append(enlace)
        const card = document.createElement('div')
        card.setAttribute('class', 'card col-12 col-md-12 col-lg-12')
        card.innerHTML += `
        <img src=${producto.img} class=card-img alt=${producto.nombre}>
        <div class=card-body>
            <p class=card-title> ${producto.nombre} </p>
            <p class=card-cost> $${producto.precio.toLocaleString()} </p>
            <p class=card-text> <strong> ${numCuotasSinInteres} </strong> cuotas sin interés <strong>$${Math.trunc(producto.precio / numCuotasSinInteres)}</strong></p>
            <div class=seleccionar-producto>
                <button class=btn-añadir-carrito id=${producto.id}>
                    <p class=btn-añadir-carrito__text> Agregar al carrito </p>
                </button>
                <form class="talle">
                    <select class="form-select form-select-sm talle__caja" id=t${producto.id} aria-label=".form-select-sm example">
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </form>
            </div>
        </div>`

        enlace.append(card)


        // AÑADIR PRODUCTO AL CARRITO
        let btnAñadirCarrito = document.getElementById(producto.id)
        verificarStock(btnAñadirCarrito, producto)
    })

}


// VERIFICAR STOCK 
function verificarStock(btnAñadirCarrito, productoSeleccionado) {
    fetch('../productos.json').then((response) => response.json())
    .then((resultado) => {
        añadirProductoAlCarrito(btnAñadirCarrito, productoSeleccionado, resultado.productos)
    }).catch((error) => {
        console.error(error)
    })
}

function hayStock(talleSeleccionado, idProductoSeleccionado, listaProductos, cantProductoSeleccionado) {
    for (const producto of listaProductos) {
        if (producto.id === idProductoSeleccionado) {
            switch(talleSeleccionado){
                case 'S':
                return ((producto.stock[0] - cantProductoSeleccionado) > 0)

                case 'M':
                return ((producto.stock[1] - cantProductoSeleccionado) > 0)
            
                case 'L':
                return ((producto.stock[2] - cantProductoSeleccionado) > 0)

                case 'XL':
                return ((producto.stock[3] - cantProductoSeleccionado) > 0) 
            }
        }
    }
}

// AÑADIR NUEVO PRODUCTO AL CARRITO
function añadirProductoAlCarrito(btnAñadirCarrito, productoSeleccionado, listaProductos) {
    btnAñadirCarrito.onclick = () => {
        let talle = document.getElementById(`t${productoSeleccionado.id}`)
        let talleSeleccionado = talle.value
        let idProductoSeleccionado = productoSeleccionado.id
        let cantProductoSeleccionado = 1
        if (carrito.length != 0) {
            for (const productos of carrito) {
                let [producto, cantidad, talle] = productos
                if ((producto == productoSeleccionado) && (talle == talleSeleccionado)) {
                    cantProductoSeleccionado = cantidad
                }
            }
        }
        if (hayStock(talleSeleccionado, idProductoSeleccionado, listaProductos, cantProductoSeleccionado)) {
            for (const productos of carrito) {
                let [producto, cantidad, talle] = productos
                if ((producto == productoSeleccionado) && (talle == talleSeleccionado)) {
                    cantidad += 1
    
                    // ALERTA PRODUCTO AGREGADO
                    alertaProductoAgregadoCarrito(productoSeleccionado.nombre)
                    localStorage.setItem('carrito', JSON.stringify(carrito))
                    bodyCarrito.innerHTML = ``
                    mostrarCarrito()
                    return
                }
            }
            productoASumar = [productoSeleccionado, 1, talleSeleccionado]
            carrito.push(productoASumar)
    
            // ALERTA PRODUCTO AGREGADO
            alertaProductoAgregadoCarrito(productoSeleccionado.nombre)
            localStorage.setItem('carrito', JSON.stringify(carrito))
            bodyCarrito.innerHTML = ``
            mostrarCarrito()
        }
        else {
            alertStock()
        }
    }
}

// ALERTA STOCK

function alertStock() {
    Swal.fire({
        title: '¡Uy!',
        text: 'No tenemos más stock de este producto para agregarlo al carrito',
        imageUrl: '../img/logos/alert-stock.png'
      })
}

// VERIFICAR STOCK PRODUCTO YA EN CARRITO 

function verificarStockYaEnCarrito() {
    fetch('../productos.json').then((response) => response.json())
    .then((resultado) => {
        sumarUnidadAlCarrito(resultado.productos)
    }).catch((error) => {
        console.error(error)
    })
}

// AÑADIR PRODUCTO YA EN CARRITO
function sumarUnidadAlCarrito(listaProductos) {
    let botonesSumarUnidad = document.getElementsByClassName('cant-producto__agregar')
    for (const boton of botonesSumarUnidad) {
        boton.onclick = (e) => {
            id = e.currentTarget.id
            talleSeleccionado = id.slice(0, 1)
            idProductoSeleccionado = id.slice(1)
            for (const productos of carrito) {
                if ((productos[0].id == idProductoSeleccionado) && (talleSeleccionado == productos[2])) {
                    cantProductoSeleccionado = productos[1]
                    talleSeleccionado = productos[2]
                }
            }
            if (hayStock(talleSeleccionado, idProductoSeleccionado, listaProductos, cantProductoSeleccionado)) {
                for (const productos of carrito) {
                    if (((productos[0].id == idProductoSeleccionado) && (talleSeleccionado == productos[2]))) {
                        productos[1] += 1
                        mostrarCarrito()
                    }
                }
            }
            else {
                alertStock()
            }
        }
    }
}

// ELIMINAR PRODUCTO DE CARRITO
function eliminarProductoCarrito(carrito, cantProductos) {
    let botonesEliminarProducto = document.getElementsByClassName('img-eliminar-producto')
    for (const boton of botonesEliminarProducto) {
        boton.onclick = (e) => {
            id = e.currentTarget.id
            talleSeleccionado = id.slice(0, 1)
            idProducto = id.slice(1)
            const productoAEliminar = carrito.find((productos) => ((idProducto == productos[0].id) && (talleSeleccionado == productos[2])))
            idx = carrito.indexOf(productoAEliminar)
            carrito.splice(idx, 1)
            bodyCarrito.innerHTML = ``
            cantProductos.innerText = carrito.length
            localStorage.setItem('carrito', JSON.stringify(carrito))
            mostrarCarritoVacio()
            mostrarCarrito()
        }
    }
}


// ELIMINAR UNIDAD DE CARRITO 
function eliminarUnidadDelCarrito(carrito, cantProductos) {
    let botonesQuitarUnidad = document.getElementsByClassName('cant-producto__quitar')
    for (const boton of botonesQuitarUnidad) {
        boton.onclick = (e) => {
            id = e.currentTarget.id
            talleSeleccionado = id.slice(0, 1)
            idProducto = id.slice(1)
            for (const productos of carrito) {
                if ((productos[0].id == idProducto) && (productos[2] == talleSeleccionado)) {
                    if ((productos[1] - 1) > 0) {
                        productos[1] -= 1
                        mostrarCarrito()
                        return
                    }
                    else {
                        idx = carrito.indexOf(productos)
                        carrito.splice(idx, 1)
                        bodyCarrito.innerHTML = ``
                        cantProductos.innerText = carrito.length
                        localStorage.setItem('carrito', JSON.stringify(carrito))
                        mostrarCarritoVacio()
                        mostrarCarrito()
                    }
                }
            }
        }
    }
}

// ALERTA PRODUCTO AGREGADO AL CARRITO
function alertaProductoAgregadoCarrito(nombreProducto) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: 'success',
        title: `Agregaste "${nombreProducto}" al carrito"`
      })
}

mostrarCarritoVacio()
mostrarCarrito()


// MOSTRAR CARRITO DE COMPRAS
function mostrarCarrito() {
    if (carrito.length != 0) {
        alertCarrito.remove()
        bodyCarrito.innerHTML = ``
        containerCarrito = document.createElement('div')
        containerCarrito.setAttribute('class', 'container-carrito')
        carritoProductos = document.createElement('ul')
        carritoProductos.setAttribute('class', 'carrito__productos')
        carritoProductos.setAttribute('id', 'carritoProductos')
        containerCarrito.append(carritoProductos)
        bodyCarrito.append(containerCarrito)
        carrito.forEach((productos) => {
            let producto = productos[0]
            let cantidad = productos[1]
            let talle = productos[2]
            carritoProductos.innerHTML += `
            <li class="carrito__producto">
                <div class="producto-img">
                    <img src=${producto.img.slice(1)} alt=${producto.nombre}>
                </div>
                <div class="producto-info">
                    <p class="producto-carrito-nombre">${producto.nombre} <span class="producto-carrito-talle">(${talle})</span></p>
                    <p class="producto-carrito-precio">$${producto.precio.toLocaleString()}</p>
                    <div class="container-cant-producto">
                        <span class="cant-producto__quitar" id=${talle}${producto.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                            </svg>
                        </span>
                        <p class="cant-producto__total">${cantidad}</p>
                        <span class="cant-producto__agregar" id=${talle}${producto.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                </svg>
                            </span>
                    </div>
                </div>
                <button class="eliminar-producto-logo">
                    <img src="./img/header/eliminar.png" class="img-eliminar-producto" id=${talle}${producto.id} alt="Eliminar Producto">
                </button>
            </li>`
            cantProductos.innerText = carrito.reduce((subCantidad, productos) => subCantidad + productos[1] , 0)
            verificarStockYaEnCarrito()
            if (carrito.length != 0) {
                eliminarUnidadDelCarrito(carrito, cantProductos)
                eliminarProductoCarrito(carrito, cantProductos)
            }
        })
        vaciarCarrito()
        mostrarPrecioTotal(carrito, numCuotasSinInteres)
        iniciarCompra()
    }
}

// VACIAR CARRITO
function vaciarCarrito() {
    let vaciarCarrito = document.createElement("button")
    vaciarCarrito.setAttribute('class', 'btn-añadir-carrito')
    vaciarCarrito.innerHTML = `
    <p class=btn-añadir-carrito__text> Vaciar Carrito </p>`
    carritoProductos.append(vaciarCarrito)
            
    vaciarCarrito.onclick = () => {
            vaciarLocalStorage()
    }
}



// MOSTRAR PRECIO TOTAL
function mostrarPrecioTotal(carrito, numCuotasSinInteres) {
    const [total, precioPorCuota] = calcularPrecioTotal(carrito, numCuotasSinInteres)
    let carritoTotal = document.createElement('div')
    carritoTotal.setAttribute('class', 'carrito__total')
    carritoTotal.innerHTML += `
    <p class="total-precio">Total: $${total.toLocaleString()}</p>
    <p class="total-cuotas">O hasta 3 cuotas sin interés de $${precioPorCuota.toLocaleString()}</p>`
    containerCarrito.append(carritoTotal)
}


// CALCULAR PRECIO TOTAL
function calcularPrecioTotal(carrito, numCuotasSinInteres) { 
    let total = carrito.reduce((subTotal, producto) => subTotal + (producto[0].precio * producto[1]), 0)
    let precioPorCuota = Math.trunc((total / numCuotasSinInteres) + (total / numCuotasSinInteres) * 0)
    return [total, precioPorCuota]
}

// INICIAR COMPRA
function iniciarCompra() {
    let iniciarCompra = document.createElement("button")
    iniciarCompra.setAttribute('class', 'btn-iniciar-compra')
    iniciarCompra.innerHTML = `
    <p class=btn-iniciar-compra__text> Iniciar compra </p>`
    containerCarrito.append(iniciarCompra)

    iniciarCompra.onclick = () => {
        Swal.fire(
            '¡Listo!',
            `Te agradecemos por comprar en nuestra tienda. Pronto nos pondremos en contacto para que puedas recibir tu pedido.`,
            'success'
        )
        vaciarLocalStorage()
    }
}


// OBTENER PRODUCTOS FILTRADOS
const fetchProductosFiltrados = (categoria) => {
    fetch('../productos.json').then((response) => response.json())
    .then((resultado) => {
        const productosFiltrados = filtrarCategoria(resultado.productos, categoria)
        mostrarTodosLosProductos(productosFiltrados, showAllShop)
    }).catch((error) => {
        console.error(error)
    })
}


// FILTRAR POR CATEGORIA
function filtrarCategoria(listaProductos, categoria) {
    const productosFiltrados = listaProductos.filter((producto) => categoria === producto.categoria)
    return productosFiltrados
}


// BOTONES FILTRADO
btnVerTodo.onclick = () => {
    showAllShop.innerHTML = ``
    fetchMostrarProductos()
}

btnRemeras.onclick = () => {
    showAllShop.innerHTML = ``
    fetchProductosFiltrados('remeras')
}

btnBuzos.onclick = () => {
    showAllShop.innerHTML = ``
    fetchProductosFiltrados('buzos')
}

btnPantalones.onclick = () => {
    showAllShop.innerHTML = ``
    fetchProductosFiltrados('pantalones')
}