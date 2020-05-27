<template>
  <div class="home">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in banners" :key="item.index" :style="'background:'+item.bc">
        <div>
          <img :src="item.src" />
        </div>
      </van-swipe-item>
    </van-swipe>
    <!-- 用于读取图片颜色的canvas -->
    <canvas ref="getPicColor" style="display:none;"></canvas>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      banners: [
        {
          src: require("../assets/img/banner1.jpg"),
          bc: ""
        },
        {
          src: require("../assets/img/banner2.jpg"),
          bc: ""
        },
        {
          src: require("../assets/img/banner3.jpg"),
          bc: ""
        },
        {
          src: require("../assets/img/banner4.jpg"),
          bc: ""
        }
      ]
    };
  },
  methods: {
    getImgColor(canvas, index, $this) {
      const img = new Image();
      img.crossOrigin = ""; //处理canvas图片跨域问题
      img.src = $this.banners[index].src;
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        // 获取像素数据
        const data1 = context.getImageData(0, 0, 1, 1).data;
        const data2 = context.getImageData(
          img.width - 1,
          img.height - 1,
          img.width,
          img.height
        ).data;
        // 取所有像素的平均值
        let r1 = 0,
          r2 = 0,
          g1 = 0,
          g2 = 0,
          b1 = 0,
          b2 = 0;
        const index1 = 0;
        // 取开始像素的颜色
        r1 += data1[index1 * 4 + 0];
        g1 += data1[index1 * 4 + 1];
        b1 += data1[index1 * 4 + 2];

        // 将最终的值取整
        r1 = Math.round(r1);
        g1 = Math.round(g1);
        b1 = Math.round(b1);
        const index2 = 0;

        r2 += data2[index2 * 4 + 0];
        g2 += data2[index2 * 4 + 1];
        b2 += data2[index2 * 4 + 2];

        // 将最终的值取整
        r2 = Math.round(r2);
        g2 = Math.round(g2);
        b2 = Math.round(b2);
        const color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";
        const color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
        //rgb转16进制 位运算
        // const color = ((r << 16) | (g << 8) | b).toString(16);
        const style = "linear-gradient(to right," + color1 + "," + color2 + ")";
        $this.banners[index].bc = style;
      };
    }
  },
  mounted() {
    //下面是vue中读取banners图片颜色
    const $this = this;
    const canvas = this.$refs.getPicColor;
    for (let i = 0; i < $this.banners.length; i++) {
      $this.getImgColor(canvas, i, $this);
    }
  }
};
</script>
<style lang="scss" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20rem;
  background: linear-gradient(to right, #111, #666);
  position: relative;
  width: 100%;
  height: 170px;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 100px;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 120px;
    border-radius: 50%;
  }
  > div {
    width: calc(100% - 40px);
    height: 150px;
    text-align: center;
    border-radius: 5px;
    position: absolute;
    left: 20px;
    top: 10px;
    z-index: 2;
    box-shadow: 3px 3px 3px #666;
    overflow: hidden;
    > img {
      width: 100%;
      height: 150px;
      object-fit: fill;
    }
  }
}
</style>
<style scoped>
.my-swipe >>> .van-swipe__indicators {
  bottom: 20px;
}
</style>
