<template>
    <div style="font-size:12px;">
        babel for component steps

       babel处理： 
     1. css 处理
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
    this.babelGeneratorFn();
  },
  data() {
    return {};
  },
  methods: {
    //Babel 的处理步骤
    /*** 
     *  Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射
     * */
    babelGeneratorFn() {
      const code = `
        .text-ok{
          position: absolute;
          right: 150px;
          color: #e4393c;
        }
        .nut-popup-close{
          position: absolute;
          top: 50px;
          right: 120px;
          width: 50%;
          height: 200px;
          display: inline-block;
          font-size: 26px;
        }`;
     const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
console.log("ast: ",ast)
      traverse(ast, {
        enter(path) {
          console.log("enter: " + path.node.type);
         /*  if (path.node.type === "Identifier" && path.node.name === "n") {
            path.node.name = "x";
          } */
        }
      });
      generate(ast, {}, code)
      console.log(generate(ast, {}, code).code );
    },
  },
  created() {}
};
</script>


