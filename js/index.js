const IVA = 0.21

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
        const precioPorCuota = (this.total / nCuotas) + ((this.total / nCuotas) * interesPorCuota)
        return precioPorCuota
    }

    calcularPrecioEnCuotas(nCuotas, interesPorCuota) {
        const precioTotal = this.calcularPrecioPorCuota(nCuotas, interesPorCuota) * nCuotas
        return precioTotal
    }

    estaEnElCarrito(producto) {
        return this.productos.includes(producto)
    }

    mostrarProductos() {
        const productos = []
        for (const producto of this.productos) {
            const nombre = producto.nombre
            const precio = producto.precio
            const talle = producto.talle
            const detalle = [nombre, '$' + precio.toString(), talle].join(', ')
            productos.unshift(detalle)
        }
        return productos.join('\n')
    }
}
class Producto {
    constructor(nombre, precio, talle) {
        this.nombre = nombre
        this.precio = precio
        this.talle = talle
    }
    calcularIVA() {
        return (this.precio * IVA)
    }
    obtenerPrecio() {
        return this.precio + this.calcularIVA()
    }
    obtenerNombre() {
        return this.nombre
    }
    obtenerTalle() {
        return this.talle
    }
}
