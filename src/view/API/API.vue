<template>
  <div style="font-size:12px; text-align:left">
    <h3>@babel/types</h3>

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
    this.traverseAst();
  },
  data() {
    return {};
  },
  methods: {
    traverseAst(str) {
      //输入
      var code = `
           var a  = 1
                `;
      //to ast
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      console.log("parse ast",ast)

      //转换 ast
      traverse(ast, {
        enter(path) {
          //console.log("enter: " + path.node.type);
        }
      });

      console.log(generate(ast, {}, code).code);

      //other
      function builderMPAST(t) {
        const MPAST = t.objectProperty(
          t.identifier("myprop"),
          t.stringLiteral("hello my property")
        );
      }
      //builderMPAST();
    }
  },
  created() {}
};
</script>


