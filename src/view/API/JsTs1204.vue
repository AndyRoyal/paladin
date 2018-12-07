<template>
  <div style="font-size:12px; text-align:left">
    <h3>babel for component steps --- @babel/types处理</h3>

    <ul>
      <li>1. 组件的对外属性转换 => props 替换为 properties</li>
      <li>2. Component构造器转换 => export default { 替换为 Component({</li>
      <li>3. Component构造器转换 => 最后的} 替换为})</li>
      <li>
        4. 组件的内部数据转换 => 取值 vue中，通过this.a取值(data中的值),
        小程序中，通过this.data.a取值
      </li>
      <li>5. vue中，通过this.a = "value" 赋值 ;
        <p></p>
        小程序中，通过this.setData({key:value})改变data中的对应值。
      </li>
      <li>6. 组件内部数据处理 data函数转换为对象
        <p></p>
        <textarea name id cols="30" rows="10">

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

      <li>7. 组件的触发事件转换 => vue 中 this.$emit('callChangeCount', _data); 小程序中：triggerEvent</li>
      <li>
        自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
        this.triggerEvent('customevent', {}, { bubbles: true, composed: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
      </li>

      <li>
        8. 小程序 中== properties 对外属性值： type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
        vue 中== value 为 default
        （不能乱用）
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
      <li>删除this表达式this.data.$B = 'B is Change';</li>
      <li>生命周期的处理</li>

      <B>OK 约定 ：</B>
      <li>
        this.data.xx是用来获取页面data对象的----------只是js（逻辑层）数据的更改；
        this.setData是用来更新界面的---------用于更新view层的。
      </li>

      <li>
        11-29表达式处理：
        this表达式处理,发现this.data.xx = 1, 一律删除，this.data.a的默认保留
        this.setData({});不会受到影响
      </li>
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
    this.traverseAst();
  },
  data() {
    return {};
  },
  methods: {
    traverseAst(str) {
      var dataAST, MethodsAst, propsAst;
      //用于存放ExportDefaultDeclaration下所有的属性（data,props,methods,以及其他生命周期的钩子等）
      var propertiesAST;
      var testOBJ
      //存放`this.data`中的属性
      var datas = [];
      //输入
      var code = `
               export default {
                  props: {//组件的对外属性
                      code:{
                          type:String,
                          value:abc
                      },
                      max: {//注释信息。。。
                          type: Number,
                          value: 99
                      }
                  },
                  data(){//组件的内部数据
                      return {
                        num:1,
                        $A: "a", 
                      }
                  },
                  methods: {
                     textFn() {
                       this.num  = 2
                       this.$A  = 2
                      
                    }
                  }
                }
                `;
      //to ast
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      console.log("parse ast",ast)
      //转换 ast
      //
      traverse(ast, {
        enter(path) {
          //console.log("enter: " + path.node.type);
        },

        // 替换props为properties与this.prop转为this.data.prop
        ObjectProperty(path) {
          //props 替换为 properties
          if (path.node.key.name === "props") {
            path.node.key.name = "properties";
          }

          //从data中提取数据属性  X废弃X
          if (path.node.key.name === "data") {
            path.traverse({
              ReturnStatement(path) {
                path.traverse({
                  ObjectProperty(path) {
                    datas.push(path.node.key.name);
                    path.skip(); // if checking the children is irrelevant
                  }
                });
                path.skip();
              }
            });
          } else if (path.node.key.name === "methods") {
            path.traverse({
              enter(path) {
                //console.log("内部二级path - enter : " + path.node.type);
              },

              //修改数据属性至this.data.prop等
              MemberExpression(path) {
                traverse(ast, {
                  enter(path) {
                    // console.log("内部二级path - enter : " + path.node.type);
                  },
                  BinaryExpression(path) {
                    debugger;
                    // 注意这里要有判断，否则会无限进入`BinaryExpression`
                    // https://stackoverflow.com/questions/37539432/babel-maximum-call-stack-size-exceeded-while-using-path-replacewith
                    if (path.node.operator === "+") {
                      path.replaceWith(
                        t.binaryExpression("*", path.node.left, path.node.right)
                      );
                    }
                  }
                });

                let datasVals = datas.map((item, index) => {
                  return item.key.name; //拿到data属性中的第一级
                });
                //有等于号的this.a=1，改变为this.setData({});
                //没有等于号的this.a, 转变为 this.data.a
                if (
                  path.node.object.type === "ThisExpression" &&
                  datasVals.includes(path.node.property.name)
                ) {
                  // console.log("path.node.object",path.node)
                  path.get("object").replaceWithSourceString("this.data");
                  //判是不是赋值操作
                  if (
                    (t.isAssignmentExpression(path.parentPath) &&
                      path.parentPath.get("left") === path) ||
                    t.isUpdateExpression(path.parentPath)
                  ) {
                    // find path
                    const expressionStatement = path.findParent(parent =>
                      parent.isExpressionStatement()
                    );
                    // 创建setData
                    if (expressionStatement) {
                      //var dataValItem  =this.data.path.node.property.name
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
                      expressionStatement.insertAfter(finalExpStatement);
                    }
                    //path.remove();
                  }
                }
              },
              //表达式处理XXX
              BinaryExpression(path) {
                debugger;
                console.log(
                  "this表达式处理,发现this.data.a = 1, 一律删除，this.data.a的默认保留"
                );
                if (
                  path.node.left != null &&
                  path.node.left.type === "Identifier" &&
                  path.node.left.name === "this" &&
                  path.node.operator === "="
                ) {
                  path.node.left.name = "aaa";
                }
              }
            });
          }
          path.skip();
        },

        //data 转换为 object
        ObjectMethod(path) {
    
          console.log("path.node.key.name ", path.node); // data, add, textFn
          // console.log("path.node ",path.node )// data, add, textFn
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
        //export default => Component构造器转换
        ExportDefaultDeclaration(path) {
          //创建  CallExpression  Component({})
          function insertBeforeFn(path) {
            const objectExpression = t.objectExpression(propertiesAST);
            testOBJ = t.expressionStatement(
                t.callExpression(
                    t.identifier("Compontents"),[
                      objectExpression
                    ]
                )
            );
            //path.remove();
            console.log("testOBJ",testOBJ)
          }
          if (path.node.type === "ExportDefaultDeclaration") {
            if (path.node.declaration.properties) {
              //提取属性并存储
              propertiesAST = path.node.declaration.properties;
             // console.log("propertiesAST", propertiesAST);
              //创建MP AST包裹对象
              insertBeforeFn(path);

              //builderMPAST(t)
              //ast开始与结尾处插入
              path.insertBefore(
                t.expressionStatement(t.stringLiteral("start.."))
              );
              path.insertAfter(t.expressionStatement(t.stringLiteral("end..")));
           
            }
            // 插入到原data函数下方
            // path.insertAfter("11");

            var builderTest = t.binaryExpression(
              "*",
              t.identifier("a"),
              t.identifier("b")
            );
            // console.log("builderTest",builderTest)
            // path.remove()
            // path.node.type = "ExpressionStatement"
          }
          //console.log(path.node.type,path)
        }
      });
      //var outJSstr = generate(ast, {}, str).code;
      //console.log("存放`this.data`中的属性", datas);
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
  created() {}
};
</script>


