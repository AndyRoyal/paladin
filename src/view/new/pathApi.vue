<template>
  <div class="wrap">
    <a href="http://developer.51cto.com/art/201707/546051.html">path操作</a> 
    <a href="http://web.jobbole.com/90993/">path操作-1</a> 
  </div>
</template>
<style scoped>
.wrap{
  font-size: 10px;
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
    this.traverseAst();
  },
  data() {
    return {};
  },
  created(){
    /**
     * 转换方式写法二
     * **/
    function writeFn(){
      //let babel = require('babel-core');//babel核心库
     // let types = require('babel-types');
      let code = `codes.map(code=>{return code.toUpperCase()})`;//转换语句

      let visitor = {
          ArrowFunctionExpression(path) {//定义需要转换的节点
              let params = path.node.params
              let blockStatement = path.node.body
              let func = types.functionExpression(null, params, blockStatement, false, false)
              path.replaceWith(func) //
          }
      }

      let arrayPlugin = { visitor }
      let result = babel.transform(code, {
          plugins: [
              arrayPlugin
          ]
      })
      console.log(result.code)
    }
    
  },
  methods: {
    traverseAst(str) {
      var code = `
        function test(a,b){
          return a + b
        }
                `;
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      traverse(ast, {
        enter(path) {
          let node = path.node;
          if(t.isFunctionDeclaration(node)){
            path.replaceWithSourceString("function a(){ return 1}")
          }
        }
      });
      console.log(generate(ast, {}, code).code);
    }
  },
  created() {
    var types = {
      callExpression: "调用表达式",
      MemberExpression: "成员表达式", //this.num
      NumericLiteral: "数字文字", //2
      stringLiteral: "字符", // "字符串aaa"
      ExpressionStatement:"式语句", //component() 或者 一行代码
      AssignmentExpression: "赋值表达式", // this.num =2
      binaryExpression: "二进制表达式", // a*b
      Identifier: "标识符" // num
    };
    //赋值表达式 : this.num = 2
    var AssignmentExpression = {
      operator: "=",
      left: {
        MemberExpression: {
          MemberExpression: {
            ThisExpression: "this",
            Identifier: "num"
          }
        }
      },
      right: {
        NumericLiteral: 2
      }
    }
  }
};
</script>








