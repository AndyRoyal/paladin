const fs = require('fs');
const path = require('path');


function main() {
  transform();
}

/**
 * 辅助工具函数对象
 * @returns Object
 */
var utils = {
  // 暂存VUE字符串过渡存储
  vueStr: {
    tempStr: '',
    scriptStr: '',
    styleStr: ''
  },
  regs:{
    toViewStartTags: /(<h1)|(<s)|(<em)|(<ul)|(<li)|(<dl)|(<i)|(<span)/g,
    toViewEndTags: /(<\/h1>)|(<\/s>)|(<\/em>)|(<\/ul>)|(<\/li>)|(<\/dl>)|(<\/i>)|(<\/span>)/g,
    toBlockStartTags: /(<div)|(<p)/g,
    toBlockEndTags: /(<\/div>)|(<\/p>)/g,
  },
  signObj: {
    tempStart: '<template>',
    tempEnd: '</template>',
    styleStart: '<style scoped>', //'<style>' || '<style scoped>',
    styleEnd: '</style>',
    scriptStart: '<script>',
    scriptEnd: '</script>'
  },
  //匹配对应字符
  getInsideString(str, strStart, strEnd) {
    if (str.indexOf(strStart) < 0) {
      return "";
    }
    if (str.indexOf(strEnd) < 0) {
      return "";
    }
    return str.substring(str.indexOf(strStart) + strStart.length, str.indexOf(strEnd));
  },
  //匹配对应字符2--备用
  operationVueFile(vueStr) {
    vueStr = `<template>
    <div>
    <div class='schedule-wrapper'>

    </template><style>.div{height:90px}</style>`;
    //vueStr = `<template><div class='aaa'></div></template><style>.div{height:90px}</style>`;
    vueStr = vueStr.replace(/\r\n/g, "");
    vueStr = vueStr.replace(/\s/g, "");
    var tempReg = /\<template\>.+\<\/template\>/; //贪婪模式匹配 
    var temp = vueStr.match(tempReg);
    //console.log("temp", temp)
  }
}
  /**
   *  读取Vue文件 get String
   * @returns {Promise}
   */
  function readVueFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '../view/index.vue'), {
        encoding: 'utf-8'
      }, function (err, bytesRead) {
        if (err) throw err;
        //console.log('读取的文件内容', bytesRead);
        //get template string
        utils.vueStr.tempStr = utils.getInsideString(bytesRead, utils.signObj.tempStart, utils.signObj.tempEnd);
        //get script string
        utils.vueStr.scriptStr = utils.getInsideString(bytesRead, utils.signObj.scriptStart, utils.signObj.scriptEnd);
        //get style string
        utils.vueStr.styleStr = utils.getInsideString(bytesRead, utils.signObj.styleStart, utils.signObj.styleEnd);
        resolve(`读取与处理vue文件完成`);
      });
    })
  }
/**
 *  遍历Vue文件夹
 * @returns {Promise}
 */
function readFold(foldPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(foldPath, function (err, files) {
      if (err) {
        console.log(err);
        return false;
      }
      files.forEach(function (fileName) {
        var viewFilePath = path.join(__dirname, '../view/')
        var director = path.join(viewFilePath, fileName);
        //console.log('director路径',director);
        fs.stat(director, function (err, stats) {
          if (err) {
            console.log(err);
            return false;
          }
          if (stats.isDirectory()) {
  
            readFold(director);
          }
          if (stats.isFile()) {
            let filePath = path.join(__dirname, '../view/'+fileName)
            fs.readFile(filePath, 'utf-8', function (error, bytesRead) {
           
              if (error) {
                console.log(error);
              } else {
                //：文件内容处理
                //get template string
                utils.vueStr.tempStr = utils.getInsideString(bytesRead, utils.signObj.tempStart, utils.signObj.tempEnd);
                //get script string
                utils.vueStr.scriptStr = utils.getInsideString(bytesRead, utils.signObj.scriptStart, utils.signObj.scriptEnd);
                //get style string
                utils.vueStr.styleStr = utils.getInsideString(bytesRead, utils.signObj.styleStart, utils.signObj.styleEnd);
                //
                //生成文件
                 //console.log(fileName,'fileName');
                if(fileName != undefined){
                  //ts vue 指令
             
                  utils.vueStr.tempStr = tsVueTemToMpTem(utils.vueStr.tempStr);
             
                  //生成小程序文件
                  createMPfiles(fileName,utils.vueStr)
                }
                resolve(`读取与处理vue文件完成`);
              }
            });
          }
        });
      });
    });

  }) 
}
/**
 * 生成小程序文件
 * @returns {Promise}
 */
  function createMPfiles(mpFileName,vuefileContent) {
    return new Promise((resolve, reject) => {
      let wxssContent = vuefileContent.styleStr || '';
      let jsContent = vuefileContent.scriptStr || '';
      let wxmlContent = vuefileContent.tempStr || '';
      let jsonContent = `
      {
        "component": true
      }`;
     


      var  mpFileNameRemoveSuffix = mpFileName.split('.')[0];
      //文件夹
      const dirPath = path.join(__dirname, `../../dist/${mpFileNameRemoveSuffix}/`);
      //文件
      const wxssFilePath = path.join(dirPath, `${mpFileNameRemoveSuffix}.wxss`);
      const jsFilePath = path.join(dirPath, `${mpFileNameRemoveSuffix}.js`);
      const wxmlFilePath = path.join(dirPath, `${mpFileNameRemoveSuffix}.wxml`);
      const jsonFilePath = path.join(dirPath, `${mpFileNameRemoveSuffix}.json`);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.writeFile(wxssFilePath, wxssContent, err => {
        if (err) throw err;
        //console.log(`dist目录下生成${mpFileNameRemoveSuffix}.wxss文件成功`);
        fs.writeFile(jsFilePath, jsContent, err => {
          if (err) throw err;
         // console.log(`dist目录下生成${mpFileNameRemoveSuffix}.js文件成功`);
          fs.writeFile(wxmlFilePath, wxmlContent, err => {
            if (err) throw err;
            //console.log(`dist目录下生成${mpFileNameRemoveSuffix}.wxml文件成功`);
            fs.writeFile(jsonFilePath, jsonContent, err => {
              if (err) throw err;
             console.log(`dist目录下生成${mpFileNameRemoveSuffix}.json文件成功`)
              resolve(`生成${mpFileNameRemoveSuffix}.json文件成功`);
            })
          })
        });
      });
    });
  }
/**
 *  处理为小程序模板文件  简易处理，待确定提出抽象级处理数据方案
 * @returns {Promise}
 */
function tsVueTemToMpTem(vueStr){
 
  let mpStr = vueStr
  .replace(/(v-if)|(v-show)/g,"wx:if")
  .replace(/v-else/g,"wx:else")
  .replace(/v-for/g,"wx:for")
  .replace(/:key/g,"wx:key")
  .replace(utils.regs.toBlockStartTags,"<block")//start tags
  .replace(utils.regs.toBlockEndTags,"</block>")// end tags
  .replace(utils.regs.toViewStartTags,"<view")//start tags  to view
  .replace(utils.regs.toViewEndTags,"</view>")// end tags  to /view
  .replace(/@click/g,"bindtap");
  return  mpStr
}
/**
 *  处理为小程序事件
 * @returns {Promise}
 */
function tsEvents(vueStr){
  let mpStr = vueStr;
  // bind:tap="tapBtn"
  //bindtap="testFn1(P1,P2)"  ==> data-P1='' data-P2=''
  // bind:blur="blurHandle" bindinput="inputHandle"

// <view class="count_btn" data-tar="plus" bind:tap="tapBtn">
// tapBtn: function(evt) {
//   const _tar=evt.currentTarget.dataset.tar;
//   const _max=this.data.max;
//   const _min=this.data.min;
//   let _count=this.data.count;
//   if(_tar=='plus'){
//       if(_count<_max){
//           _count++;
//       }
//   }else{
//       if(_count>_min){
//           _count--;
//       }
//   };
//   this.setNewCount(_count);
// }

}


   /**start**/
  function transform() {
   var foldPath =path.join(__dirname, '../view/')
    //console.log('foldPath',path.join(__dirname, '../view/'));
    readFold(foldPath);

    readFold(foldPath)
      .then(() => {
        return createMPfiles();
      })
      .then(() => {
        console.log('vue转换初步替换字符完成');
        process.exit();
      }).catch(function(error) {
        console.log('error: ' + error);
      });
    
  }

  main();
