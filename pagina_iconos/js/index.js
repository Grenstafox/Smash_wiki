const card_place = document.querySelector("#card_place");
const container = document.querySelector("#container");
const container_saga = document.querySelector("#container_saga");
const icon_saga = document.querySelector("#icon_saga");
const saga_characters = document.querySelector("#saga_characters");
const card = saga_characters.querySelector(".card");

function CargarTodasLasSagas() {
    fetch("http://localhost:3007/obtener_todas_las_sagas").then(recurso => recurso.json()).then(data => {
        if (!data.sagas) {
            return;
        }

        for (let i = 0; i < data.sagas.length; i++) {
            const saga = data.sagas[i];
            const clon = container.cloneNode(true);
            const iconImg = clon.querySelector("#icon");

            iconImg.onclick = function () {
                AbrirContainer(saga.saga_id);
            };
            const mimeType = 'image/jpeg';
            const iconUrl = "data:" + mimeType + ";base64," + saga.link_icono;

            if (iconImg && saga.link_icono) {
                iconImg.src = iconUrl;
            }

            card_place.appendChild(clon);
        }
    })
}

function CargarPersonajesPorSaga(sagaId) {
    var closeButtonHtml = '';

    const closeButton = saga_characters.querySelector('button');
    if (closeButton) {
        closeButtonHtml = closeButton.outerHTML;
    }

    saga_characters.innerHTML = closeButtonHtml;

    fetch("http://localhost:3007/obtener_info_saga_" + sagaId).then(recurso => recurso.json()).then(infoSaga => {
        const saga_icon = icon_saga.querySelector("#saga_icon");
        const img = 'image/jpeg';
        const iconUrl = "data:" + img + ";base64," + infoSaga.link_icono;

        if (saga_icon && infoSaga.link_icono) {
            saga_icon.src = iconUrl;
        } else {
            console.log("Advertencia: Icono de saga no encontrado.");
        }
    });
    fetch("http://localhost:3007/obtener_personajes_por_saga_" + sagaId).then(recurso => recurso.json()).then(data => {
        if (!data.personajes) {
            return 0;
        }

        for (let i = 0; i < data.personajes.length; i++) {
            const personaje = data.personajes[i];
            const clon = card.cloneNode(true);

            clon.querySelector(".name_character").textContent = personaje.nombre_personaje;

            const number_character = clon.querySelector(".number_character");
            if (number_character) {
                if (personaje.numero_smash) {
                    number_character.textContent = "#" + personaje.numero_smash;
                } else {
                    number_character.textContent = "#" + '?';
                }
            }

            const smash_character = clon.querySelector(".smash_character");
            const img = 'image/jpeg';
            const imageUrl = "data:" + img + ";base64," + personaje.link_personaje;

            if (smash_character && personaje.link_personaje) {
                smash_character.src = imageUrl;
            }

            clon.onclick = function () {
                ElPersonaje(personaje.personaje_id);
            };
            saga_characters.appendChild(clon);
        }
    })
}

function CerrarContainer(){
    if (container_saga) {
        container_saga.style.display = "none";
    }
}

function AbrirContainer(sagaId){
    if (container_saga) {
        container_saga.style.display = "block";
    }

    if (sagaId) {
        CargarPersonajesPorSaga(sagaId); 
    } else {
        console.warn("Advertencia: AbrirContainer fue llamado sin un 'sagaId'. No se cargarán personajes.");
    }
}