const IVA = 0.21
numCuotasSinInteres = 3
let showHoodies = document.getElementById('showBuzos') /* Contenedor de la seccion 'BUZOS' */
let bodyCarrito = document.getElementById('bodyCarrito')

/* CARRITO DE COMPRAS OBJETO */
class CarritoDeCompras {
    constructor() {
        this.productos = []
        this.total = 0
        this.cantidadDeProductos = 0
    }

    obtenerTotal() {
        this.total = this.productos.reduce((subTotal, producto) => subTotal + producto.precio, 0)
        return this.total
    }

    agregarProducto(producto) {
        this.productos.push(producto)
        this.cantidadDeProductos = this.cantidadDeProductos + 1
    }

    eliminarProducto(producto) {
        if (this.productos.length == 1) {
            this.productos.pop()
            this.cantidadDeProductos = this.cantidadDeProductos - 1
        }
        else {
            const indice = this.productos.indexOf(producto)
            this.productos.splice(indice, 1)
            this.cantidadDeProductos = this.cantidadDeProductos - 1
        }
    }

    obtenerCantidadDeProductos() {
        return this.productos.length
    }

    calcularPrecioPorCuota(nCuotas, interesPorCuota) {
        const precioPorCuota = Math.trunc((this.total / nCuotas) + (this.total / nCuotas) * interesPorCuota)
        return precioPorCuota
    }
    calcularPrecioEnCuotas(nCuotas, interesPorCuota) {
        const precioTotal = this.calcularPrecioPorCuota(nCuotas, interesPorCuota) * nCuotas
        return precioTotal
    }

    estaEnElCarrito(producto) {
        return this.productos.includes(producto)
    }
}

carrito  = new CarritoDeCompras()

/* MOSTRAR CATEGORÍA */

function mostrarTodosLosProductos(listaProductos, contenedor) {
    listaProductos.forEach((producto) => {
        const enlace = document.createElement('a')
        /* enlace.setAttribute('href', `${producto.nombre}.html`) */
        contenedor.append(enlace)
        const card = document.createElement('div')
        card.setAttribute('class', 'card col-12 col-md-12 col-lg-12')
        card.innerHTML += `
        <img src=${producto.img} class=card-img alt=${producto.nombre}>
        <div class=card-body>
            <p class=card-title> ${producto.nombre} </p>
            <p class=card-cost> $${producto.precio} </p>
            <p class=card-text> <strong> ${numCuotasSinInteres} </strong> cuotas sin interés <strong>$${Math.trunc(producto.precio / numCuotasSinInteres)}</strong></p>
            <button class=btn-añadir-carrito id=${listaProductos.indexOf(producto)}>
                <p class=btn-añadir-carrito__text> Añadir al carrito </p>
            </button>
        </div>`
        enlace.append(card)
        let añadirCarrito = document.getElementById(listaProductos.indexOf(producto))
        añadirCarrito.onclick = () => {
            carrito.agregarProducto(producto)
            alert(`Agregaste "${producto.nombre}" al carrito`)
            bodyCarrito.innerHTML = ``
            mostrarCarrito()
        }
    })

}

function mostrarProductosCategoria(categoria, listaProductos, container) {
    let productosCategoria = listaProductos.filter((producto) => {
        return categoria === producto.categoria
    })
    mostrarTodosLosProductos(productosCategoria, container)
}   
/* MOSTRAR CARRITO DE COMPRAS */

let alertCarrito = document.createElement("h2")
alertCarrito.setAttribute("class", "carrito_vacio")

if (!carrito.productos.lenght) {
    alertCarrito.innerText = ("El carrito está vacío")
    bodyCarrito.append(alertCarrito)
}

mostrarProductosCategoria('buzos', productos, showBuzos)

function mostrarCarrito() {

    alertCarrito.remove()

    carrito.productos.forEach((producto) => {
        const productoCarrito = document.createElement('div')
        productoCarrito.setAttribute('id', 'productoCarrito')
        productoCarrito.innerHTML += ` 
        <img src="${producto.img}">
        <p>${producto.nombre}</p>
        <p>$${producto.precio}</p>`

        bodyCarrito.append(productoCarrito)
    })

    /* MOSTRAR PRECIO TOTAL */

    let total = carrito.obtenerTotal()
    let precioPorCuota = carrito.calcularPrecioPorCuota(numCuotasSinInteres, 0)
    let totalCompra = document.createElement('h4')
    totalCompra.innerText = `Total: $${total}`
    let cuotasSinInteres = document.createElement('p')
    cuotasSinInteres.innerText = `Hasta 3 cuotas sin interés de $${precioPorCuota}`
    bodyCarrito.append(totalCompra)
    bodyCarrito.append(cuotasSinInteres)

    /* VACIAR CARRITO */

    let vaciarCarrito = document.createElement("button")
    vaciarCarrito.setAttribute('class', 'btn-añadir-carrito')
    vaciarCarrito.innerHTML = `
    <p class=btn-añadir-carrito__text> Vaciar Carrito </p>`
    bodyCarrito.append(vaciarCarrito)
    
    vaciarCarrito.onclick = () => {
      
        carrito = new CarritoDeCompras()
        bodyCarrito.innerHTML = ``
        console.log(carrito.productos)
        let alertCarrito = document.createElement("h2")
        alertCarrito.setAttribute("class", "carrito_vacio")
        alertCarrito.innerText = ("El carrito está vacío")
        bodyCarrito.append(alertCarrito)
    }
}
