const aMinuscula = entrada => entrada.toLowerCase()

function ingresarNombreUsuario() {
    let condicion = true
    while (condicion) {
        let entrada = prompt('Ingrese su nombre de usuario')
        if (entrada !== '') {
            let nombreUsuario = entrada
            return nombreUsuario
        }
    }
}

function registrarse() {
    let entrada = prompt('¿Desea registrarse?')
    let entradaAMinuscula = aMinuscula(entrada)
    while (entradaAMinuscula !== 'si') {
        if (entrada == 'no'){
            return false
        }
        else {
            let entrada = prompt('¿Desea registrarse?')
            let entradaAMinuscula = aMinuscula(entrada)
            continue
        }
    }
    return true
}

function registrarNuevoUsuario() {
    let condicion = true
    while (condicion){
        let entrada = prompt('Ingrese un nombre de usuario')
        if (entrada == '') {
            alert('Debe ingresar un nombre de usuario')
            continue
        }return entrada
    }
}

function main() {
    let condicion = true
    while(condicion) {
        let entrada = prompt('¡Hola! ¿Es usuario/a de "Bakú"?')
        let entradaAMinuscula = aMinuscula(entrada)
        switch(entradaAMinuscula){
            case 'si':
                let nombreUsuario = ingresarNombreUsuario()
                alert('¡Bienvenido! ' + nombreUsuario)
                return
            case 'no':
                let registrar = registrarse()
                if (registrar == true ) {
                    nombreNuevoUsuario = registrarNuevoUsuario()
                    alert('¡Listo! Su nombre de usuario es ' + nombreNuevoUsuario + '. Gracias por confiar en nosotros')
                    return
                }else {return}
            default:
                break
        }
        continue
    }
}
main()
