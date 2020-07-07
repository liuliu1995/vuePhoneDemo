<template>
  <div class="home">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in banners" :key="item.index" :style="'background:'+item.bc">
          <div>
            <img :src="item.src" />
          </div>
        </van-swipe-item>
      </van-swipe>
      <!-- 用于读取图片颜色的canvas -->
      <canvas ref="getPicColor" style="display:none;"></canvas>
      <h3 class="main_title">导航一</h3>
      <ul class="nav_list">
        <li v-for="i in 8" :key="i">
          <p>
            <van-icon name="like" size="20rem" color="#ff6700" />
          </p>
          <p>按钮{{i}}</p>
        </li>
      </ul>
      <h3 class="main_title">导航二</h3>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        id="goods_list"
      >
        <waterfall
          id="goods_list"
          :col="2"
          :width="itemWidth"
          :gutterWidth="gutterWidth"
          :data="list"
        >
          <template>
            <van-cell v-for="item in list" :key="item" :id="'goodItem'+item">
              <div class="goods_info_item">
                <div>
                  <img
                    src="../assets/img/banner1.jpg"
                    :style="item%2 == 0?'height:120px;':item%3==0?'height:150px;':''"
                  />
                </div>
                <div>
                  <p>商品名称</p>
                  <p>商品介绍</p>
                  <p>价格</p>
                </div>
              </div>
            </van-cell>
          </template>
        </waterfall>
      </van-list>
      <!-- 返回顶部 -->
      <div class="go_top_btn" v-show="topShow" @click="goTop">
        <van-icon name="arrow-up" size="26rem" color="#ff6700" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import Vue from "vue";
import { List } from "vant";
import axios from "axios";
import QRCode from "qrcodejs2";

Vue.use(List);
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
      ],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      scroll: 0,
      topShow: false
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
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;
        //todo:页码多于一页时有问题
        if (this.list.length >= 40) {
          this.finished = true;
        }
        let readyState = document.readyState;
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.list = [];
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    windowScroll() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.scroll > 300 ? (this.topShow = true) : (this.topShow = false);
    },
    goTop() {
      let timer = setInterval(function() {
        let osTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + ispeed;
        this.topShow = false;
        if (osTop === 0) {
          clearInterval(timer);
        }
      }, 30);
    },
  },
  mounted() {
    //下面是vue中读取banners图片颜色
    const $this = this;
    const canvas = this.$refs.getPicColor;
    for (let i = 0; i < $this.banners.length; i++) {
      $this.getImgColor(canvas, i, $this);
    }
    //窗口滚动
    window.addEventListener("scroll", this.windowScroll);
  },
  computed: {
    itemWidth() {
      return 0.5 * (document.documentElement.clientWidth - 30);
    },
    gutterWidth() {
      return 10;
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
  background-color: #f7f7f7;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 100px;
    background-color: #f7f7f7;
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
.main_title {
  height: 22px;
  line-height: 22px;
  margin-top: 10px;
  font-size: 14rem;
  border-left: 3px solid #ff6700;
  margin-left: 10px;
  padding-left: 10px;
}
.nav_list {
  padding: 10px 10px 0;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  li {
    width: 25%;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
    * {
      cursor: pointer;
    }
  }
}
#goods_list {
  padding: 5px 5px;
  .van-cell {
    margin-bottom: 10px;
    &:not(:last-child)::after {
      display: none; /**去除边线 */
    }
    img {
      height: 80px;
      object-fit: fill;
    }
  }
}
.goods_info_item {
  cursor: pointer;
  * {
    cursor: pointer;
  }
  border-radius: 5px;
  div {
    p:first-child {
      font-size: 14rem;
      color: #333;
    }
    p:nth-child(2) {
      font-size: 12rem;
      color: #666;
    }
    p:last-child {
      font-size: 14rem;
      color: #ff6700;
    }
  }
}
.go_top_btn {
  width: 50px;
  height: 50px;
  line-height: 50px;
  padding-top: 6px;
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #dcdcdc;
  box-shadow: 3px 3px 3px #888;
  text-align: center;
  position: fixed;
  right: 20px;
  bottom: 50px;
  cursor: pointer;
  * {
    cursor: pointer;
  }
}
</style>
<style scoped>
.my-swipe >>> .van-swipe__indicators {
  bottom: 20px;
}
</style>
