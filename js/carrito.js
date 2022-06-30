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

    eliminarProducto(index) {
        this.productos.splice(index, 1)
        this.cantidadDeProductos = this.cantidadDeProductos - 1
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
