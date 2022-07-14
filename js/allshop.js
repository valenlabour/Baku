const IVA = 0.21
numCuotasSinInteres = 3
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
            <button class=btn-añadir-carrito id=${producto.id}>
                <p class=btn-añadir-carrito__text> Añadir al carrito </p>
            </button>
        </div>`

        enlace.append(card)


        // AÑADIR PRODUCTO AL CARRITO
        let añadirCarrito = document.getElementById(producto.id)
        añadirProductoAlCarrito(añadirCarrito, producto)
    })

}


// AÑADIR PRODUCTO AL CARRITO
function añadirProductoAlCarrito(btnAñadirCarrito, producto) {
    btnAñadirCarrito.onclick = () => {
        carrito.push(producto)
        // ALERTA PRODUCTO AGREGADO
        alertaProductoAgregadoCarrito(producto.nombre)
        localStorage.setItem('carrito', JSON.stringify(carrito))
        bodyCarrito.innerHTML = ``
        mostrarCarrito()
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

        vaciarCarrito()

        mostrarPrecioTotal(carrito, numCuotasSinInteres)
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
    let total = carrito.reduce((subTotal, producto) => subTotal + producto.precio, 0)
    let precioPorCuota = Math.trunc((total / numCuotasSinInteres) + (total / numCuotasSinInteres) * 0)
    return [total, precioPorCuota]
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