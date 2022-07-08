const IVA = 0.21
numCuotasSinInteres = 3
let bodyCarrito = document.getElementById('bodyCarrito') /* Contenedor del carrito */
let cantProductos = document.getElementById('cantProductos') /* Contador Carrito */
let alertCarrito = document.createElement("h2") /* Alerta carrito vacío */
alertCarrito.setAttribute("class", "carrito_vacio")
let newsletter = document.getElementById('newsletter')
let listaUsuarios;


// VERIFICACIÓN DE CARRITO EN LOCALSTORAGE

if (JSON.parse(localStorage.getItem('carrito'))) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    cantProductos.innerText = carrito.length
}
else {
    console.log('hola')
    carrito = []
    localStorage.setItem('carrito', JSON.stringify(carrito))
    carrito = JSON.parse(localStorage.getItem('carrito'))
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

function mostrarCarrito() {
    if (carrito.length != 0) {
        alertCarrito.remove()
        containerCarrito = document.createElement('div')
        containerCarrito.setAttribute('class', 'container-carrito')
        carritoProductos = document.createElement('ul')
        carritoProductos.setAttribute('class', 'carrito__productos')
        carritoProductos.setAttribute('id', 'carritoProductos')
        containerCarrito.append(carritoProductos)
        bodyCarrito.append(containerCarrito)
        carrito.forEach((producto) => {
            carritoProductos.innerHTML += `
            <li class="carrito__producto">
                <div class="producto-img">
                    <img src=${producto.img} alt=${producto.nombre}>
                </div>
                <div class="producto-info">
                    <p class="producto-carrito-nombre">${producto.nombre}</p>
                    <p class="producto-carrito-precio">$${producto.precio.toLocaleString()}</p>
                </div>
                <button class="eliminar-producto-logo" id=${producto.id}>
                    <img src="../img/header/eliminar.png" alt="Eliminar Producto">
                </button>
            </li>`
            
            cantProductos.innerText = carrito.length
        })
        

        // VACIAR CARRITO

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


        // MOSTRAR PRECIO TOTAL

        let total = carrito.reduce((subTotal, producto) => subTotal + producto.precio, 0)
        let precioPorCuota = Math.trunc((total / numCuotasSinInteres) + (total / numCuotasSinInteres) * 0)
        let carritoTotal = document.createElement('div')
        carritoTotal.setAttribute('class', 'carrito__total')
        carritoTotal.innerHTML += `
        <p class="total-precio">Total: $${total.toLocaleString()}</p>
        <p class="total-cuotas">O hasta 3 cuotas sin interés de $${precioPorCuota.toLocaleString()}</p>`
        
        containerCarrito.append(carritoTotal)
    }
}

mostrarCarrito()


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

btnEnviarOfertas.onclick = (e) => {
    e.preventDefault()
    enviarOfertas(listaUsuarios)
    console.log(listaUsuarios)
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