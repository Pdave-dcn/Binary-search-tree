class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(this.array);
  }

  buildTree(arr) {
    if (arr.length === 0) return null;

    let mid = Math.floor(arr.length / 2);
    let node = new Node(arr[mid]);

    node.left = this.buildTree(arr.slice(0, mid));
    node.right = this.buildTree(arr.slice(mid + 1));

    return node;
  }

  insert(value, currentNode = this.root) {
    if (currentNode === null) return new Node(value);
    if (value === currentNode) return currentNode;

    if (value < currentNode.data) {
      currentNode.left = this.insert(value, currentNode.left);
    } else if (value > currentNode.data) {
      currentNode.right = this.insert(value, currentNode.right);
    }
    return currentNode;
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  deleteItem(value, currentNode = this.node) {
    if (currentNode === null) return null;

    if (value > currentNode.data) {
      currentNode.right = this.deleteItem(value, currentNode.right);
    } else if (value < currentNode.data) {
      currentNode.left = this.deleteItem(value, currentNode.left);
    } else {
      if (currentNode.left === null && currentNode.right === null) {
        return null;
      } else if (currentNode.left === null) {
        return currentNode.right;
      } else if (currentNode.right === null) {
        return currentNode.left;
      } else {
        let successor = this.findMin(currentNode.right);
        currentNode.data = successor.data;

        currentNode.right = this.deleteItem(successor.data, currentNode.right);
      }
    }
  }

  findValue(value, currentNode = this.node) {
    if (currentNode === null) return null;

    if (value === currentNode.data) return currentNode.data;

    if (value < currentNode.data) {
      return this.findValue(value, currentNode.left);
    } else {
      return this.findValue(value, currentNode.right);
    }
  }

  handleError(element) {
    if (typeof element !== "function")
      throw new Error("A callback function is required");
  }

  levelOrder(callback) {
    this.handleError(callback);

    let queue = [];
    if (this.root !== null) {
      queue.push(this.root);
    }

    while (queue.length > 0) {
      const currentNode = queue.shift();
      callback(currentNode.data);

      if (currentNode.left !== null) queue.push(currentNode.left);

      if (currentNode.right !== null) queue.push(currentNode.right);
    }
  }

  preOrder(callback, currentNode = this.root) {
    this.handleError(callback);

    if (currentNode === null) return;

    callback(currentNode.data);
    this.preOrder(callback, currentNode.left);
    this.preOrder(callback, currentNode.right);
  }

  inOrder(callback, currentNode = this.root) {
    this.handleError(callback);

    if (currentNode === null) return;

    this.inOrder(callback, currentNode.left);
    callback(currentNode.data);
    this.inOrder(callback, currentNode.right);
  }

  postOrder(callback, currentNode = this.root) {
    this.handleError(callback);

    if (currentNode === null) return;

    this.postOrder(callback, currentNode.left);
    this.postOrder(callback, currentNode.right);
    callback(currentNode.data);
  }

  height(node) {
    if (node === null) return -1;

    const leftChild = this.height(node.left);
    const rightChild = this.height(node.right);

    return Math.max(leftChild, rightChild) + 1;
  }

  depth(node, currentNode = this.root, currentDepth = 0) {
    if (node === null) return -1;

    if (node === currentNode) return currentDepth;

    const leftSubTree = this.depth(node, currentNode.left, currentDepth + 1);

    if (leftSubTree !== -1) return leftSubTree;

    return this.depth(node, currentNode.right, currentDepth + 1);
  }

  isBalanced(currentNode = this.root) {
    const checkHeight = (node) => {
      if (node === null) return 0;

      const leftHeight = checkHeight(node.left);
      if (leftHeight === -1) return -1;

      const rightHeight = checkHeight(node.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) return -1;

      return Math.max(leftHeight, rightHeight) + 1;
    };

    return checkHeight(currentNode) !== -1;
  }

  rebalance() {
    const values = [];
    const inOrderTraversal = (node) => {
      if (node === null) return;

      inOrderTraversal(node.left);
      values.push(node.data);
      inOrderTraversal(node.right);
    };

    inOrderTraversal(this.root);

    this.root = this.buildTree(values);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const generateRandomNumbers = (size, max = 100) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
};

const randomNumbers = generateRandomNumbers(15);
console.log("Random numbers: ", randomNumbers);

const binarySearchTree = new Tree(randomNumbers);

console.log("Is the tree balanced:");
console.log(binarySearchTree.isBalanced());
console.log("======");

prettyPrint(binarySearchTree.root);

function printData(element) {
  console.log(element);
}

console.log("Level order:");
binarySearchTree.levelOrder(printData);

console.log("Preorder:");
binarySearchTree.preOrder(printData);

console.log("Inorder:");
binarySearchTree.inOrder(printData);

console.log("Postorder:");
binarySearchTree.postOrder(printData);

console.log("=====");

const generateRandomOtherNumbers = (size, max = 1000) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
};

console.log("New numbers:");
const moreNumbers = generateRandomOtherNumbers(6);
console.log(moreNumbers);
console.log("=====");

moreNumbers.forEach((num) => binarySearchTree.insert(num));

console.log("Is the tree still balanced:");
console.log(binarySearchTree.isBalanced());
console.log("======");

prettyPrint(binarySearchTree.root);

binarySearchTree.rebalance();
console.log("Is the tree rebalanced:");
console.log(binarySearchTree.isBalanced());
console.log("======");

prettyPrint(binarySearchTree.root);
console.log("=====");

console.log("Level order:");
binarySearchTree.levelOrder(printData);

console.log("Preorder:");
binarySearchTree.preOrder(printData);

console.log("Inorder:");
binarySearchTree.inOrder(printData);

console.log("Postorder:");
binarySearchTree.postOrder(printData);

console.log("=====");
