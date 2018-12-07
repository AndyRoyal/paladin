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
import * as babylon from "babylon";
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
export default {
  mounted() {
   // this.pathVistor();
  },
  data() {
    return {
      jsStr: `var a =1`
    };
  },
  methods: {
    
    /****  --xx--
     * visitor 模式中我们对节点的访问实际上是对节点路径的访问，在这个模式中我们一般把path 当作参数传入节点选择器中。
     * path 表示两个节点之间的连接，通过这个对象我们可以访问到节点、父节点以及进行一系列跟节点操作相关的方法（类似 DOM 的操作）
     */
    pathVistor() {
    //  var babel = require("babel-core");
      const code = `d = a + b + c`;

      const visitor = {
        Identifier(path) {
          console.log(path.node.name); // d a b c
        }
      };

      const result = babel.transform(code, {
        plugins: [
          {
            visitor: visitor
          }
        ]
      });
    },

    /****
     * 将this.count替换为this.data.count
     */
    replaceWithSouceStringFn() {
      const code = `this.count`;
      const ast = babylon.parse(code);

      traverse(ast, {
        MemberExpression(path) {
          if (
            t.isThisExpression(path.node.object) &&
            t.isIdentifier(path.node.property, {
              name: "count"
            })
          ) {
            //方法1
            path.get("object").replaceWithSourceString("this.data");
            //方法2
            /*  path
              .get("object") // 获取`ThisExpresssion`
              .replaceWith(
                t.memberExpression(t.thisExpression(), t.identifier("data"))
              ); */
          }
        }
      });
      console.log(generate(ast, {}, code).code); // this.data.count;
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


