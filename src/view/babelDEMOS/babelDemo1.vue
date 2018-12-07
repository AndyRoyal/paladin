<template>
    <div style="font-size:12px;">
        babel for component steps

       babel处理： 
      //  1. props 替换为 properties
      // 2. export default { 替换为 Component({  
      // 3. 最后的} 替换为})
    </div>
</template>
<style scoped>
</style>
<script>
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

import * as babylon from "babylon";
const parser = require("@babel/parser");
export default {
  mounted() {
    this.babylonParseFn();
    this.babelTraverseFn();
    this.babelGeneratorFn();
  },
  data() {
    return {};
  },
  methods: {
    //Babel 的处理步骤
    //Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。对应着babel-core源码中分别用到的babylon、babel-traverse、babel-generator。
    /*** 第1步
     *  Babylon 是 Babel 的解析器。最初是 从Acorn项目fork出来的。Acorn非常快，易于使用。
     * */
    babylonParseFn() {
      const code = `function add(a) {
        return a + a;
      }`;

      //console.log(babylon.parse(code)); //Node {type: "File", start: 0, end: 47, loc: SourceLocation, program: Node, …}
    },
    /*** 第2步
     *  Babel Traverse（遍历）模块维护了整棵树的状态，
     * 并且负责替换、移除和添加节点。我们可以和 Babylon 一起使用来遍历和更新节点。
     * */
    babelTraverseFn() {
      const code = `function square(n) {
        return n * n;
      }`;

      const ast = babylon.parse(code);

      traverse(ast, {
        enter(path) {
        //  console.log("enter: " + path.node.type);
          if (path.node.type === "Identifier" && path.node.name === "n") {
            path.node.name = "x";
          }
        }/* ,
        leave(path) {
          console.log("leave: " + path.node.type);
        }  */
      });
    },
    /*** 第3步
     *  Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射
     * */
    babelGeneratorFn() {
    const code = `function square(n) {
        return n * n;
      }`;

      const ast = babylon.parse(code);

      traverse(ast, {
        enter(path) {
          //console.log("enter: " + path.node.type);
          if (path.node.type === "Identifier" && path.node.name === "n") {
            path.node.name = "x";
          }
        }
      });
      generate(ast, {}, code)
      console.log(generate(ast, {}, code).code );
    },
  },
  created() {}
};
</script>


