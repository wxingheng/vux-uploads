<template>
  <li class="weui-uploader__file">
     <img :src="renderSrc">
  </li>
</template>

<script>
export default {
  props: {
    renderSrc: {
      type: String,
      default: ""
    }
  },
  methods: {
    remove(){

    }
  }
};
</script>
<style>
.weui-uploader__file{
  position: relative;
}
.weui-uploader__file i{
   position: absolute;;
    top: 0px;
    right: -5px;
}
.weui-uploader__file > img {
  width: 79px;
  height: 79px;
}
</style>
