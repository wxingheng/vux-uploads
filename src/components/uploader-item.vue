<!--
 * @Author: wuxh
 * @Date: 2020-07-02 15:51:15
 * @LastEditTime: 2020-07-02 17:28:20
 * @LastEditors: wuxh
 * @Description:
 * @FilePath: /vux-uploads/src/components/uploader-item.vue
-->
<template>
  <li class="weui-uploader__file">
    <img :src="renderSrc" />
  </li>
</template>

<script>
export default {
  props: {
    renderSrc: {
      type: String,
      default: ''
    }
  },
  methods: {
    remove () {}
  }
}
</script>
<style>
.weui-uploader__file {
  position: relative;
}
.weui-uploader__file i {
  position: absolute;
  top: 0px;
  right: -5px;
}
.weui-uploader__file > img {
  width: 79px;
  height: 79px;
}
</style>
