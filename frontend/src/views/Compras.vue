<template>
  <div class="blog">
    <Header />
    <Slider texto="Sección de Compras" />
    <div class="center">
      <section id="content"></section>
      <Sidebar2 />
      <div class="clearfix"></div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
import Sidebar2 from "../components/Sidebar2.vue";

import Slider from "../components/Slider.vue";
import Footer from "../components/Footer.vue";

import axios from "axios";

//importar la ruta global
import Global from "../Global";

//importar el modelo
import ModeloArticulo from "../model/Compra.js";

//importar la libreria de alertas "sweetalert"
import SweetAlert from "sweetalert";

export default {
  name: "Compras",
  components: {
    Header,
    Sidebar,
    Footer,
    Slider,
    Sidebar2,
  },
  data() {
    return {
      url: Global.url,
      compra : []
    };
  },
  mounted() {
    this.getCompras();
  },
  methods: {
    getCompras() {
      axios.get(this.url + "buscarCompras").then((res) => {
        if (res.data.status == "exitosa") {
          this.compra = res.data;
          console.log(this.compra);
        }
        console.log(res);
      });
    },
  },
};
</script>
