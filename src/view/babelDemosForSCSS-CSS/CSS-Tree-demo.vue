<template>
  <div style="font-size:12px;">
    css-tree
    1. css-tree处理css
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
        var ast = csstree.parse(code);
        csstree.walk(ast, function(node) {
         //  console.log(node , typeof node);
           //设备	rpx换算px (屏幕宽度/750)	px换算rpx (750/屏幕宽度)
           //iPhone5	1rpx = 0.42px	1px = 2.34rpx
           //iPhone6	1rpx = 0.5px	1px = 2rpx
           //iPhone6s	1rpx = 0.552px	1px = 1.81rpx
           console.log(node)
           if(typeof node.value == "string" && isNaN(node.value) != true){
             let newVal = Math.floor((node.value*2.34) * 100) / 100//转换比例待处理
             if(node.type === "Percentage"){ 
              console.log("node.value",node.value)
             }else if(node.type === "Dimension"){
               node.value = newVal;
             }
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


