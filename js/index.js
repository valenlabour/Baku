const IVA = 0.21
numCuotasSinInteres = 3
let bodyCarrito = document.getElementById('bodyCarrito') // Contenedor del carrito
let cantProductos = document.getElementById('cantProductos') // Contador Carrito
let alertCarrito = document.createElement("h2") // Alerta carrito vacío
alertCarrito.setAttribute("class", "carrito_vacio")
let newsletter = document.getElementById('newsletter')
let listaUsuarios;


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


// VERIFICACIÓN DE USUARIOS SUSCRIPTOS
if (JSON.parse(localStorage.getItem('listaUsuarios'))) {
    listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios'))
}
else {
    localStorage.setItem('listaUsuarios', JSON.stringify([]))
    listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios'))
}

function mostrarCarritoVacio() {

    if (!carrito.length) {
        alertCarrito.innerText = ("El carrito está vacío")
        bodyCarrito.append(alertCarrito)
    }

}

mostrarCarritoVacio()


// VERIFICAR STOCK 
function hayStock(talleSeleccionado, idProductoSeleccionado, listaProductos, cantProductoSeleccionado) {
    for (const producto of listaProductos) {
        if (producto.id === idProductoSeleccionado) {
            if (talleSeleccionado == 'S') {
                return ((producto.stock[0] - cantProductoSeleccionado) > 0)
            }
            else if (talleSeleccionado == 'M') {
                return ((producto.stock[1] - cantProductoSeleccionado) > 0) 
            }
            else if (talleSeleccionado == 'L') {
                return ((producto.stock[2] - cantProductoSeleccionado) > 0) 
            }
            else {
                return ((producto.stock[3] - cantProductoSeleccionado) > 0) 
            }
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
            let [producto, cantidad, talle] = productos
            carritoProductos.innerHTML += `
            <li class="carrito__producto">
                <div class="producto-img">
                    <img src=${producto.img} alt=${producto.nombre}>
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
                    <img src="../img/header/eliminar.png" class="img-eliminar-producto" id=${talle}${producto.id} alt="Eliminar Producto">
                </button>
            </li>`
            cantProductos.innerText = carrito.reduce((subCantidad, productos) => subCantidad + productos[1], 0)
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

mostrarCarrito()


// VACIAR CARRITO
function vaciarCarrito() {
    let vaciarCarrito = document.createElement("button")
    vaciarCarrito.setAttribute('class', 'btn-añadir-carrito')
    vaciarCarrito.innerHTML = `
    <p class=btn-añadir-carrito__text> Vaciar Carrito </p>`
    carritoProductos.append(vaciarCarrito)
            
    vaciarCarrito.onclick = () => {
            
        carrito = []
        localStorage.setItem('carrito', JSON.stringify(carrito))
        bodyCarrito.innerHTML = ``
        let alertCarrito = document.createElement("h2")
        alertCarrito.setAttribute("class", "carrito_vacio")
        alertCarrito.innerText = ("El carrito está vacío")
        bodyCarrito.append(alertCarrito)
        cantProductos.innerText = carrito.length
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
        carrito = []
        localStorage.setItem('carrito', JSON.stringify(carrito))
        bodyCarrito.innerHTML = ``
        cantProductos.innerText = carrito.length
        mostrarCarritoVacio()
    }
}

// ENVIAR OFERTAS POR MAIL
function enviarOfertas(listaUsuarios) {
    let email = document.getElementById('email')
    let usuario = email.value

    if ( usuario.match('@') == null || usuario.match('@').length > 1) {
        mostrarAlertaMail(`El texto debe contener el signo "@". '${usuario}' no contiene "@"`, 'error')
        return
    }

    if (/ /.test(usuario)) {
        mostrarAlertaMail('El texto antes del signo "@" no puede contener " "', 'error')
        return
    }

    let indiceArroba = usuario.search('.com')
    if (/.com/.test(usuario.slice(indiceArroba)) != true) {
        mostrarAlertaMail('Necesitamos tu mail para enviarte las novedades', 'warning')
        return
    }

    for (const user of listaUsuarios) {
        mostrarAlertaMail('¡Ups! Ya te suscribiste anteriormente', 'error')
            return
    }

    listaUsuarios.push(usuario)
    mostrarAlertaMail('Listo ¡Gracias por suscribirte!', 'success')
    return
}

btnEnviarOfertas = document.getElementById('enviarOfertas')


// BOTÓN ENVIAR OFERTAS
btnEnviarOfertas.onclick = (e) => {
    e.preventDefault()
    enviarOfertas(listaUsuarios)
    localStorage.setItem('listaUsuarios', JSON.stringify(listaUsuarios))
}


// MOSTRAR ALERTA DE MAIL
function mostrarAlertaMail(texto, logo) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: `${logo}`,
        title: `${texto}`
      })
}