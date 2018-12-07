<template>
  <div style="font-size:12px;">
    sass.js
    1. scss处理为css
  </div>
</template>
<style scoped>
</style>
<script>
var csstree = require('css-tree');
export default {
  mounted() {
    this.cssTreeFn()
  },
  data() {
    return {};
  },
  methods: {
    isNumberFn(){
      function isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if(regPos.test(val) || regNeg.test(val)) {
          return true;
          } else {
          return false;
          }
      }
    },
    isNumberFn2(){
      function IsNum(s){
          if (s!=null && s!="")
          {
              return !isNaN(s);
          }
          return false;
      }
    },
    cssTreeFn(){
      const code = `
        .text-ok{
          position: absolute;
          right: 150px;
          color: #e4393c;
        }
        .nut-popup-close{
          position: absolute;
          top: 50px;
          right: 120px;
          width: 50%;
          height: 200px;
          display: inline-block;
          font-size: 26px;
        }`;

        const SCSSCode = `
        .nut-progress-in{
          .nut-progress-text{
              margin-right: 5px;
            }
        }
        .nut-progress-out{
            margin-right: 38px;
            &+.nut-progress-text{
                width: 31px;
                position: absolute;
                right: 0;
                top: 0;
                color: #666;
            }
        }
        `;
        var ast = csstree.parse(SCSSCode);
        csstree.walk(ast, function(node) {
           console.log(node , typeof node);
           if(typeof node.value == "string" && isNaN(node.value) != true){
             node.value = (node.value/10);
           }
           if(node.unit === "px"){
             node.unit = "rpx"
           }
        });
        console.log(csstree.generate(ast));
    }
  },
  created() {}
};
</script>


