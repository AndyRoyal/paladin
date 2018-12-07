<template>
  <div style="font-size:12px;">
    htmlparser2
    A forgiving HTML/XML/RSS parser. The parser can handle streams and provides a callback interface.
  </div>
</template>
<style scoped>
</style>
<script>
var csstree = require('css-tree');
export default {
  mounted() {
    this.tempTreeFn()
  },
  data() {
    return {};
  },
  methods: {
    tempTreeFn(){
      const code = `
        <template>
          <transition name="fade">
              <div :class="['nut-dialog-wrapper',customClass]" :id="id" v-show="visible" @click="modalClick">
                  <div class="nut-dialog" :class="{'classV1':noHeader}" @click.stop @touchmove.stop>
                      <div class="nut-dialog-header">
                          <span class="nut-dialog-title">{{title}}</span>
                          <a href="javascript:;" v-if="!noCloseBtn" @click="closeBtnClick($event)" class="nut-dialog-close">
                              <svg>
                                  <use xlink:href="#close2" />
                              </svg>
                          </a>
                      </div>
                      <div class="nut-dialog-body">文本内容
                      </div>
                      <div class="nut-dialog-footer" v-if="!noFooter">
                          <button class="nut-dialog-btn" v-if="!noCancelBtn" @click="cancelBtnClick(cancelAutoClose,$event)">{{cancelBtnTxt}}</button>
                      </div>
                  </div>
              </div>
          </transition>
      </template>`;


        var htmlparser = require("htmlparser2");
        var parser = new htmlparser.Parser({
       /*    onend(){
            console.log("结束")
          }, */
          oncomment(data){
            console.log("oncomment",data)
          },
          onopentagname(name){
            //console.log("onopentagname",name)
          },
          onprocessinginstruction(name,data){
            console.log(name,data)
          },
          onopentag: function(name, attribs){
            //console.log("onopentag",name, attribs.name)
            if(attribs.name === "fade"){
              attribs.name = "112233"
            }
          },
          ontext: function(text){
            //console.log("文本节点内容：", text);
          },
          onclosetag: function(tagname){
            //console.log("onclosetag",tagname)
            if(tagname === "script"){
              console.log("That's it?!");
            }
          }
        }, {decodeEntities: true});
        parser.write(code);
        parser.end();

        console.log("parser",parser);
    }
  },
  created() {}
};
</script>


