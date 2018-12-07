<template>
    <div style="font-size:12px; text-align:left">
       <h3>babel for component steps --- @babel/types处理</h3> 

       
       <ul >
         <li>  1. 组件的对外属性转换 => props 替换为 properties </li>
         <li>  2. Component构造器转换 =>  export default { 替换为 Component({   </li>
         <li>  3. Component构造器转换 => 最后的} 替换为}) </li>
         <li>  4. 组件的内部数据转换 => 取值  vue中，通过this.a取值(data中的值),
              小程序中，通过this.data.a取值 </li>
         <li>  5.  vue中，通过this.a = "value" 赋值 ;<p></p>
              小程序中，通过this.setData({key:value})改变data中的对应值。</li>  
         <li>  6. 组件内部数据处理  data函数转换为对象 <p></p>
           <textarea name="" id="" cols="30" rows="10">

             data(){
              return {
                num:1 
              }
            }, 
            转换为 
            data:{
              num: 1
            }
           </textarea>

         </li>

         <li>  7. 组件的触发事件转换 => vue 中 this.$emit('callChangeCount', _data);  小程序中：triggerEvent </li>
         <li>自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
          this.triggerEvent('customevent', {}, { bubbles: true, composed: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1</li>

          <li> 8.  小程序 中== properties 对外属性值：  type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                     value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
                    vue 中==  value 为 default
                </li>
      </ul> 

<hr>
<ul>
  <h3>后续考虑的vue语法 转换能力增加</h3>
  <li>vue中 props:简写，小程序是否支持调研</li>
</ul>

<hr>
  <ul>
    <li>待办，取data属性中的值</li>
  </ul>
    </div>
</template>
<style scoped>
ul li {
  text-align: left;
}
</style>
<script>
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

import * as babylon from "babylon";
const parser = require("@babel/parser");
export default {
  mounted() {
    this.fnAstTranslet();
  },
  data() {
    return {};
  },
  methods: {
     /****
     *转换案例2  visitor 方式
     */
    fnAstTranslet() {
      function square(n) {
        return n * n;
      }
      function test1({ types: t }) {
        return {
          name: "将n*n修改成n+100",
          visitor: {
            BinaryExpression(path) {
              path.replaceWith(
                t.binaryExpression("+", path.node.left, t.Identifier("100"))
              );
              path.stop();
            }
          }
        }
      }
    }, 
    /****
     *转换案例1  方法修改转换
     */
    traverseAst(str) {
      //存放`this.data`中的属性
      var datas = [];
      //输入
      var code = `
                function testFn(a,b){
                  return a-b
                }
                `;
      //to ast
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      console.log("babylon.parse",ast)

      console.log(generate(ast, {}, code).code);
    }
  },
  created() {}
};
</script>


