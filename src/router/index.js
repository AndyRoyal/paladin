import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index'
import babel from '@/view/babel'
import babelForCom from '@/view/babelForCom'
import babelDemoFirst from '@/view/babelDemo1'
//babel demos
import babelDemo1 from '@/view/babelDEMOS/babelDemo1'
import babelDemo2 from '@/view/babelDEMOS/babelDemo2' 
import babelDemo3 from '@/view/babelDEMOS/babelDemo3' //JS处理最新版本 引入babylon等  
import nodeBuilderDEMO from '@/view/babelDEMOS/nodeBuilderDEMO' //节点创建与插入
import babelPluginDEMO from '@/view/babelDEMOS/babelPluginDEMO' //babel插件开发 
import babelPluginDEMO11 from '@/view/babelDEMOS/babelPluginDEMO11' //babel插件开发 
import babelDemoForArtical from '@/view/babelDEMOS/babelDemoForArtical'  
import babelDemoCSS from '@/view/babelDemosForSCSS-CSS/babelDemoCSS'  //CSS处理  X 废弃
import CSSTreeDemo from '@/view/babelDemosForSCSS-CSS/CSS-Tree-demo'  //CSS处理  引入CSS-tree包 //CSS 处理最新版本
import SCSSTreeDemo from '@/view/babelDemosForSCSS-CSS/SCSS-Tree-demo'  //SCSS处理  引入SCSS.js  X 废弃 方案修改为：通过webpack先把scss转为css，在处理css转换为小程序css
import htmlparserdemo from '@/view/htmlparser2DEMOS/html-parser-demo'  //template处理  引入htmlparser2

//创建ast节点
import created1203 from '@/view//babelDEMOS/created1203'  //template处理  引入htmlparser2


//API  - > 创建,操作,验证ast节点  2018-12-04
import API from '@/view/API/API' 
import JsTs1204 from '@/view/API/JsTs1204' //new
import jsTs0109 from '@/view/API/jsTs0109' //new

//API  - >setData 场景优化
import babylon from '@/view/new/babylon' 
import babylon1 from '@/view/new/babylon1' 

//API  - >path 操作
import pathApi from '@/view/new/pathApi' 


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/babylon',
      name: 'babylon',
      component: babylon
    },
    {
      path: '/pathApi',
      name: 'pathApi',
      component: pathApi
    },
    {
      path: '/babylon1',
      name: 'babylon1',
      component: babylon1
    },
    {
      path: '/JsTs1204',
      name: 'JsTs1204',
      component: JsTs1204
    },
    {
      path: '/jsTs0109',
      name: 'jsTs0109',
      component: JsTs1204
    },
    {
      path: '/API',
      name: 'API',
      component: API
    },
    {
      path: '/created1203',
      name: 'created1203',
      component: created1203
    },
    {
      path: '/',
      name: 'babylon1',
      component: babylon1
    },
    {
      path: '/babel',
      name: 'babel',
      component: babel
    },
    {
      path: '/babelForCom',
      name: 'babelForCom',
      component: babelForCom 
    },
    {
      path: '/babelDemoFirst',
      name: 'babelDemoFirst',
      component: babelDemoFirst 
    },
    {
      path: '/babelDemo1',
      name: 'babelDemo1',
      component: babelDemo1 
    },
    {
      path: '/babelDemo2',
      name: 'babelDemo2',
      component: babelDemo2 
    },
    {
      path: '/babelDemo3',
      name: 'babelDemo3',
      component: babelDemo3  
    },
    {
      path: '/babelPluginDEMO11',
      name: 'babelPluginDEMO11', 
      component: babelPluginDEMO11  
    },
    {
      path: '/babelDemoForArtical',
      name: 'babelDemoForArtical',
      component: babelDemoForArtical  
    },
    {
      path: '/babelDemoCSS',
      name: 'babelDemoCSS',
      component: babelDemoCSS   
    },
    {
      path: '/CSSTreeDemo',
      name: 'CSSTreeDemo',
      component: CSSTreeDemo 
    },
    {
      path: '/SCSSTreeDemo',
      name: 'SCSSTreeDemo',
      component: SCSSTreeDemo  
    },
    {
      path: '/htmlparserdemo',
      name: 'htmlparserdemo',
      component: htmlparserdemo  
    },
    {
      path: '/nodeBuilderDEMO',
      name: 'nodeBuilderDEMO', 
      component: nodeBuilderDEMO  
    },
    {
      path: '/babelPluginDEMO',
      name: 'babelPluginDEMO', 
      component: babelPluginDEMO  
    }
  ]
})
