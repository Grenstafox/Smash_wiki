const SeccionIniciarSesion = document.querySelector("#SeccionIniciarSesion");
const SeccionSesionIniciada = document.querySelector("#SeccionSesionIniciada");

const Input_Usuario =  document.querySelector("#Input_Usuario");
const Input_Contrasena = document.querySelector("#Input_Contrasena");

const TextoMiPerfil = document.querySelector("#TextoMiPerfil");
const imagen_Perfil = document.querySelector("#SeccionSesionIniciada img");

function HacerLogin(){
    fetch("http://localhost:3000/login", {
        method : "POST",
        body: JSON.stringify({
            "usuario": Input_Usuario.value,
            "contrasena": Input_Contrasena.value
        })
    }).then(recurso => {
        if(recurso.status == 200){
            recurso.json().then(respuesta => {
                console.log(respuesta);

                sessionStorage.setItem("token_sesion", respuesta.token);
              
                ObtenerUsuario();
                
                SeccionIniciarSesion.style.display = "none";
                SeccionSesionIniciada.style.display = "block";
            });
        }
        else{
            recurso.json().then(respuesta => {
                alert(respuesta.mensaje);
            })
        }
    });
}

ObtenerUsuario();

function ObtenerUsuario(){
    fetch("http://localhost:3000/obtener_usuario", {
        method: "GET",
        headers: {
            "Authorization": sessionStorage.getItem("token_sesion")
        }
    }).then(recurso => {
        if(recurso.status == 200){
            recurso.json().then(respuesta => {
                SeccionIniciarSesion.style.display = "none";
                SeccionSesionIniciada.style.display = "block";

                TextoMiPerfil.innerHTML = respuesta.nombre;

                const arregloBytes = new Uint8Array(respuesta.imagen.data);
                const blob = new Blob([arregloBytes]);
                var imagen = URL.createObjectURL(blob);

                const BotonVerMiPerfil = document.querySelector("#BotonVerMiPerfil");
                BotonVerMiPerfil.addEventListener("click", () =>{
                    window.location.href = "index.html";
                    sessionStorage.setItem("muro_objetivo", respuesta.id);
                });


            });
        }
        else{
            alert(respuesta.mensaje);
        }
    });
}

function CerrarSesion(){
    sessionStorage.removeItem("token_sesion");
    window.location.href = "index.html";
}