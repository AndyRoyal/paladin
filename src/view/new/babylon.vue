<template>
  <div style="font-size:12px; text-align:left"></div>
</template>
<script>
//const babel = require("babel-core");
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

import * as babylon from "babylon";
//const parser = require("@babel/parser");
export default {
  mounted() {
    this.parseScript();
  },
  data() {
    return {};
  },
  methods: {
    getDataProperty(value) {
      const { body } = value;
      if (body && body.length) {
        const [returnStatement] = body.filter(
          bd => bd.type === "ReturnStatement"
        );
        if (returnStatement) {
          return returnStatement.argument.properties;
        }
      }
    },
    parseScript(script) {
      const templParams = {};
      //输入
      var code = `
               export default {
                  name: "footerCom",//去掉name
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
                    argsFn(arg1,arg2){
                      //给每一个方法增加第一个参数为event。取出所有的vue方法参数，重新制作参数
                      return  arg1 + arg2
                    },
                     textFn() {
                       this.num  = 2 //isExpressionStatement true
                       this.$A  = 12 
                    },
                    fn1(){
                      this.$emit('myEventIn2', _data);// this.triggerEvent('customevent', {}, { bubbles: true, composed: true })
                      //先转$emit为triggerEvent
                    }
                  },
                  mounted(){
                    this.textFn()
                    //mounted转为 ready(){} 或 ready:function(){}
                  },
                  created(){
                    this.$emit('myEvent', _data);
                    this.fn1()
                    //created转为created 或者 attached
                  },
                  watch: {
                    //mp 不支持
                  },
                  computed: {
                    //mp 不支持
                  },
                  destroyed: function(){
                    //这种写法后续迭代增加
                    //转为 detached
                  },
                  destroyed(){
                    //destroyed转为 detached
                  }
                }
                `;
      babel.transform(code, {
        plugins: [
          {
            visitor: {
              ObjectProperty: function(path) {
                if (path.node) {
                  const { key, value } = path.node;
                  const propName = key.name;
                  if (propName === "props") {
                    templParams.properties = value && value.properties;
                  }
                  if (
                    propName === "data" &&
                    value.type === "FunctionExpression"
                  ) {
                    templParams.data = getDataProperty(value);
                  }
                  if (propName === "methods") {
                    templParams.methods = value && value.properties;
                  }
                  if (propName === "created") {
                    templParams.createdBody = value.body;
                  }
                  if (propName === "mounted") {
                    templParams.mountedBody = value.body;
                  }
                }
              },
              ObjectMethod: function(path) {
                if (path.node) {
                  const { key, body } = path.node;
                  const propName = key.name;
                  if (propName === "data") {
                    templParams.data = getDataProperty(body);
                  }
                  if (propName === "created") {
                    templParams.createdBody = body;
                  }
                  if (propName === "mounted") {
                    templParams.mountedBody = body;
                  }
                }
              }
            }
          }
        ]
      });
      return templParams;
    }
  }
};
</script>








