<template>
    <div style="font-size:12px; text-align:left">
        babel for component steps

       babel处理：
       <ul >
         <li>  1. 组件的对外属性转换 => props 替换为 properties </li>
         <li>  2. Component构造器转换 =>  export default { 替换为 Component({   </li>
         <li>  3. Component构造器转换 => 最后的} 替换为}) </li>
         <li>  4. 组件的内部数据转换 => 取值  vue中，通过this.a取值(data中的值),<p></p>
              小程序中，通过this.data.a取值 </li>
         <li>  5.  vue中，通过this.a = "value" 赋值 ;<p></p>
              小程序中，通过this.setData({key:value})改变data中的对应值。</li>
         <li>  6. 组件内部数据处理  data函数转换为对象 
           <textarea name="" id="" cols="30" rows="10">

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

         <li>  7. 组件的触发事件转换 => vue 中 this.$emit('callChangeCount', _data);  小程序中：triggerEvent </li>

      </ul> 

    </div>
</template>
<style scoped>
ul li{
  text-align: left
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
      //存放`this.data`中的属性
      var datas = [];
      //输入
      var code = `
               export default {
                  props: {
                      code:{
                          type:String,
                          value:null
                      },
                      max: {//注释信息。。。
                          type: Number,
                          value: 99
                      }
                  },
                  data(){
                      return {
                        num:10000,
                        $A: "aaaaa", 
                        $B: "bbbb", 
                        $C: [
                          1,2,3
                        ],
                        $D: {
                          d1:"----value of d1",
                          d1:"----value of d1"
                        }
                      }
                  },
                  methods: {
                     minus() {
                       --this.num;
                    },
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
                    }
          
                  }
                }
                `;
      //to ast
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      //转换 ast
      //自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
      // this.triggerEvent('customevent', {}, { bubbles: true, composed: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
      traverse(ast, {
        enter(path) {
          console.log("enter: " + path.node.type);
          /* if (path.node.type === "Identifier" && path.node.name === "n") {
            path.node.name = "x";
          } */
        },
        // 替换props为properties与this.prop转为this.data.prop
        ObjectProperty(path) {
          //props 替换为 properties
          if (path.node.key.name === "props") {
            path.node.key.name = "properties";
          }
          //从data中提取数据属性
          if (path.node.key.name === "data") {
            path.traverse({
              ReturnStatement(path) {
                path.traverse({
                  ObjectProperty(path) {
                    console.log(
                      "return 内部 path.node.key.name",
                      path.node.key.name
                    );
                    datas.push(path.node.key.name);
                    path.skip();
                  }
                });
                path.skip();
              }
            });
          }
          path.skip();
        },
        //修改数据属性至this.data.prop等
        MemberExpression(path) {alert()
          if (
            path.node.object.type === "ThisExpression" &&
            datas.includes(path.node.property.name)
          ) {debugger
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
                const finalExpStatement = t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier("setData")
                    ),
                    [
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier(propertyName),
                          t.identifier(`this.data.${propertyName}`)
                        )
                      ])
                    ]
                  )
                );
                expressionStatement.insertAfter(finalExpStatement);
              }
            }
          }
        },
        ExportDefaultDeclaration(path) {
          // console.log(`------`,path.node.type,path.node)
        },
        ObjectExpression(path) {
          //console.log(`------`,path)
        },
        //data 转换为 function 
        ObjectMethod(path) {
          //console.log("path.node.key.name ",path.node )// data, add, minus
          // console.log("path.node ",path.node )// data, add, minus
          if (path.node.key.name === "data") {
            let blockStatement = null; 
            path.traverse({
              BlockStatement(p) {
                blockStatement = p.node;
              }
            });
            // 用blockStatement生成ArrowFunctionExpression
            const arrowFunctionExpression = t.arrowFunctionExpression(
              [],
              blockStatement
            );
            const callExpression = t.callExpression(
              arrowFunctionExpression,
              []
            );
            const dataProperty = t.objectProperty(
              t.identifier("data"),
              callExpression
            );
            path.insertAfter(dataProperty);
            path.remove();
          }
        }
      });
      //var outJSstr = generate(ast, {}, str).code;
      console.log("存放`this.data`中的属性", datas);
      console.log(generate(ast, {}, code).code);
    }
  },
  created() {}
};
</script>


