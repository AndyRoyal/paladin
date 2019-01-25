<template>
  <div></div>
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
    this.traverseAst();
  },
  data() {
    return {};
  },
  methods: {
    traverseAst(str) {
      var dataAST, MethodsAst, propsAst;
      var propertiesAST;
      var testOBJ;
      //存放`this.data`中的属性
      var datas = [];
      //输入
      var code = `
               export default {
                  name: "footerCom",
                  props: {
                      code:{
                          type:String,
                          value:'abc'
                      }
                  },
                  data(){
                      return {
                        num:1
                      }
                  },
                  methods: {
                     textFn() {
                       this.num = 888
                    }
                  }
                }
                `;
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      traverse(ast, {
        enter(path) {
          console.log("path \n",path.node.type)
          if (path.node.type === "ThisExpression") {
            // 不会遍历函数内部的this，只遍历钩子内部一级
            if (path.parent.property.name === "$emit") {
              path.parent.property.name = "triggerEvent";
            }
          }
          if (path.node.type === "ObjectMethod") {
            console.log("path.node.key.name \n",path.node.key.name)
            if (path.node.key.name === "mounted") {
              path.node.key.name = "ready";
            } else if (path.node.key.name === "created") {
              path.node.key.name = "attached";
            } else if (path.node.key.name === "destroyed") {
              path.node.key.name = "detached";
            } else if (path.node.type === "ThisExpression") {
              console.log("ObjectMethod内部this表达式", path.node);
            } else {
              void null;
            }
          }
        },
        ObjectMethod(path) {
          
        },
        ObjectProperty(path) {
          if (path.node.key.name === "data") {

          } else if (path.node.key.name === "watch") {
            path.remove();
          } else if (path.node.key.name === "props") {
            path.node.key.name = "properties";
          } else if (path.node.key.name === "name") {
            path.remove();
          } else if (path.node.key.name === "computed") {
            path.remove();
          } else if (path.node.key.name === "methods") {
            path.traverse({
              enter(path) {},
              ObjectExpression(path) {
                if (path.node.properties) {
                  path.traverse({
                    ObjectMethod(path) {
                      path.insertBefore(t.memberExpression(t.thisExpression(), t.identifier('setData')));
                    },
                    MemberExpression(path) {
                      console.log("enter22: " + path.node);
                      let datasVals = datas.map((item, index) => {
                        return item.key.name; 
                      });
                      let ifs = path.node.object.type === "ThisExpression" && datasVals.includes(path.node.property.name) && !(t.isAssignmentExpression(path)) 
                      if (ifs) {
                        path.get("object").replaceWithSourceString("this.data");
                        if (
                          (t.isAssignmentExpression(path.parentPath) &&
                            path.parentPath.get("left") === path) ||
                          t.isUpdateExpression(path.parentPath)
                        ) {
                          // find path
                          var  expressionStatement = path.findParent(
                            parent => {
                              parent.isFunctionExpression();
                            }
                          );
                          console.log(11,expressionStatement)
                          if (expressionStatement) {
                            const finalExpStatement = t.expressionStatement(
                              t.callExpression(
                                t.memberExpression(
                                  t.thisExpression(),
                                  t.identifier("setData")
                                ),
                                [
                                  t.objectExpression([
                                    t.objectProperty(
                                      t.identifier(path.node.property.name),
                                      t.identifier(
                                        `this.data.${path.node.property.name}`
                                      )
                                    )
                                  ])
                                ]
                              )
                            );
                            console.log("finalExpStatement1", finalExpStatement);
                            path.insertBefore(finalExpStatement)
                           // expressionStatement.insertAfter(finalExpStatement);
                          }
                        }
                      }
                    }
                  });
                }
              }
            });
          }
          path.skip();
        },
        ObjectMethod(path) {
          if (path.node.key.name === "data") {
            path.traverse({
              BlockStatement(p) {
                datas = p.node.body[0].argument.properties;
              }
            });
            //生成objectExpression
            const objectExpression = t.objectExpression(datas);
            //创建data对象并赋值
            const dataProperty = t.objectProperty(
              t.identifier("data"),
              objectExpression
            );
            //拿到ts后的data
            dataAST = dataProperty;
            // 插入到原data函数下方
            path.insertAfter(dataProperty);
            path.remove();
          }
        },
        ExportDefaultDeclaration(path) {
          //Component({})
          function insertBeforeFn(path) {
            const objectExpression = t.objectExpression(propertiesAST);
            testOBJ = t.expressionStatement(
              t.callExpression(t.identifier("Compontents"), [objectExpression])
            );
          }
          if (path.node.type === "ExportDefaultDeclaration") {
            if (path.node.declaration.properties) {
              //提取属性并存储
              propertiesAST = path.node.declaration.properties;
              //创建MP AST包裹对象
              insertBeforeFn(path);
              path.insertBefore(
                t.expressionStatement(t.stringLiteral("start.."))
              );
              path.insertAfter(t.expressionStatement(t.stringLiteral("end..")));
            }
            /*    var builderTest = t.binaryExpression(
              "*",
              t.identifier("a"),
              t.identifier("b")
            ); */
          }
        }
      });
      console.log(generate(testOBJ, {}, code).code);

      function builderMPAST(t) {
        const MPAST = t.objectProperty(
          t.identifier("myprop"),
          t.stringLiteral("hello my property")
        );
      }
      //builderMPAST();
    }
  },
  created() {
    var types = {
      callExpression: "调用表达式",
      MemberExpression: "成员表达式", //this.num
      NumericLiteral: "数字文字", //2
      stringLiteral: "字符串文字", // "字符串aaa"
      ExpressionStatement: "表达式语句", //component() 或者 一行代码
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
    };

    /**_____________________ 小程序自定义组件生命周期 与其他钩子函数_____________________**/

    //created 组件实例化，但节点树还未导入，因此这时不能用setData
    //
    //attached 节点树完成，可以用setData渲染节点，但无法操作节点
    //
    //ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点
    //
    //moved 组件实例被移动到树的另一个位置
    //
    //detached 组件实例从节点树中移除
    var mpLife = {
      created: function() {}, // 组件在内存中创建完毕执行
      attached: function() {}, // 组件挂载之前执行
      ready: function() {}, // 组件挂载后执行
      detached: function() {}, // 组件移除执行
      moved: function() {} // 组件移动的时候执行
    };

    //**_____________________ vue组件的生命周期函数 与其他钩子_____________________**/
    var VueLife = {
      beforeCreate() {},
      created() {},
      beforeMount() {},
      mounted() {},
      beforeUpdate() {},
      updated() {},
      beforeDestroy() {},
      destroyed() {}
    };
  }
};
</script>








