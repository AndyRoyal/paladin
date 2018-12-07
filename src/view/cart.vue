<template>
 <div>
  <!-- 普通标签 -->
  <h1>普通标签</h1>  
   <em>1</em>
   <ul><!-- 小程序列表标签处理为view -->
     <li>2</li>
   </ul>
  <dl>dl</dl>
  <h1>h1</h1>
  <s>s</s>
  <i>i</i>
  <span>span</span>

  <!-- 特殊标签 -->
  <h1>特殊标签</h1>  
  <router-link :to="{path:'/',query:{s:''}}">
      首页<em >&gt;</em>
  </router-link>

  <!-- 常用指令 -->
  <h1>常用指令</h1>  
  
  <p v-if='testIf' v-for="(item,index) in [1,2,3,4]" :key='index'>
      {{item}}  v-if  v-for  :key 
  </p>
  
  <p v-if='testElse' v-show="testIf">
    v-show
  </p>
  
  <!-- 常用事件 -->
  <h1>常用事件</h1>  
  <span @click="testFn">click事件不带参数</span>
  <span @click="testFn1(P1,P2)">click事件带参数</span>
  
  <!-- 内部组件(子组件) 以及特殊组件处理被小程序封装的原生组件（表单，画布，媒体） -->
  <h1>内部组件</h1>  

  <!--   我们不支持逆向转换，所以地图，导航，支持忽视 -->
 <!--  我们只需要关心我们转换后的 html标签，转成 小程序的原生组件时，可能会出现的问题 -->
  转换标签以及组件时
  注意：表单组件button ,checkbox, input ,form, radio textarea等等基本都是小程序封装过的原生组件
  <h1>转换目标： 小程序原生组件</h1>  
  参考 https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html
  


 
  
  
 </div>
</template>








<style scoped>
.cart {
  height: 100px;
}
</style>
<script>
export default {
  data() {
    return {
      testElse: false,
      testIf: true,
      good: {
        cart: 111
      }
    };
  },
  methods: {},
  created() {}
};
</script>


