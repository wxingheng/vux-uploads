<template>
  <div class="weui-cell">
    <div class="weui-cell__bd">
      <div class="weui-uploader">
        <div v-show="showHeader" class="weui-uploader__hd">
          <slot name="label">
            <p class="weui-uploader__title"> {{ title }} </p>
           </slot>
          <div v-show="showHeader && showTip" class="weui-uploader__info">
            {{ images.length }} / {{ max }}
          </div>
        </div>
        <div class="weui-uploader__bd" :class="{small: size === 'small'}">
          <ul class="weui-uploader__files">
            <uploader-item v-for="(image, i) in images" :render-src="image.src" :key="image.id" @click.native="preview(image, i)"></uploader-item>
          </ul>
          <div v-show="!readonly && images.length < max" class="weui-uploader__input-box" @click="add">
            <input v-if="!handleClick" ref="file" class="weui-uploader__input"  type="file" accept="image/*" :capture="showCapture" @change="change">
          </div>
        </div>
        <div >
          <p class="uploader_msg"> {{ describe }} </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploaderItem from "./uploader-item.vue";
import axios from "axios";
import weui from "weui.js";
import lrz from "lrz";
import '../assets/style/weui.css'


export default {
  props: {
    images: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 1
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showTip: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "图片上传"
    },
    // 是否接管+号的click事件，如果是，点击不弹出选择文件的框
    handleClick: {
      type: Boolean,
      default: false
    },
    // 选择文件后是否自动上传，如果不是，则emit change事件
    autoUpload: {
      type: Boolean,
      default: true
    },
    uploadUrl: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "normal"
    },
    capture: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: "img"
    },
    params: {
      type: Object,
      default: null
    },
    describe: {
      type: String,
      default: ""
    },
    headers: {
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  components: {
    UploaderItem
  },
  methods: {
    add() {
      if (this.handleClick) {
        this.$emit("add-image");
      }
    },
    // 移除第一张图
    remove() {
      if (this.handleClick) {
        this.$emit("remove-image");
      } else {
        this.images.shift();
      }
    },
    preview(image, i) {
      // 暂未实现，可以捕捉preview事件自己实现
      // this.$emit("preview", image);
      //  url = url.match(/url\((.*?)\)/)[1].replace(/"/g, "");
      let url = image.src;
      var gallery = weui.gallery(url, {
        className: "custom-classname",
        onDelete: () => {
          gallery.hide();
          this.images.splice(i, 1);
          // if(confirm('确定删除该图片？')){ console.log('删除'); }
          // gallery.hide(function() {
          //     console.log('`gallery` has been hidden');
          // });
        }
      });
    },
    // 适用于action的情况
    change() {
      if (this.handleClick) {
        return;
      }
      const list = this.$refs.file.files;
      const postList = [];
      if (list.length + this.images.length > this.max) {
        this.$vux.toast.show({
          type: "warn",
          position: "middle",
          text: "你选择的图片已达上限，请删减"
        });
        return;
      }
      let resultCount = list.length;
      let isFinish = false;
      for (let i = 0; i < list.length; i++) {
        // 尝试压缩图片
        lrz(list[i])
          .then(rst => {
            // 处理成功会执行
            let formData = rst.formData;
            if (this.autoUpload) {
              if (!this.uploadUrl) {
                console.error("uploadUrl不应为空");
              }

              if (this.$vux && this.$vux.loading) {
                this.$vux.loading.show("正在上传");
              }
              postList.push(
                axios.post(this.uploadUrl, formData, {
                  headers: this.headers
                })
              );
              resultCount--;
            } else {
              this.$emit("upload-image", formData);
            }
          })
          .catch(function(err) {
            // 处理失败会执行
          })
          .always(() => {
            // 不管是成功失败，都会执行
            if (resultCount === 0 && !isFinish) {
              isFinish = true;
              Promise.all(postList)
                .then(resultList => {
                  for (let i = 0; i < postList.length; i++) {
                    if (this.$vux && this.$vux.loading) {
                      this.$vux.loading.hide();
                    }
                    const item = {
                      id: resultList[i].data.toString()
                    };
                    this.images.push(item);
                    this.html5Reader(list[i], item);
                  }
                  this.$refs.file.value = "";
                })
                .catch(() => {
                  if (this.$vux && this.$vux.loading) {
                    this.$vux.loading.hide();
                    this.$vux.toast.show({
                      type: "warn",
                      position: "middle",
                      text: "图片上传失败，请重试！"
                    });
                  }
                });
            }
          });
      }
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.$set(item, "src", e.target.result);
      };
    }
  },
  computed: {
    showCapture() {
      return this.capture || undefined;
    }
  }
};
</script>
<style scoped lang="less">
@import "~vux/src/styles/weui/widget/weui-uploader/index.less";
.remove:before {
  width: 0;
  height: 0;
}
.weui-uploader__bd.small {
  .weui-uploader__input-box {
    margin-right: 5px;
    margin-bottom: 5px;
    width: 58px;
    height: 58px;
  }
  .weui-uploader__file {
    width: 60px;
    height: 60px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.uploader_msg {
  color: #5cb85c;
  font-size: 14px;
}
</style>
