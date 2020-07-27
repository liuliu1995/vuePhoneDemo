<template>
  <div id="goodsDetail">
    <div id="threeContainer"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  name: "goodsDetail",
  data() {
    return {
      goodsId: "",
      scene: "", //场景
      camera: "", //相机
      renderer: "", //渲染器
      controls: "", //控制器
      loader: ""
    };
  },
  methods: {
    /**场景 */
    initSence() {
      this.scene = new THREE.Scene();
    },
    /**相机 */
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      this.camera.position.set(-3,-0,5);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    /**渲染器 */
    initRender() {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x400206);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.setAttribute(
        "style",
        "height:100%;width: 100%;"
      );
      document
        .getElementById("threeContainer")
        .appendChild(this.renderer.domElement);
    },
    /**灯光 */
    initLight() {
      let pointLight = new THREE.PointLight(0xffffff, 1.5, 2000);
      pointLight.position.set(-10, 10, 5); //点光源位置
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 1024;
      pointLight.shadow.mapSize.height = 1024;
      this.scene.add(pointLight);
    },
    /**控制器 */
    initControl() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    /**加载3d模型 */
    loadGltf() {
      const _this = this;
      //加载3d模型
      this.loader = new GLTFLoader();
      this.loader.load(
        "models/Kulou/scene.gltf",
        function (gltf) {
          // console.log(gltf);
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              child.material.emissive = child.material.color;
              child.material.emissiveMap = child.material.map;
            }
          });
          _this.scene.add(gltf.scene); // 将模型引入three
          _this.render();
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.error(error);
        }
      );
    },
    render() {
      this.renderer.render(this.scene, this.camera); //执行渲染操作
    },
    /* 循环渲染 */
    animate() {
      this.controls.update();
      this.render();
      requestAnimationFrame(this.animate);
    },
    /**初始化 */
    initThree() {
      this.initSence();
      this.initCamera();
      this.initRender();
      this.initLight();
      this.initControl();
      this.loadGltf();
    },
  },
  created() {
    this.goodsId = this.$route.query.goodsId;
    this.$nextTick(() => {
      this.initThree();
      this.animate();
    });
  },
};
</script>

<style lang="scss" scoped>
// #threeContainer {
//   width: 100%;
//   height: 250px;
// }
</style>