# vux-uploads

## vux-uploads 是什么

vux-uploads 是一个 vue 的上传组件，是对[vux](https://github.com/airyland/vux)组件库的一个补充。  
在 [vux-uploader](https://github.com/greedying/vux-uploader) 的基础上调整，新增 [预览] [删除] [压缩] 等。
因为 vux 并没有对[weui](https://github.com/weui/weui)的[uploader 组件](https://weui.io/#uploader)进行封装，理由见[vux issue 682](https://github.com/airyland/vux/issues/682)，但这又是一个常见需求。在使用 vux 过程中，作者实现了这个组件，现整理开源出来，命名为 vux-uploads

## 示例

![示例](https://github.com/wxingheng/vux-uploads/blob/master/QQ%E6%88%AA%E5%9B%BE20180829144310.png)

![示例](https://github.com/wxingheng/vux-uploads/blob/master/QQ%E5%9B%BE%E7%89%8720180829144425.png)

![示例](https://github.com/wxingheng/vux-uploads/blob/master/QQ%E6%88%AA%E5%9B%BE20180829144346.png)

![示例](https://github.com/wxingheng/vux-uploads/blob/master/QQ%E6%88%AA%E5%9B%BE20180829144400.png)

![示例](https://github.com/wxingheng/vux-uploads/blob/master/QQ%E6%88%AA%E5%9B%BE20180829144413.png)



## vux-uploads 的特点

- 基于 vux，适合 vux 项目
- 暂时不支持 vux `$t`方式的多语言功能
- 增加了删除按钮，点击则删除第一张图片
- 内置图片上传、增加、删除功能，但暂时每次只能操作一张图片
- 接上，允许用户监听事件，自己实现上传、增加、删除功能
- 使用[axios](https://github.com/mzabriskie/axios)进行图片上传
- 使用[lrz](https://github.com/wxingheng/localResizeIMG)进行图片压缩（手机图片如果不压缩会很大）

## 快速使用

1. 检查项目是否符合使用条件

- 需要是使用`vux2`的项目
- 需要安装`babel`对`ES6`部分语法进行转码
- 需要安装`less-loader`正确编译 less 源码
- 只支持`webpack`的方式，暂不提供`umd`版

2. 安装`vux-uploads`

```javascript
npm install vux-uploads --save
```

3. 安装`babel-preset-es2015`

```
npm install babel-preset-es2015 --save
```

4. 使用`vux-uploads`

```javascript
// 引入组件
import Uploaders from "vux-uploads";
```

```javascript
// 子组件
export default {
  ...
  components: {
    ...
    Uploaders,
    ...
  }
  ...
}
```

```javascript
// main.js

// 引入weui的样式
// import './assets/style/weui.css' 将这个文件直接在组件引入，避免额外的依赖。当前可以不引入
// vux 全局组件的注册
import {
  Toast,
  ToastPlugin,
  LoadingPlugin,
} from 'vux'
```

```javascript
  // 使用组件
  <uploaders
    :max="varmax"
    :images="images"
    :handle-click="true"
    :show-header="false"
    :readonly="true"
    :upload-url="uploadUrl"
    name="img"
    :params="params"
    size="small"
    @preview="previewMethod"
    @add-image="addImageMethod"
    @remove-image="removeImageMethod"
  ></uploaders>
```

### props 说明

- images

  - `类型`: Array
  - `默认值`: []，空数组
  - `含义`: 图片数组，格式为 `[ { id: 222, src: 'base64...' }, ...]`
  - `备注`: 变量为数组时，数据流为双向，在组件内部改变数组的值影响父组件

- max

  - `类型`: Number
  - `默认值`: 1
  - `含义`: 图片最大张数
  - `备注`: 图片达到 max 值时，新增按钮消失

- showHeader

  - `类型`: Boolean
  - `默认值`: true
  - `含义`: 是否显示头部
  - `备注`: 控制整个头部的显示

- title

  - `类型`: String
  - `默认值`: 图片上传
  - `含义`: 头部的标题
  - `备注`: 不显示则留空

- showTip

  - `类型`: Boolean
  - `默认值`: true
  - `含义`: 是否显示头部数字部分，即`1/3`部分
  - `备注`: 当`showHeader`为`false`时，header 整体隐藏，此时本参数无效

- readonly

  - `类型`: Boolean
  - `默认值`: false
  - `含义`: 是否只读
  - `备注`: 只读时，新增和删除按钮隐藏

- handleClick

  - `类型`: Boolean
  - `默认值`: false
  - `含义`: 是否接管新增按钮的点击事件，如果是，点击新增按钮不再自动出现选择图片界面
  - `备注`: `true`时，点击新增按钮，则`$emit('add-image')`，可以在此事件内进行自定义的选择图片等操作,`此后图片的新增、上传、删除都由使用者接管`

- autoUpload

  - `类型`: Boolean
  - `默认值`: true
  - `含义`: 选择图片后是否自动上传。是，则调用内部上传接口。否，则`$emit('upload-image', formData)',`formData`为图片内容，用户可监听事件自己上传
  - `备注`: handleClick 为`true`时，无法进行图片选择，故此参数无效。此参数为`false`时，选择图片后,`$emit('upload-image', formData)',`formData`为图片内容

- uploadUrl
  - `类型`: String
  - `默认值`: ''
  - `含义`: 接收上传图片的 url

- name

  - `类型`: String
  - `默认值`: `img`
  - `含义`: 默认上传的时候，图片使用的表单 name
  - `备注`: 无

- params

  - `类型`: Object
  - `默认值`: null
  - `含义`: 上传文件时携带参数
  - `备注`: 无

- size

  - `类型`: String
  - `默认值`: normal
  - `含义`: 尺寸类型
  - `备注`: `normal`为`weui`默认尺寸，`small`为作者定义的小一些的尺寸

- capture
  - `类型`: String
  - `默认值`: ''
  - `含义`: input 的 capture 属性
  - `备注`: 可以设置为`camera`，此时点击新增按钮，部分机型会直接调起相机，注意，各型号手机表现不同，请谨慎使用。`handleClick`为 true 时，此属性无效

### emit 事件说明

- add-image

  - `emit时机`: 当`handleClick`参数为`true`时，点击新增按钮
  - `参数`: 无
  - `备注`: 无

- remove-image

  - `emit时机`: 当`handleClick`参数为`true`时，点击删除按钮
  - `参数`: 无
  - `备注`: 当`handleClick`为`false`时，点击删除按钮，组件内部删除第一张图片；否则，用户需要监听本事件，并进行相应删除操作

- preview

  - `emit时机`: 点击任意一张图片的时候
  - `参数`: 图片对象，格式为 `{ url: 'imgUrl' }`
  - `备注`: 暂时没有实现自动预览功能，如果需要用户监听事件自行实现

- upload-image
  - `emit时机`: `handleClick和`autoUpload`都为`false`时，选择图片
  - `参数`: formData,图片内容生成的 formData
  - `备注`: 可以通过`vm.$refs.input`获取图片的 input 元素

## 待实现事项，欢迎 PR

- [ ] 上传进度实时显示
- [x] 上传错误时，图片显示错误样式
- [ ] 一次选择，多图片上传(为了兼容少数安卓手机的兼容性问题，暂时会退到单张上传。)
- [x] 上传图片的删除
- [x] 上传图片预览 
- [x] 上传图片时，附带 post 参数

## 感谢与参考

- [vux](https://github.com/airyland/vux)
- [weui](https://github.com/weui/weui)
- [axios](https://github.com/mzabriskie/axios)
- [vux-uploaders](https://github.com/greedying/vux-uploader)

## 疑问与讨论

- 请先到[issue](https://github.com/wxingheng/vux-uploads/issues)进行搜索
- 如果上面没有答案，欢迎提[issue](https://github.com/wxingheng/vux-uploads/issues/new)
- 欢迎加 qq: 1228678518 交流
