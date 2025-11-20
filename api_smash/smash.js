                             /*
            if (request.url.startsWith("/obtener_personaje_")) {
                var id = request.url.replace("/obtener_personaje_", "");
                const sql_personaje = "SELECT personaje_id, saga_id, nombre_personaje, numero_smash, link_personaje, info_origen FROM `personajes` WHERE personaje_id = ";
                conexion_db.query(sql_personaje + id, (err, resultado) => {
                    if (err) {
                        response.statusCode = 401;
                        response.end(JSON.stringify({
                            "mensaje": "Personaje no existe o error"
                        }));
                        return 0;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(resultado[0]));
                });
                return;
            }

            if (request.url.startsWith("/obtener_personajes_por_saga_")) {
                var id = request.url.replace("/obtener_personajes_por_saga_", "");

                conexion_db.query("SELECT personaje_id, nombre_personaje, numero_smash, link_personaje FROM `personajes` WHERE saga_id = " + id, (err, resultado) => {
                    if (err) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "error, peticion no valida"
                        }));
                        return;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "personajes": resultado
                    }));
                });
                return;
            }

            if (request.url.startsWith("/obtener_movimientos_por_personaje_")) {
                var id_personaje = request.url.replace("/obtener_movimientos_por_personaje_", "");
                conexion_db.query("SELECT * FROM `movimientos` WHERE personaje_id = " + id_personaje, (err, resultado) => {
                    if (err) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "Error en DB al listar movimientos"
                        }));
                        return 0;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "movimientos": resultado
                    }));
                });
                return;
            }
            if (request.url.startsWith("/obtener_mapas_saga_")) {
                var id_personaje = request.url.replace("/obtener_mapas_saga_", "");
                const sql_mapas = `SELECT M.mapa_id, M.nombre_mapa, M.imagen_mapa FROM mapas MINNER JOIN personajes P ON M.saga_id = P.saga_id WHERE P.personaje_id = `;
                conexion_db.query(sql_mapas + id_personaje, (err, resultado) => {
                    if (err) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "Error interno del servidor"
                        }));
                        return;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "mapas": resultado
                    }));
                });
                return;
            }
            if (request.url.startsWith("/obtener_id_foto_")) {
                var id = request.url.replace("/obtener_id_foto_", "");
                conexion_db.query("SELECT foto_id FROM `personaje_galeria` WHERE personaje_id = " + id, (err, resultado) => {
                    if (err) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "error, peticion no valida"
                        }));
                        return 0;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({
                        "ids": resultado
                    }));
                });
                return;
            }

            if (request.url.startsWith("/obtener_foto_con_id_")) {
                var id = request.url.replace("/obtener_foto_con_id_", "");
                conexion_db.query("SELECT imagen FROM `personaje_galeria` WHERE foto_id = " + id, (err, resultado) => {
                    if (err) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "Foto no encontrada"
                        }));
                        return 0;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(resultado[0].imagen));
                });
                return;
            }

            if (request.url.startsWith("/obtener_info_saga_")) {
                var id = request.url.replace("/obtener_info_saga_", "");
                conexion_db.query("SELECT link_icono FROM `saga` WHERE saga_id = " + id, (err, resultado) => {
                    if (err || resultado.length == 0) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "Saga no encontrada"
                        }));
                        return 0;
                    }
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(resultado[0]));
                });
                return;
            }

            response.statusCode = 404;
            response.end(JSON.stringify({
                "mensaje": "Ruta no encontrada"
            }));
            break;
            */
const http = require("node:http");
const basedatos = require("mysql");
const jwt = require("jsonwebtoken");
const { llave } = require("../../FotosRedSocial_Pagina/FotosAPI/fotosapi");
const puerto = 3000;

exports.llave = llave;

const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "*");

    //CONEXION A BASE DE DATOS
    const conexion_db = basedatos.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: "icono_saga"
    });

    conexion_db.connect((err) => {
        if(err){
            console.log(err);
            return 0;
        }
    });

    const authHeader = request.headers["authorization"];
    console.log(authHeader);

    //CASOS DE LOS METODOS
    switch(request.method){
        //CASO GET
        case "GET":
            switch(request.url){
                //CASO GET ID PERFILES
                case "/img_sagas":
                    conexion_db.query("SELECT id FROM `saga`", (err, resultado) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log("Conexion existosa a la base de datos");

                        const objeto_sagas = {
                            "sagas": resultado
                        }

                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_sagas));

                        conexion_db.end();
                    });
                break;
                
                default:
                    if(request.url.startsWith("/info_sagas_")){
                        var id = request.url.replace("/info_sagas_","");
                        
                        conexion_db.query("SELECT * FROM `saga` WHERE id = " + id, (err, resultado) => {
                            if(err){
                                const objeto_error = {
                                    "mensaje": "saga no existente"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));

                                conexion_db.end();
                            }
                            console.log(resultado);

                            /*const arregloBytes = new Uint8Array(resultado[0].imagen);
                            const blob = new Blob([arregloBytes]);*/

                            const objeto_saga = {
                                "saga_id" : resultado[0].id,
                                "nombre_saga": resultado[0].nombre_saga,
                                "link_icono": resultado[0].link_icono
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_saga));

                            conexion_db.end();
                        });
                    }
                    if(request.url.startsWith("/obtener_id_fotos_")){
                        console.log("me esta pidiento las fotos");
                        var id = request.url.replace("/obtener_id_fotos_","");
                        console.log(id);

                        conexion_db.query("SELECT id FROM `fotos` WHERE id_usuario = " + id, (err, resultado) => {
                            if(err){
                                console.log(err);
                                const objeto_error = {
                                    "mensaje": "error, peticion no valida"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));

                                return 0;
                            }

                            const objeto_ids = {
                                "ids": resultado
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_ids));
                            //console.log(resultado);

                            conexion_db.end();
                        });
                        return 0;
                    }

                    if(request.url.startsWith("/obtener_foto_con_id_")){
                        var id = request.url.replace("/obtener_foto_con_id_", "");
                        //console.log(id);
                        conexion_db.query("SELECT imagen FROM `fotos` WHERE id = " + id, (err, resultado) => {
                            if(err){
                                console.log(err);
                                const objeto_error = {
                                    "mensaje": "error, peticion no valida"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0;
                            }

                            if(resultado.length > 0){
                                response.statusCode = 200;
                                response.end(resultado[0].imagen);
                            }
                            else{
                                const objeto_error = {
                                    "mensaje": "no hay fotos con ese id"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                            }
                            
                            //console.log(resultado);
                            conexion_db.end();
                            return;
                        });
                    }

                    //console.log(request.url);
                break;
            }
        break;

        //CASO POST
        case "POST":
            var informacion = "";
            request.on("data", info => {
                informacion += info.toString();
            });

            //console.log(informacion);

            request.on("end", () => {

                switch(request.url){
                    case "/login":
                        const login = JSON.parse(informacion);
                        //console.log(informacion);

                        conexion_db.query("SELECT nombre from `usuarios` WHERE (nombre = '" + login.usuario + "' AND contrasena = '" + login.contrasena + "') OR (correo = '" + login.usuario + "' AND contrasena = '" + login.contrasena + "')", (err, resultado) => {

                            if(err){
                                console.log(err);
                                 const objeto_error = {
                                    "mensaje": "informacion ingresada erronea"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0;
                            }
                            
                            if(resultado.length <= 0){
                                const objeto_error = {
                                    "mensaje": "Usuario y/o contraseña incorrectos"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                            }

                            const tokenjwt = jwt.sign({username: resultado[0].nombre},
                                llave, {expiresIn: "30s"});

                            //console.log(token);
                        });
                    break;
                    case "/registro":
                        const registro = JSON.parse(informacion);
                        //console.log(registro);

                        if(registro.contrasena != registro.contrasena_confirmar){
                            const objeto_error = {
                                    "mensaje": "La contraseña es incorrecta"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0;
                            }

                            

                            conexion_db.query("SELECT nombre, correo FROM  `usuarios` WHERE nombre = '" + registro.nombre + "' OR correo ='" + registro.correo + "'", (err, resultado) =>{
                                if(err, info){
                                    const objeto_error = {
                                    "mensaje": "La contraseña es incorrecta"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                conexion_db.end();
                                return 0;
                                }

                                if(resultado.length > 0){
                                    //Ya exsite en la base de datos
                                    const objeto_error = {
                                    "mensaje": "Correo y contraseña ya proporcionados"
                                }
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                conexion_db.end();
                                return 0;
                                }

                                conexion_db.end();

                                // Agregar a la base de datos

                                /*conexion_db.query("INSERT INTO `usuarios` (`nombre`, `correo`, `contrasena`, `imagen`, `fondo`, `fondo_cover`) VALUES ('" + registro.nombre + "', '" + registro.correo +"', '"+ registro.contrasena +"', '" + imagen_binario +"', '"+ fondo_binario +"', '"+ registro.fondo_cover +"')", (err, resultado) =>{
                                    if(err){
                                        console.log(err)
                                        return 0;
                                    }

                                    console.log(resultado);
                                });*/

                                var imagen_binario;
                                var fondo_binario;

                                if(registro.imagen  == "" || registro.imagen == null){
                                    imagen_binario = null;
                                }
                                else{
                                    const imagen_base64 = registro.imagen.split(",");
                                    imagen_binario = Buffer.from(imagen_base64[1], "base64");
                                }

                                if(registro.fondo  == "" || registro.imagen == null){
                                    fondo_binario = null;
                                }
                                else{
                                    const fondo_base64 = registro.imagen.split(",");
                                    var fondo_binario = Buffer.from(fondo_base64[1], "base64");
                                }

                                conexion_db.query("INSERT INTO `usuarios` (`nombre`, `correo`, `contrasena`, `imagen`, `fondo`, `fondo_cover`) VALUES(?, ?, ?, ?, ?)", [registro.nombre, registro.correo, registro.contrasena, imagen_binario, fondo_binario, registro.fondo_cover],
                                (err, resultado) => {
                                    if(err){
                                        console.log(err)
                                        conexion_db.end();
                                        return 0;
                                    }

                                    const objeto_respuesta = {
                                        "mensaje": "usuario creado"
                                    }

                                    response.statusCode = 200;
                                    response.setHeader('Content-Type', 'application/json');
                                    response.end(JSON.stringify(objeto_respuesta));
                                    conexion_db.end();
                                    return 0;
                                });
                            });
                    break;
                    case "/agregar_foto_a_muro":

                    if(!authHeader || authHeader == "" || authHeader == "null"){
                        response.statusCode = 401;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({
                            "Mensaje": "Token no proporcionado"
                        }));
                        return;
                    }

                    jwt.verify(authHeader, llave, (err, decoded) => {
                        if(err){
                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                "Mensaje": "Tokne invalido o expirado"
                            }));
                            return;
                        }

                        const objeto_imagen = JSON.parse(informacion);
                        const imagen_binario = Buffer.from(objeto_imagen.imagen, "base64");

                        conexion_db.query("INSERT INTO `fotos` (`id_usuario`, `imagen`) VALUES ((SELECT id FROM `usuarios` WHERE nombre = '" + decoded.username +"'), ?)", [imagen_binario], (err, 
                        resultado) =>{
                            if(err){
                                console.log(err);
                                response.statusCode = 401;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                "Mensaje": "error en la consulta"
                                }));
                                conexion_db.end();
                                return;
                            }

                            response.statusCode = 401;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify({
                                "Mensaje": "Imagen agregada correctamente al muro"
                            }));
                            conexion_db.end();
                            return;
                        });
                        //console.log(imagen_binario);
                    });

                    //const objeto_imagen = JSON.parse(informacion);
                    //console.log(objeto_imagen);
                    break;
                }
            });
        break;
        
       

    case "PUT":
        request.on("data", info => {
            const objeto_recibido = JSON.parse(info.toString());
            let respuesta_json;
            let ruta_valida = false;

            if (request.url === "/editar_comentario") {
                ruta_valida = true;
                
                const { numero_confesion, indice_comentario, nuevo_texto } = objeto_recibido;
                let edicion_exitosa = false;

                for (i = 0; i < archivo_json.confesiones.length; i++) {
                    if (archivo_json.confesiones[i].numero == numero_confesion) {
                        if (archivo_json.confesiones[i].comentarios[indice_comentario] !== undefined) {
                            archivo_json.confesiones[i].comentarios[indice_comentario] = nuevo_texto;
                            edicion_exitosa = true;
                            break;
                        }
                    }
                }
                
                if (edicion_exitosa) {
                    respuesta_json = {
                        "success": true,
                        "mensaje": "Comentario actualizado.",
                        "texto_actualizado": nuevo_texto
                    };
                } else {
                    respuesta_json = {
                        "success": false,
                        "mensaje": "No se pudo encontrar o editar el comentario."
                    };
                    response.statusCode = 404;
                }

                } else {
                    response.statusCode = 401; 
                    response.end("Ruta PUT no reconocida.");
                    return; 
                }

            fs.writeFile("./confesiones.json", JSON.stringify(archivo_json), (err) => {
                if (!err) {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", "application/json; charset=utf-8");
                    response.end(JSON.stringify(respuesta_json));
                } else {
                    console.error("Error al escribir el archivo:", err);
                    response.statusCode = 401;
                    response.end( "Error interno del servidor.");
                }
            });
        });
        break;

        case "OPTIONS":
            response.writeHead(204);
            response.end();
        break;
    }

    /*
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({}));
    */
});

server.listen(puerto, () =>{
    console.log("Servidor a la escucha en http://localhost:" + puerto);
});
