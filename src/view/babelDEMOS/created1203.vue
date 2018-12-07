<template>
  <div style="font-size:12px; text-align:left"></div>
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
  data() {
    return {};
  },
  created() {
    this.createExpressioinAST();
  },
  methods: {
    //创建对象
    createOBJAST() {
      const objectExpression = t.objectExpression(propertiesAST);
      console.log("propertiesAST", propertiesAST);
      // 创建data对象并赋值
      testOBJ = t.objectProperty(t.identifier("Compontents"), objectExpression);
    },
    //创建表达式
    createExpressioinAST() {
      const code = `function square(n) {
        return n * n;
      }`;
      var arr = "[1,2,3]";

      var obj = `var o={
                num:1,
                $A: "a"
          }
      `;
      var objJSONTree = {
          "type": "Program",
          "range": [
            0,
            66
          ],
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 4,
              "column": 11
            }
          },
          "body": [
            {
              "type": "VariableDeclaration",
              "range": [
                0,
                66
              ],
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0
                },
                "end": {
                  "line": 4,
                  "column": 11
                }
              },
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "range": [
                    4,
                    66
                  ],
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 4
                    },
                    "end": {
                      "line": 4,
                      "column": 11
                    }
                  },
                  "id": {
                    "type": "Identifier",
                    "range": [
                      4,
                      5
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 4
                      },
                      "end": {
                        "line": 1,
                        "column": 5
                      }
                    },
                    "name": "o"
                  },
                  "init": {
                    "type": "ObjectExpression",
                    "range": [
                      6,
                      66
                    ],
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 6
                      },
                      "end": {
                        "line": 4,
                        "column": 11
                      }
                    },
                    "properties": [
                      {
                        "type": "Property",
                        "range": [
                          24,
                          29
                        ],
                        "loc": {
                          "start": {
                            "line": 2,
                            "column": 16
                          },
                          "end": {
                            "line": 2,
                            "column": 21
                          }
                        },
                        "key": {
                          "type": "Identifier",
                          "range": [
                            24,
                            27
                          ],
                          "loc": {
                            "start": {
                              "line": 2,
                              "column": 16
                            },
                            "end": {
                              "line": 2,
                              "column": 19
                            }
                          },
                          "name": "num"
                        },
                        "value": {
                          "type": "Literal",
                          "range": [
                            28,
                            29
                          ],
                          "loc": {
                            "start": {
                              "line": 2,
                              "column": 20
                            },
                            "end": {
                              "line": 2,
                              "column": 21
                            }
                          },
                          "value": 1,
                          "raw": "1"
                        },
                        "computed": false,
                        "method": false,
                        "shorthand": false,
                        "kind": "init"
                      },
                      {
                        "type": "Property",
                        "range": [
                          47,
                          54
                        ],
                        "loc": {
                          "start": {
                            "line": 3,
                            "column": 16
                          },
                          "end": {
                            "line": 3,
                            "column": 23
                          }
                        },
                        "key": {
                          "type": "Identifier",
                          "range": [
                            47,
                            49
                          ],
                          "loc": {
                            "start": {
                              "line": 3,
                              "column": 16
                            },
                            "end": {
                              "line": 3,
                              "column": 18
                            }
                          },
                          "name": "$A"
                        },
                        "value": {
                          "type": "Literal",
                          "range": [
                            51,
                            54
                          ],
                          "loc": {
                            "start": {
                              "line": 3,
                              "column": 20
                            },
                            "end": {
                              "line": 3,
                              "column": 23
                            }
                          },
                          "raw": "\"a\"",
                          "value": "a"
                        },
                        "computed": false,
                        "method": false,
                        "shorthand": false,
                        "kind": "init"
                      }
                    ]
                  }
                }
              ],
              "kind": "var"
            }
          ],
          "sourceType": "script"
        }

      const arrast = babylon.parse(arr);
      const objast = babylon.parse(obj);
      const ast = babylon.parse(code);
      var arrAST
      traverse(objJSONTree, {
        enter(path) {
          console.log(path,"enter: " + path.node.type);
         
         // console.log(path.node.body[0].declarations[0].init.properties)
        },
        VariableDeclaration(path){
          arrAST = path.container;
        }
      });

      //1
      var test = t.blockStatement(arrAST, []);
      console.log("test", test);
      //2
      //t.expressionStatement( path.node.name);

      //生成
      generate(objJSONTree, {}, code);
      console.log(generate(objJSONTree, {}, code).code);
    }
  }
};
</script>


