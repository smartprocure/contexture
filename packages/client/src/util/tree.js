import _ from "lodash/fp";
import * as F from "futil-js";

export let getChildren = x => {
  try {
    let arr = x.children; //_.get('children', x)
    return arr ? arr.slice() : arr;
  } catch (e) {}
};
// export let getChildren = _.get('children')
export let Tree = F.tree(x => x.children);

// Path Lookup
export let keyPath = path => (_.isString(path) ? { key: path } : path);
export let lookup = (tree, path) => _.find(keyPath(path), getChildren(tree));

export let encodePath = F.compactJoin("->");
export let decodePath = _.split("->");

// Flat Tree Utils
export let setPath = (node, i, [{ path = "" } = {}] = []) => {
  node.path = encodePath([path, _.get("key", node)]);
};
export let flattenTree = Tree.reduce((result, node, ...args) => {
  setPath(node, ...args);
  return _.set(node.path, node, result);
}, {});

export let bubbleUp = (f, path, flatTree) => {
  if (_.isEmpty(path)) return;
  f(flatTree[path.join("->")], path);
  bubbleUp(f, _.dropRight(1, path), flatTree);
};
export let bubbleUpAsync = async (f, path, flatTree) => {
  if (_.isEmpty(path)) return;
  await f(flatTree[path.join("->")], path);
  await bubbleUpAsync(f, _.dropRight(1, path), flatTree);
};
export let flatLeaves = _.reject("children");

// Not used...
let visitPath = (fn, path, tree) => {
  var node = lookup(tree, path[0]);
  fn(node, path);
  let remainingPath = path.slice(1);
  if (remainingPath.length) visitPath(fn, remainingPath, node);
};
