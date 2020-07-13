<template>
  <div id="goodsDetail">
    <div id="threeContainer"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
  name: "goodsDetail",
  data() {
    return {
      goodsId: "",
      scene: "",
      camera: "",
      renderer: "",
      controls: "",
      loader: ""
    };
  },
  methods: {
    drawThreeDemo() {
      this.renderer = new THREE.WebGLRenderer();
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.scene.add(this.camera);
      //鼠标控制镜头
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      //创建一个灯光
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      this.scene.add(ambientLight);
      //创建一个点灯光
      var pointLight = new THREE.PointLight(0xffffff, 0.5);
      //给相机添加光源
      this.camera.add(pointLight);
      //渲染器样式
      this.renderer.setClearColor(new THREE.Color("black"));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.setAttribute(
        "style",
        " height:100%;width: 100%;"
      );
      //加载3d模型
      this.loader = new GLTFLoader();
      this.loader.load(
        "path/to/model.glb",
        function(gltf) {
          scene.add(gltf.scene);
        },
        undefined,
        function(error) {
          console.error(error);
        }
      );
      this.$nextTick(() => {
        document
          .getElementById("threeContainer")
          .appendChild(this.renderer.domElement);
      });
    }
  },
  created() {
    this.goodsId = this.$route.query.goodsId;
    this.drawThreeDemo();
  }
};
</script>

<style lang="scss" scoped>
</style>