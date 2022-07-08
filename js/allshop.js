const IVA = 0.21
numCuotasSinInteres = 3
let btnVerTodo = document.getElementById('verTodo')
let btnRemeras = document.getElementById('remeras')
let btnBuzos = document.getElementById('buzos')
let btnPantalones = document.getElementById('pantalones')
let sectionAllShop = document.getElementById('sectionAllShop')
let showAllShop = document.getElementById('showAllShop') /* Contenedor de la seccion 'PRODUCTOS' */
let bodyCarrito = document.getElementById('bodyCarrito') /* Contenedor del carrito */
let cantProductos = document.getElementById('cantProductos') /* Contador Carrito */
let carrito;
let alertCarrito = document.createElement("h2") /* Alerta carrito vacío */
alertCarrito.setAttribute("class", "carrito_vacio")

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


function mostrarCarritoVacio() {

    if (!carrito.length) {
        alertCarrito.innerText = ("El carrito está vacío")
        bodyCarrito.append(alertCarrito)
    }

}

mostrarCarritoVacio()


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
            <button class=btn-añadir-carrito id=${producto.id}>
                <p class=btn-añadir-carrito__text> Añadir al carrito </p>
            </button>
        </div>`

        // AÑADIR PRODUCTO AL CARRITO

        enlace.append(card)
        let añadirCarrito = document.getElementById(producto.id)
        añadirCarrito.onclick = () => {
            carrito.push(producto)
            /* ALERTA PRODUCTO AGREGADO AL CARRITO */
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
                title: `Agregaste "${producto.nombre}" al carrito"`
              })

            localStorage.setItem('carrito', JSON.stringify(carrito))
            bodyCarrito.innerHTML = ``
            mostrarCarrito()
        }
    })

}

mostrarTodosLosProductos(productos, showAllShop)

// MOSTRAR CARRITO DE COMPRAS


mostrarCarritoVacio()
mostrarCarrito()

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


// MOSTRAR PRODUCTOS FILTRADOS

btnVerTodo.onclick = () => {
    showAllShop.innerHTML = ``
    mostrarTodosLosProductos(productos, showAllShop)
}

btnRemeras.onclick = () => {
    const productosFiltrados = productos.filter((producto) => 'remeras' === producto.categoria)
    showAllShop.innerHTML = ``
    mostrarTodosLosProductos(productosFiltrados, showAllShop)
}

btnBuzos.onclick = () => {
    const productosFiltrados = productos.filter((producto) => 'buzos' === producto.categoria)
    showAllShop.innerHTML = ``
    mostrarTodosLosProductos(productosFiltrados, showAllShop)
}

btnPantalones.onclick = () => {
    const productosFiltrados = productos.filter((producto) => 'pantalones' === producto.categoria)
    showAllShop.innerHTML = ``
    mostrarTodosLosProductos(productosFiltrados, showAllShop)
}