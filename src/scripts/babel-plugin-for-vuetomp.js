// plugin.js 文件，定义插件 
import type NodePath from "babel-traverse"; 
 
export default function(babel) { 
  const { types: t } = babel; 
 
  return { 
    name: "ast-transform", // not required 
    visitor: { 
      Identifier(path) { 
        path.node.name = `_${path.node.name}`; 
      }, 
      ArrowFunctionExpression(path: NodePath<BabelNodeArrowFunctionExpression>, state: Object) { 
        // In some conversion cases, it may have already been converted to a function while this callback 
        // was queued up. 
        if (!path.isArrowFunctionExpression()) return; 
 
        path.arrowFunctionToExpression({ 
          // While other utils may be fine inserting other arrows to make more transforms possible, 
          // the arrow transform itself absolutely cannot insert new arrow functions. 
          allowInsertArrow: false, 
          specCompliant: !!state.opts.spec 
        }); 
      } 
    } 
  }; 
} 
 
// babel.js 使用插件 
var babel = require('babel-core'); 
var plugin= require('./plugin'); 
 
var out = babel.transform(src, { 
  plugins: [plugin] 
});  