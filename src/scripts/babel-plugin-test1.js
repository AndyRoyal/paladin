export default function(babel) {
  return {
    // 必需，配合traverse使用的visitor对象
    visitor: {
      ImportDeclaration(path, ref) {
        var opts = ref.opts; // 配置的参数
      },
      Identifier(path, state) {},
      ASTNodeTypeHere(path, state) {},
      BinaryExpression(path) {
        if (path.node.operator !== "===") {
          return;
        }
      
        path.node.left = t.identifier("sebmck");
        path.node.right = t.identifier("dork");
      }
    },
    // 可选，继承其它插件，比如识别JSX、async function等语法
    inherits: OtherPlugin,
    // 可选，插件执行前，初始化状态，如cache
    pre(state) {},
    // 可选，插件执行后，收尾清理工作
    post(state) {}
  }
}
