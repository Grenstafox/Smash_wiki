const http = require("node:http");
const basedatos = require("mysql");
const jwt = require("jsonwebtoken");
const puerto = 3000;

const server = http.createServer((request, response) => {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const conexion_db = basedatos.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: "icono_saga"
    });

    conexion_db.connect((err) => {
        if (err) {
            console.log("Error al conectar a la DB:", err);
            return 0;
        }
        console.log("Conexión a la base de datos exitosa.");
    });

    switch (request.method) {
        case "GET":
            switch (request.url) {
                case "/icono_sagas":
                    conexion_db.query("SELECT saga_id FROM `saga`", (err, resultado) => {
                        if (err) {
                            console.log(err);
                            return 0;
                        }

                        const objeto_sagas = {
                            "sagas": resultado
                        }

                        response.statusCode = 200;
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(objeto_sagas));

                        conexion_db.end();
                    });
                }
                break;
                default:
                    if(request.url.startsWith("/info_sagas_")){
                        var id = request.url.replace("/info_sagas_","");
                        
                        conexion_db.query("SELECT saga_id, nombre_saga, link_icono FROM `saga` WHERE saga_id = " + id, (err, resultado) => {
                            if(err){
                                const objeto_error = {
                                    "mensaje": "saga no existente"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));

                                conexion_db.end();
                            }
                            console.log(resultado);

                            /*const arregloBytes = new Uint8Array(resultado[0].imagen);
                            const blob = new Blob([arregloBytes]);*/

                            const objeto_saga = {
                                "saga_id" : resultado[0].saga_id,
                                "nombre_saga": resultado[0].nombre_saga,
                                "link_icono": resultado[0].link_icono
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_saga));

                            conexion_db.end();
                        });
                    }

                    if(request.url.startsWith("/usuarios_")){
                        var id = request.url.replace("/usuarios_","");
                        
                        conexion_db.query("SELECT id_usuario, nombre, apellido, correo, contraseña FROM `sesion` WHERE id_usuario = " + id, (err, resultado) => {
                            if(err){
                                const objeto_error = {
                                    "mensaje": "saga no existente"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));

                                conexion_db.end();
                            }
                            console.log(resultado);

                            /*const arregloBytes = new Uint8Array(resultado[0].imagen);
                            const blob = new Blob([arregloBytes]);*/

                            const objeto_saga = {
                                "saga_id" : resultado[0].saga_id,
                                "nombre_saga": resultado[0].nombre_saga,
                                "link_icono": resultado[0].link_icono
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(objeto_saga));

                            conexion_db.end();
                        });
                    }
                break;
                    
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
                        console.log(informacion);

                        conexion_db.query("SELECT id FROM `fotos` WHERE (nombre = '" + login.usuario + "'AND contraseña ='" + login.contraseña + "') OR (correo = '" + login.usuario + "'AND constraseña = '" + login.contraseña + "')", (err, resultado) => {

                            if(err){
                                console.log(err);
                                 const objeto_error = {
                                    "mensaje": "informacion ingresada erronea"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                                return 0;
                            }
                            
                            if(resultado.length <= 0){
                                const objeto_error = {
                                    "mensaje": "Usuario y/o contraseña incorrectos"
                                }
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(objeto_error));
                            }

                            const token = jwt.sign({username: resultado[0].nombre},
                                llave, {expiresIn: "30s"});

                            console.log(token);
                        });
                    break;
                    case "/registro":
                        const registro = JSON.parse(informacion);
                        console.log(registro);

                        if(registro.contraseña != registro.contraseña_confirmar){
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

                                conexion_db.query("INSERT INTO `sesion` (`nombre`, `apellido`, `contraseña`, `correo`) VALUES ('" + registro.nombre + "', '" + registro.correo +"', '"+ registro.contraseña +"', '" + imagen_binario +"', '"+ fondo_binario +"', '"+ registro.fondo_cover +"')", (err, resultado) =>{
                                    if(err){
                                        console.log(err)
                                        return 0;
                                    }

                                    console.log(resultado);
                                });
                                

                                conexion_db.query("INSERT INTO `sesion` (`nombre`, `apellido`, `contraseña`, `correo`) VALUES(?, ?, ?, ?, ?)", [registro.nombre, registro.contraseña, registro.correo, registro.contraseña],
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
                }
            });
        break;

        case "PUT":

        break;
        case "OPTIONS":
        response.writeHead(204);
        response.end();
        break;
    }
});

server.listen(puerto, () => {
    console.log("Servidor a la escucha en http://localhost:" + puerto);

});
