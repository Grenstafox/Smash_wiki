const ConjuntoPerfiles = document.querySelector("#ConjuntoPerfiles");
const plantilla_perfil = document.querySelector(".Perfil");

fetch("http://localhost:3000/obtener_id_perfiles").then(recurso => recurso.json()).then(respuesta => {
    console.log(respuesta);
    //CLON DE PLANTILLA DE PERFILES
    for(i = 0; i < respuesta.ids.length; i++){
        const clon = plantilla_perfil.cloneNode(true);
        ConjuntoPerfiles.appendChild(clon);

        fetch("http://localhost:3000/obtener_perfil_" + respuesta.ids[i].id).then(recurso => recurso.json()).then(respuesta => {
            console.log(respuesta);

            const Nombre = clon.querySelector(".Nombre");
            Nombre.innerHTML = respuesta.nombre;

            if(respuesta.imagen != null){
                const imagen = clon.querySelector("img");
                const arregloBytes = new Uint8Array(respuesta.imagen.data);
                const blob = new Blob([arregloBytes]);
                var imagen_base64 = URL.createObjectURL(blob);
                imagen.src = imagen_base64;
            };
            clon.id = respuesta.id; 

            clon.addEventListener("click", function(event){
                window.location.href = "muro.html";
                //console.log(event.currentTarget.id);
                sessionStorage.setItem("muro_objetivo", respuesta.id);
                //console.log(sessionStorage.getItem("muro_objetivo"));
            });
        });
    }
    plantilla_perfil.remove();
});
