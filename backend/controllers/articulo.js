"use stric";

// Importar el Modelo

var Articulo = require("../models/articulo");

// Validación de atributos de la colección

var validacion = require("validator");

var fs = require("fs");
var path = require("path");

// Crear el objeto controlador

var controlador = {
  // Métodos de prueba

  insertar: (req, res) => {
    var params = req.body;
    var articulo = new Articulo();
    articulo.title = params.title;
    articulo.content = params.content;
    articulo.image = null;

    // Validar datos

    try {
      var validar_title = !validacion.isEmpty(params.title);
      var validar_content = !validacion.isEmpty(params.content);
    } catch (err) {
      return res.status(404).send({
        status: "Error",
        mensaje: "Faltan datos por enviar",
      });
    }

    if (validar_title && validar_content) {
      articulo.save((err, articuloInsertado) => {
        if (err || !articuloInsertado) {
          return res.status(404).send({
            status: "Error",
            mensaje: "Error al insertar registro",
          });
        }

        return res.status(200).send({
          status: "Completado",
          articuloInsertado,
        });
      });
    } else {
      return res.status(404).send({
        status: "Error",
        mensaje: "Datos no válidos verifique",
      });
    }
  },

  buscar: (req, res) => {
    var ultimo = req.params.last;
    var consulta = Articulo.find({});

    if (ultimo || ultimo != undefined) {
      consulta.limit(5);
    }

    consulta.sort("-_id").exec((err, articulos) => {
      if (err) {
        return res.status(404).send({
          status: "Error",
          mensaje: "Error al devolver articulos",
        });
      }

      if (!articulos) {
        return res.status(200).send({
          status: "Error",
          mensaje: "No existena articulos en la coleccion",
        });
      }

      return res.status(200).send({
        status: "Success",
        articulos,
      });
    });
  },

  busqueda: (req, res) => {
    var articuloid = req.params.id;

    if (!articuloid || articuloid == null) {
      return res.status(404).send({
        //Error
        status: "Error",
        mensaje: "No se ingreso ID",
      });
    }

    Articulo.findById(articuloid, (err, articulo) => {
      if (err || !articulo) {
        return res.status(404).send({
          status: "Error:",
          mensaje: "Artículo Inexistente",
        });
      }

      return res.status(200).send({
        status: "Articulo Encontrado",
        articulo,
      });
    });
  },

  actualizar: (req, res) => {
    var articuloid = req.params.id;

    var params = req.body;

    try {
      var validar_title = !validacion.isEmpty(params.title);
      var validar_content = !validacion.isEmpty(params.content);
    } catch (err) {
      return res.status(404).send({
        status: "Error",
        mensaje: "Faltan datos por enviar",
      });
    }

    if (validar_title && validar_content) {
      Articulo.findOneAndUpdate({ _id: articuloid }, params, { new: true }, (err, articuloActualizado) => {
        if (err) {
          return res.status(404).send({
            status: "Error",
            mensaje: "Error al Actualizar.",
          });
        }

        if (!articuloActualizado) {
          return res.status(404).send({
            status: "Error",
            mensaje: "No existe el articulo a actualizar.",
          });
        }

        return res.status(200).send({
          status: "Articulo Actualizado",
          articuloActualizado,
        });
      });
    } else {
      return res.status(404).send({
        status: "Error",
        mensaje: "Los datos no son valido verifique",
      });
    }
  },

  eliminar: (req, res) => {
    var articuloid = req.params.id;

    if (!articuloid || articuloid == null) {
      return res.status(404).send({
        status: "Error",
        mensaje: "No se ingreso ID",
      });
    }

    Articulo.findByIdAndDelete(articuloid, (err, articulo) => {
      if (err || !articulo) {
        return res.status(404).send({
          status: "Error:",
          mensaje: "Artículo no Encontrado",
        });
      }

      return res.status(200).send({
        status: "Articulo Eliminado",
        articulo,
      });
    });
  },

  cargar_imagen: (req, res) => {
    //Conocer los elementos de una imagen JSON al subir
    var ruta_archivo = req.files.file0.path; //sube el archivo a la carpeta

    //separar los elementos de la ruta para obtener el nombre del archivo y la extension

    var nombre_split = ruta_archivo.split("\\");

    //separar el nombre del archivo
    var nombre_archivo = nombre_split[2]; //arreglo

    //separar la extension del nombre del archivo
    var extension_split = nombre_archivo.split("."); //arreglo
    var extension_archivo = extension_split[1];

    //validar que sea una extension de imagen valida
    if (extension_archivo == "jpg" || extension_archivo == "jpeg" || extension_archivo == "png" || extension_archivo == "gif") {
      //recoger el ID de URL
      var articuloid = req.params.id;

      //Actualizar el valor del campo image
      Articulo.findOneAndUpdate({ _id: articuloid }, { image: nombre_archivo }, { new: true }, (err, articuloActualizado) => {
        if (err || !articuloActualizado) {
          return res.status(404).send({
            status: "Error",
            mensaje: "Error no fue posible actualizar la imagen",
          });
        }
        return res.status(200).send({
          status: "Registro con la imagen actualizada",
          articuloActualizado,
        });
      });
    } else {
      fs.unlink(ruta_archivo, (err) => {
        return res.status(404).send({
          status: "Error",
          mensaje: "Error el tipo de archivo no es valido como imagen ",
        });
      });
    }
  },

  sacar_imagen: (req, res) => {
    var archivo = req.params.image;

    var ruta_archivo = "./upload/images/" + archivo;

    fs.exists(ruta_archivo, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(ruta_archivo));
      } else {
        return res.status(404).send({
          status: "Error",
          mensaje: "El archivo no existe",
        });
      }
    });
  },

  consulta: (req, res) => {
    var cadena = req.params.cadena;

    /* Find or si el valor de la cadena esta incluido (i) dentro del title entonces sacar los
    articulos o si el valor de la cadena esta incluido (i) dentro del content sacar los articulos */

    Articulo.find(
      { $or: [
        { title: { $regex: cadena, $options: "i" } },
        { content: { $regex: cadena, $options: "i" } }] 
      })
      .sort("-date")
      .exec((err, articulos) => {
        if (err) {
          return res.status(404).send({
            //Error
            status: "No fue posible ejecutar la consulta",
          });
        }

        if (!articulos) {
          return res.status(404).send({
            //Error
            status: "No hay articulos que coincidan con el parametro de consulta",
          });
        }

        return res.status(200).send({
          //Registros consultados con exito
          status: "Registros consultados con exito",
          articulos,
        });
      });
  },
};

module.exports = controlador;
