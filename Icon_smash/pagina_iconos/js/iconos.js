function AbrirPredefinidos(){
    ConsultasPredefinidas.style.display = "block";
}

function CerrarPredefinidos(){
    ConsultasPredefinidas.style.display = "none";
}

function ConsultarPredefinido(latitud, longitud){
    CerrarPredefinidos();
    campo_longitud.value = longitud;
    campo_latitud.value = latitud;
    ConsultarTemperatura();
}