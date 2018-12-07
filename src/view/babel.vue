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
import * as babylon from "babylon";
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
export default {
  mounted() {
    this.strToAst(this.jsStr);
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
      },
      jsStr: `var a =1`
    };
  },
  methods: {
    /****
     * str -> ast -> str  
     * 
     * outJsStr 为输出
     */

    strToAst(str) {
      var code = `
                export default {
                data() {
                    return {
                       message: '111',
                       goodNum: 100,
                       OBJ:{
                         $A:1,
                         $B:2,
                         $C:[
                           11,22,33
                         ]
                       }
                    }
                },
                methods: {
                    add() {
                    ++this.goodNum
                    },
                    minus() {
                    --this.goodNum
                    }
                }
                }
                `;

      var outJsStr = `export default {
                    data: (() => {
                      return {
                        message: '111',
                        goodNum: 100,
                        OBJ: {
                          $A: 1,
                          $B: 2,
                          $C: [11, 22, 33]
                        }
                      };
                    })(),
                    methods: {
                      add() {
                        ++this.goodNum;
                      },

                      minus() {
                        --this.goodNum;
                      }

                    }
                  };`;
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


