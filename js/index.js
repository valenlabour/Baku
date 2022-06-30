let newsletter = document.getElementById('newsletter')
let listaUsuarios;


if (JSON.parse(localStorage.getItem('listaUsuarios'))) {
    listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios'))
}
else {
    localStorage.setItem('listaUsuarios', JSON.stringify([]))
    listaUsuarios = JSON.parse(localStorage.getItem('listaUsuarios'))
}


function enviarOfertas(listaUsuarios) {
    let email = document.getElementById('email')
    let usuario = email.value

    if ( usuario.match('@') == null || usuario.match('@').length > 1) {
        alert(`El texto debe contener el signo "@". ${usuario} no contiene "@".`)
        return
    }
    if (/ /.test(usuario)) {
        alert(`El texto antes del signo "@" no puede contener " ".`) 
        return
    }
    let indiceArroba = usuario.search('.com')
    if (/.com/.test(usuario.slice(indiceArroba)) != true) {
        alert(`Necesitamos tu mail para enviarte las novedades.`)
        return
    }
    for (const user of listaUsuarios) {
        if (user === usuario) {
            alert(`¡Ups! Ya te suscribiste anteriormente`)
            return
        }
    }

    listaUsuarios.push(usuario)
    alert(`¡Gracias por suscribirte! A partir de ahora vas a recibir nuestras novedades en tu email`)
    return
}

btnEnviarOfertas = document.getElementById('enviarOfertas')

btnEnviarOfertas.onclick = (e) => {
    e.preventDefault()
    enviarOfertas(listaUsuarios)
    console.log(listaUsuarios)
    localStorage.setItem('listaUsuarios', JSON.stringify(listaUsuarios))
}
