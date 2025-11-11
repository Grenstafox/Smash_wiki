const card_place = document.querySelector("#card_place");
const card_container = document.querySelector("#card_container");
/*const container = document.querySelector("#container");
const container_card = document.querySelector("#container_card");
const icon_saga = document.querySelector("#icon_saga");
const saga_characters = document.querySelector("#saga_characters");
const card = saga_characters.querySelector(".card");
*/

function CargarSagas() {

   card_place.style.display = "none";

    fetch("http://localhost:3000/obtener_todas_las_sagas").then(recurso => recurso.json()).then(data => {
       console.log(data);

       if(data.sagas = null){
        console.log("no hay ninguna saga");
       }

        for (i = 0; i < data.sagas.length; i++) {
           
            clon.style.display = "block";
            clon.id = saga_id;
            const clon = card_place.cloneNode(true);
            

            if(container){
                container.appendChild(clon);
            }
            clon.style.display = "block";
            clon.id = sagaId; 

            fetch("http://localhost:3000/info_sagas" + sagaId).then(recurso => recurso.json()).then(infoSaga => {
                console.log("Saga ID " + sagaId + ":", infoSaga);

                const card_icon = clon.querySelector("card_icon");
                const iconSaga = clon.querySelector("img");

                if(infoSaga.icono && infoSaga.icono.data){

                const arregloBytes = new Uint8Array(respuesta.imagen.data);
                const blob = new Blob([arregloBytes]);
                var imagen_base64 = URL.createObjectURL(blob);
                imagen.src = imagen_base64;

                    if(iconImg){
                        iconImg.src = imagen_base64;
                    }
                    else{
                        console.log("No se encontro ningun icono");
                    }

                    clon.addEventListener("click", function() {

                    });
                    console.log("No se obtuvo una saga");
                };
            });
            
    
            if (iconImg && saga.link_icono) {
                iconImg.src = iconUrl;
            }
    
            card_place.appendChild(clon);
        }
    });
    card_place.remove();
}

/*
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

        for (i = 0; i < data.personajes.length; i++) {
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

    }

}*/
