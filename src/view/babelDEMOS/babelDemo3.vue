<template>
    <div style="font-size:12px; text-align:left">
       <h3>babel for component steps --- @babel/types处理</h3> 

       
       <ul >
         <li>  1. 组件的对外属性转换 => props 替换为 properties </li>
         <li>  2. Component构造器转换 =>  export default { 替换为 Component({   </li>
         <li>  3. Component构造器转换 => 最后的} 替换为}) </li>
         <li>  4. 组件的内部数据转换 => 取值  vue中，通过this.a取值(data中的值),
              小程序中，通过this.data.a取值 </li>
         <li>  5.  vue中，通过this.a = "value" 赋值 ;<p></p>
              小程序中，通过this.setData({key:value})改变data中的对应值。</li>  
         <li>  6. 组件内部数据处理  data函数转换为对象 <p></p>
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
         <li>自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
          this.triggerEvent('customevent', {}, { bubbles: true, composed: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1</li>

          <li> 8.  小程序 中== properties 对外属性值：  type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
                     value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
                    vue 中==  value 为 default
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
      //存放`this.data`中的属性
      var datas = [];
      //输入
      var code = `
               export default {
                  props: {//组件的对外属性
                      code:{
                          type:String,
                          value:null
                      },
                      max: {//注释信息。。。
                          type: Number,
                          value: 99
                      }
                  },
                  data(){//组件的内部数据
                      return {
                        num:10000,
                        $A: "aaaaa", 
                        $B: "bbbb", 
                        $C: [
                          1,2,3
                        ],
                        $D: {
                          d1:"----value of d1",
                          d2:"----value of d2"
                        }
                      }
                  },
                  methods: {
                     textFn() {
                       this.num  = 2
                       this.$A  = 2
                      
                    },
                    onMyButtonTap: function(){
                      // 更新属性和数据的方法与更新页面数据的方法类似
                      //this.setData({
                      //  $A: 'A is Change'
                      //})
                      this.$A  = 'A is Change'
                      this.$B  = 'B is Change'
                    },
                   
          
                  }
                }
                `;
      //to ast
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
     // console.log("babylon.parse",ast)

      //转换 ast
      //
      traverse(ast, {
        enter(path) {
         // console.log("enter: " + path.node.type);
        },
        //export default => Component构造器转换
        ExportDefaultDeclaration(path){
          if(path.node.type === "ExportDefaultDeclaration"){
            //console.log("path",path)
           // path.replaceWith( t.binaryExpression("*", t.identifier("a"), t.identifier("b")))
            //path.replaceWithSourceString(`function add(a, b) {
             // return a + b;
           // }`);
            // path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
            // path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
           
            //var builderTest =  t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
           // console.log("builderTest",builderTest)
           // path.remove()
           // path.node.type = "ExpressionStatement"
          }
          //console.log(path.node.type,path)
        },
        // 替换props为properties与this.prop转为this.data.prop
        ObjectProperty(path) {
           path.parentPath.remove();
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
               // console.log("内部二级path - enter : " + path.node.type);
              },
              //表达式处理XXX
              BinaryExpression(path) {
                if (
                  path.node.left != null &&
                  path.node.left.type === "Identifier" &&
                  path.node.left.name === "this"
                ) {
                  path.node.left.name = "aaa"
                }
              },
              //修改数据属性至this.data.prop等
              MemberExpression(path) {
               let datasVals =  datas.map((item,index) =>{
                  return item.key.name //拿到data属性中的第一级
                })
                //
                console.log("path.node.property",path.node)
               // console.log(path.node.object.type,datas,  datasVals.includes(path.node.property.name),datasVals)
                if (
                  path.node.object.type === "ThisExpression" &&
                  datasVals.includes(path.node.property.name)
                ) {
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
                                t.identifier(`this.data.${path.node.property.name}`)
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
              }
            });
          }
          path.skip();
        },

        //data 转换为 object
        ObjectMethod(path) {
          //console.log("path.node.key.name ",path.node )// data, add, textFn
          // console.log("path.node ",path.node )// data, add, textFn
          if (path.node.key.name === "data") {
            path.traverse({
              BlockStatement(p) {
                //console.log("----p",p.node.body[0].argument.properties)
              }
            });
            // 用blockStatement生成objectExpression
            const objectExpression = t.objectExpression(datas);

            // 创建data对象并赋值
            const dataProperty = t.objectProperty(
              t.identifier("data"),
              objectExpression
            );
            path.insertAfter(dataProperty);
            path.remove();
          }
        }
      });
      //var outJSstr = generate(ast, {}, str).code;
      //console.log("存放`this.data`中的属性", datas);
      console.log(generate(ast, {}, code).code);
    }
  },
  created() {}
};
</script>


