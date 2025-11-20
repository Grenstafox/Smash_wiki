const personajeId = sessionStorage.getItem("muro_objetivo");

const smashCharacter = document.querySelector(".smash_character");
const numberCharacter = document.querySelector(".number_character");
const nameCharacter = document.querySelector(".name_character");
const origin_info = document.querySelector(".origin");
const containerMove = document.querySelector("#container_move");
const plantillaMove = document.querySelector(".card_move");
const contentStage = document.querySelector("#content_stage");

const tarjetaConfesion = document.querySelector("#container_comentary"); 
const seccionComentarios = document.querySelector(".lista_comentarios_publicados"); 
const Plantilla_comentario = document.querySelector(".comentario-item"); 


function CargarInformacionPrincipal(idPersonaje) {
    
}

function CargarSetDeMovimientos(idPersonaje) {
    if (plantillaMove) {
        plantillaMove.remove();
    }
    fetch(`http://localhost:3007/obtener_movimientos_por_personaje_${idPersonaje}`)
        .then(recurso => recurso.json())
        .then(data => {
            if (data.movimientos) {
                console.log("Movimientos listos");
            } else {
                console.log("No hay movimientos");
            }
        });
}

function CargarMapasDeSaga(idPersonaje) {
    const plantillaMapa = contentStage.querySelector(".container_stage");
    if (plantillaMapa) {
        plantillaMapa.remove();
    }
    fetch("http://localhost:3007/obtener_mapas_saga_" + idPersonaje).then(recurso => recurso.json()).then(respuesta => {
            if (respuesta.mapas) {
                console.log("Mapas listos.");
            } else {
                console.log("No hay mapas.");
            }
        });
}

function CargarFotosDePersonaje(idPersonaje) {
    fetch(`http://localhost:3000/obtener_id_foto_${idPersonaje}`)
        .then(recurso => recurso.json())
        .then(data => {
            if (!data.ids) {
                console.log("No hay IDs de fotos");
                return; 
            }

            for (const item of data.ids) {
                fetch("http://localhost:3000/obtener_foto_con_id_" + item.foto_id)
                    .then(recurso => recurso.json())
                    .then(imageData => {
                        if (imageData.link_foto) { 
                            console.log(`Foto ID ${item.foto_id} cargada.`);
                        } else {
                            console.log("No hay foto");
                        }
                    });
            }
        });
}

function manejarEdicionComentario(evento) {
    const comentarioContenedor = evento.currentTarget.closest('.comentario-item'); 
    
    if (comentarioContenedor.numero_confesion === undefined) return; 
    
    const numConfesion = comentarioContenedor.numero_confesion;
    const idxComentario = comentarioContenedor.indice_comentario;

    const textoActualElemento = comentarioContenedor.querySelector(".texto-comentario");
    const textoActual = textoActualElemento.innerHTML;
    
    const nuevoTexto = prompt("Edita tu comentario:", textoActual);

    if (nuevoTexto !== null && nuevoTexto.trim() !== "" && nuevoTexto !== textoActual) {
        const objeto_edicion = {
            "numero_confesion": numConfesion,
            "indice_comentario": idxComentario, 
            "nuevo_texto": nuevoTexto
        };

        fetch("http://localhost:3000/editar_comentario", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objeto_edicion)
        })
        .then(recurso => recurso.json())
        .then(respuestaAPI => {
            if (respuestaAPI.success) {
                textoActualElemento.innerHTML = respuestaAPI.texto_actualizado; 
            } else {
                alert("Error al editar el comentario: " + respuestaAPI.mensaje);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud PUT:", error);
            alert("Error de conexión al servidor.");
        });
    }
}

function InicializarComentarios() {
    if (!tarjetaConfesion || !Plantilla_comentario || !seccionComentarios) {
        console.error("No se encontraron los selectores HTML para comentarios.");
        return;
    }
    
    Plantilla_comentario.style.display = 'none'; 

    fetch("http://localhost:3000/obtener_comentarios_de_confesion_" + personajeId)
        .then(recurso => recurso.json())
        .then(respuesta => {
            const confesionData = respuesta.confesiones[0];
            
            if (!confesionData || !confesionData.comentarios) return;

            for (let j = 0; j < confesionData.comentarios.length; j++) {
                var clon_comentario = Plantilla_comentario.cloneNode(true);
                
                const comentario_texto = clon_comentario.querySelector(".texto-comentario");
                const boton_accion = clon_comentario.querySelector(".accion-comentario"); 

                comentario_texto.innerHTML = confesionData.comentarios[j];

                clon_comentario.numero_confesion = confesionData.numero;
                clon_comentario.indice_comentario = j;

                clon_comentario.style.display = 'flex';

                if (boton_accion) {
                    boton_accion.addEventListener("click", manejarEdicionComentario);
                }

                seccionComentarios.appendChild(clon_comentario);
            }
        });
}
