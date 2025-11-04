const http = require("node:http");
const basedatos = require("mysql");
const puerto = 3007;
const server = http.createServer((request, response) => {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const conexion_db = basedatos.createConnection({
        host: 'localhost',
        port: 3307,
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
                case "/obtener_todas_las_sagas":
                    conexion_db.query("SELECT saga_id, link_icono FROM `saga`", (err, resultado) => {
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
                            "sagas": resultado
                        }));
                    });
                    return;
            }

            if (request.url.startsWith("/obtener_personaje_")) {
                var id = request.url.replace("/obtener_personaje_", "");
                const sql_personaje = "SELECT personaje_id, saga_id, nombre_personaje, numero_smash, link_personaje, info_origen FROM `personajes` WHERE personaje_id = ";
                conexion_db.query(sql_personaje + id, (err, resultado) => {
                    if (err || resultado.length == 0) {
                        response.statusCode = 404;
                        response.end(JSON.stringify({
                            "mensaje": "Personaje no existe o error"
                        }));
                        return;
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

        case "POST":

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