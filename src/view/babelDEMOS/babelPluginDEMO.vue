<template>
  <div style="font-size:12px; text-align:left">babel</div>
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
    this.fn1();
  },
  data() {
    return {
      str:`export default{
           a:1,
          b:2
          }
         `,
         str1:`const number = 'number';
          const numberFive = 5;`
    };
  },
  methods: {
    fn1(){
      let ast = parser.parse(this.str);
      function fn1(path){
        console.log("enter: " + path.node.type);
          if(path.node.type === "ExportDefaultDeclaration"){ alert()
          }
      }

      traverse(ast, {
        ExportDefaultDeclaration:{
          exit: fn1
        }
      });
      // 3.生成
      let output = generate(ast);
      // test
      console.log(output.code);


    },


    pluginFn(){
      var log = console.log;
      // 1.解析
      let ast = parser.parse(this.str1);
      // 2.转换
      function renameConst(name) {
        return name.replace(/([a-z])([A-Z])/, '$1_$2').toUpperCase();
      }
      function renameConstBindings(path) {

        let ownBindings = path.scope.bindings;
        log(ownBindings,path.scope)
        for (let name in ownBindings) {
          if (ownBindings[name].kind === 'const') {
            path.scope.rename(name, renameConst(name));
          }
        }
      }
      traverse(ast, {
        Program: {
          exit: renameConstBindings
        },
        Function: {
          exit: renameConstBindings
        }
      });
      // 3.生成
      let output = generate(ast);
      // test
      console.log(output.code);

    }
  },
  created() {}
};
</script>


