"use stric";

// Importar el Modelo

var Compra = require("../models/compra");

// Validación de atributos de la colección

var validacion = require("validator");

var fs = require("fs");
var path = require("path");

var controlador = {
  insertar: (req, res) => {
    var params = req.body;
    var compra = new Compra();
    compra.cantidad = params.cantidad;
    compra.monto = params.monto;

    // Validar datos

    try {
      var validar_cantidad = !validacion.isEmpty(params.cantidad);
      var validar_monto = !validacion.isEmpty(params.monto);
    } catch (err) {
      return res.status(404).send({
        status: "Error",
        mensaje: "Faltan datos por enviar",
      });
    }

    if (validar_cantidad && validar_monto) {
      compra.save((err, compraInsertada) => {
        if (err || !compraInsertada) {
          return res.status(404).send({
            status: "Error",
            mensaje: "Error al realizar compra",
          });
        }

        return res.status(200).send({
          status: "Completado",
          compraInsertada,
        });
      });
    } else {
      return res.status(404).send({
        status: "Error",
        mensaje: "Datos no válidos verifique",
      });
    }
  },

  busqueda: (req, res) => {
    var compraid = req.params.id;

    if (!compraid || compraid == null) {
      return res.status(404).send({
        status: "Error",
        mensaje: "No se ingreso ID",
      });
    }

    Compra.findById(compraid, (err, compra) => {
      if (err || !compra) {
        return res.status(404).send({
          status: "Error:",
          mensaje: "Compra Inexistente",
        });
      }

      return res.status(200).send({
        status: "Compra encontrada",
        compra,
      });
    });
  },

  buscar: (req, res) => {
    var ultimo = req.params.last;
    var consulta = Compra.find({});

    if (ultimo || ultimo != undefined) {
      consulta.limit(5);
    }

    consulta.sort("-_id").exec((err, compras) => {
      if (err) {
        return res.status(404).send({
          status: "Error",
          mensaje: "Error al devolver comrpas",
        });
      }

      if (!articulos) {
        return res.status(200).send({
          status: "Error",
          mensaje: "No hay compras en la coleccion",
        });
      }

      return res.status(200).send({
        status: "Success",
        compras,
      });
    });
  },

  actualizar: (req, res) => {
    var compraid = req.params.id;

    var params = req.body;

    try {
      var validar_cantidad = !validacion.isEmpty(params.cantidad);
      var validar_monto = !validacion.isEmpty(params.monto);
    } catch (err) {
      return res.status(404).send({
        status: "Error",
        mensaje: "Faltan datos por enviar",
      });
    }

    if (validar_cantidad && validar_monto) {
      Compra.findOneAndUpdate({ _id: compraid }, params, { new: true }, (err, compraActualizada) => {
        if (err) {
          return res.status(404).send({
            status: "Error",
            mensaje: "Error al Actualizar.",
          });
        }

        if (!compraActualizada) {
          return res.status(404).send({
            status: "Error",
            mensaje: "No hay compra por actualizar.",
          });
        }

        return res.status(200).send({
          status: "Compra Actualizado",
          compraActualizada,
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
    var compraid = req.params.id;

    if (!compraid || compraid == null) {
      return res.status(404).send({
        status: "Error",
        mensaje: "No se ingreso ID",
      });
    }

    Compra.findByIdAndDelete(compraid, (err, compra) => {
      if (err || !compra) {
        return res.status(404).send({
          status: "Error:",
          mensaje: "Compra no Encontrado",
        });
      }

      return res.status(200).send({
        status: "Compra Eliminada",
        compra,
      });
    });
  },
};

module.exports = controlador;
