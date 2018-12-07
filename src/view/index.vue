<template>
    <div>
       <div class='schedule-wrapper'>
        <div class='schdule-box'>
            <div class='goods-list'>
                <div class='good-item'>
                    <img class='good-img' :src='good.img'>
                    <div class='info'>
                        <div class='good-name'>
                            {{good.goodName}}
                        </div>
                        <div class='good-num-schedule'  v-if='1' data-id="" @click="fn">
                          
                        </div>
                    </div>
     

                </div>
            </div>
        </div>
        
    </div>
    
    <p v-if='testIf' v-for="(item,index) in [1]" :key='index'>
        
    </p>
    </div>
</template>
<style scoped>
.index {
  height: 100px;
}
</style>
<script>
// lodash
import { flatten, join } from "lodash";
let arr = [1, [2, 3], [4, [5]]];
let result = _.flatten(arr);
// lodash end

import * as babylon from "babylon";
//import traverse from "babel-traverse";
//测试 ast
//import t from "babel-types";
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
export default {
  mounted() {
    /****
     *    转换案例1
     */
    function astToScriptFn1() {
      const code = `
                export default {
                data() {
                    return {
                    message: 'hello vue to mp',
                    count: 100
                    }
                },
                methods: {
                    add() {
                    ++this.count
                    },
                    minus() {
                    --this.count
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
      console.log("vue 原有data属性", dataObject);

      //转换
      traverse(ast, {
        ObjectMethod(path) {
          if (path.node.key.name === "data") {
            // 获取第一级的 BlockStatement，也就是data函数体
            let blockStatement = null;
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
            console.log(arrowFunctionExpression);
          }
        }
      });

      console.log(generate(ast, {}, code).code);
    }
  },
  data() {
    return {
      testIf: true,
      good: {
        img:
          "http://img14.360buyimg.com/uba/jfs/t1/1087/24/11845/1089/5bd11e69Ef55a7f89/7cf7847d53507140.png",
        goodName: "paladin",
        goodModel: "型号规格XX",
        goodNum: 6
      }
    };
  },
  methods: {
    /****
     *转换案例2
     */
    vueToMp1() {
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


