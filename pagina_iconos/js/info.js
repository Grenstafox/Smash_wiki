const personajeId = sessionStorage.getItem("muro_objetivo");
const smashCharacter = document.querySelector(".smash_character");
const numberCharacter = document.querySelector(".number_character");
const nameCharacter = document.querySelector(".name_character");
const origin_info = document.querySelector(".origin");
const containerMove = document.querySelector("#container_move");
const plantillaMove = document.querySelector(".card_move");
const contentStage = document.querySelector("#content_stage");
const body_fondo = document.querySelector("body");

fetch("http://localhost:3007/obtener_personaje_" + personajeId).then(recurso => recurso.json()).then(respuesta => {
    const { 
        link_personaje, 
        nombre_personaje, 
        numero_smash, 
        info_origen } = respuesta;
        
        const img = 'image/jpeg'; 
        const dataUrl = "data:" + img +  ";base64," + link_personaje;

        if (smashCharacter) {
            smashCharacter.src = dataUrl;
        } else {
            console.log("No hay imagen del personaje");
        }

        if (nameCharacter) {
            nameCharacter.textContent = nombre_personaje;
        }

        if (numberCharacter) {
            if (numero_smash) {
                numberCharacter.textContent = "#" + numero_smash;
            } else {
                numberCharacter.textContent = "#" + '?';
            }
        }
        if (originInfo) {
            originInfo.textContent = info_origen;
        }
})


function CargarSetDeMovimientos(idPersonaje) {
    if (plantillaMove) {
        plantillaMove.remove();
    }
    fetch("http://localhost:3007/obtener_movimientos_por_personaje_" + idPersonaje).then(recurso => recurso.json()).then(data => {
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
    fetch("http://localhost:3007/obtener_id_foto_" + idPersonaje).then(recurso => recurso.json()).then(data => {
        if (!data.ids) {
            console.log("No hay IDs de fotos");
            return 0;
        }

        for (let i = 0; i < data.ids.length; i++) {
            const item = data.ids[i];

            fetch("http://localhost:3007/obtener_foto_con_id_" + item.foto_id).then(recurso => recurso.json()).then(imageData => {
                if (imageUrl) {
                    console.log("Foto ID " + item.foto_id + " cargada.");
                } else {
                    console.log("No hay foto");
                }
            });
        }
    });

}
