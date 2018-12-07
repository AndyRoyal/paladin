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
const parser = require('@babel/parser');
export default {
  mounted() {
     this.replaceFn();
  },
  data() {
    return {};
  },
  methods: {
    /****
     * replace const name to upper
     */
    replaceFn() {
      // 1.解析
      var str  = `const numberFive = 5; var Aaaa = 15;`
      let ast = parser.parse(str);
      // 2.转换
      function renameConst(name) {
        return name.replace(/([a-z])([A-Z])/, "$1_$2").toUpperCase();
      }
      function renameConstBindings(path) {
        let ownBindings = path.scope.bindings;
        for (let name in ownBindings) {
          if (ownBindings[name].kind === "const") {
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
   //   console.log(output.code);
    },
    /****
     * str -> ast -> str
     *
     */
    strToAst(str) {
      var code = `
               export default {
                  props: {
                      code:{
                          type:String,
                          value:null
                      },
                      max: {//传的最大值
                          type: Number,
                          value: 99
                      },
                      min: {
                          type: Number,
                          value: 0
                      },
                      errorMsg: {
                          type:String,
                          value: ''
                      }
                  },
                  data(){
                      return {
                        count:1 
                      }
                  },
                  methods: {
                      /*逻辑事件*/
                      setNewCount:function(count){
                          let _count=this.count;
                          if(count!=_count){
                              let _data={};
                              _data.count=count;
                              if(this.code)_data.code=this.code;
                              this.$emit('callChangeCount', _data);
                              this.count=count;
                          }
                      },
                      /*页面交互*/
                      tapBtn: function(_tar) {
                          //const _tar=evt.currentTarget.dataset.tar;
                          const _max=this.max;
                          const _min=this.min;
                          let _count=this.count;
                          if(_tar=='plus'){
                              if(_count<_max){
                                  _count++;
                              }
                          }else{
                              if(_count>_min){
                                  _count--;
                              }
                          };
                          this.setNewCount(_count);
                      },
                      blurHandle: function(count){
                          //let _value=evt.detail.value;
                          const _max=this.data.max;
                          const _min=this.data.min;
                          let _count=count;
                          if(_count>_max)_count=_max;
                          if(_count<_min)_count=_min;
                          this.setNewCount(_count);
                      },
                      inputHandle:function(count){
                        // let _value=evt.detail.value;
                          this.count=count;
                      }
                  }
                }
                `;

      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });

      const dataObject =
        ast.program.body[0].declaration.properties[0].body.body[0].argument;
      //console.log("vue 原有data属性", dataObject, ast);

      //转换
      traverse(ast, {
        ObjectMethod(path) {
          //console.log("path.node.key.name ",path.node.key.name )// data, add, minus
          // console.log("path.node ",path.node )// data, add, minus
          if (path.node.key.name === "data") {
            // 获取第一级的 BlockStatement，也就是data函数体
            let blockStatement = null; //块语句
            path.traverse({
              //将traverse合并的写法
              BlockStatement(p) {
                blockStatement = p.node;
              }
            });
            // 用blockStatement生成ArrowFunctionExpression
            const arrowFunctionExpression = t.arrowFunctionExpression(
              [],
              blockStatement
            );
            // 生成CallExpression
            const callExpression = t.callExpression(
              arrowFunctionExpression,
              []
            );
            // 生成data property
            const dataProperty = t.objectProperty(
              t.identifier("data"),
              callExpression
            );
            debugger
            // 插入到原data函数下方
            path.insertAfter(dataProperty);

            // 删除原data函数
            path.remove();
          }
        }
      });
      var outJSstr = generate(ast, {}, str).code;
      console.log(generate(ast, {}, code).code);
    },
    /****
     *转换案例2  方法修改转换
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
        };
      }
    },
    fn(e) {}
  },
  created() {}
};
</script>


