<!--
 * @Author: wuxh
 * @Date: 2020-07-02 15:43:04
 * @LastEditTime: 2020-07-02 17:36:39
 * @LastEditors: wuxh
 * @Description:
 * @FilePath: /vux2-demo/src/components/HelloFromVux.vue
-->
<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/vux_logo.png" />
      <h1>vux-uploads example</h1>
    </div>
    <div>
      <uploaders
        :preview="previewMethod"
        :max="varmax"
        :images="images"
        :upload-url="uploadUrl"
        name="file"
        :title="'身份证件照片'"
        :describe="'依次选择身份证姓名面，国徽面'"
        :headers="headers"
      ></uploaders>
    </div>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import Uploaders from 'vux-uploads'

export default {
  components: {
    Group,
    Cell,
    Uploaders
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      images: [],
      varmax: 5,
      uploadUrl: `http://127.0.0.1:3002/upload`,
      headers: {
        // Authorization: window.weixinToken
      }
    }
  },
  methods: {
    previewMethod: function () {
      console.log(123)
    }
  },
  updated(){
    console.log('images--->', this.images)
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px;
}
</style>
