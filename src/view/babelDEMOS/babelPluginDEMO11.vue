<template>
  <div style="font-size:12px; text-align:left"></div>
</template>
<style scoped>
ul li {
  text-align: left;
}
</style>
<script>
//const babel = require('babel-core');
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

import * as babylon from "babylon";
const parser = require("@babel/parser");
export default {
  mounted() {
    this.pluginFn();
  },
  data() {
    return {
      str:`
          const number = 'number';
          const numberFive = 5;
         `
    };
  },
  methods: {
    pluginFn(){
      const code = 'NEJ.define(["./modal"], function(Modal){});';
      let args = [];
      const visitor = {
          ExpressionStatement(path) {
              if (path.node && path.node.arguments) {
                  args = path.node.arguments;
              }
          },
          MemberExpression(path) {
              if (path.node && path.node.object && path.node.object.name === 'NEJ') {
                  path.replaceWith(t.CallExpression(
                      t.identifier('define'), args
                  ))
              }
          }
      }
/*       const result = babel.transform(code, {
          plugins: [{
              visitor
          }]
      })
      console.log(result.code) */
    }
  },
  created() {}
};
</script>


