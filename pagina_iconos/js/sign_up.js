input_email = document.querySelector("#email");
input_password = document.querySelector("#password");

function Registrar(){
    var obtener_registro = {
        "correo": Input_Correo.value,
        "nombre": Input_Nombre.value,
        "apellido": Input_apellido.value,
        "contraseña": Input_Contraseña.value,
        "contraseña_confirmar": Input_CortraseñaConfirmacion.value,
    }

    console.log(obtener_registro);

    fetch("http://localhost:3000/registro",{
        method: "POST",
        body: JSON.stringify(obtener_registro)
    }).then(recurso => {
        if(recurso.status == 200){
            alert(respuesta.mensaje);{
                window.location.href = "index.html";
            }
        }
        else{
            
        }

        recurso.json().then(respuesta => {
            alert(respuesta.mensaje);
        });
    });
}