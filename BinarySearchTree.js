// Node class represents a single node in the binary tree
class Node {
  constructor(data) {
    this.data = data; // Value of the node
    this.left = null; // Pointer to the left child
    this.right = null; // Pointer to the right child
  }
}

// Tree class represents a binary search tree
class Tree {
  constructor(array) {
    // Remove duplicates and sort the input array
    this.array = [...new Set(array)].sort((a, b) => a - b);
    // Build the balanced binary tree from the sorted array
    this.root = this.buildTree(this.array);
  }

  // Recursively build a balanced binary tree from a sorted array
  buildTree(arr) {
    if (arr.length === 0) return null; // Base case: empty array

    let mid = Math.floor(arr.length / 2); // Find the middle element
    let node = new Node(arr[mid]); // Create a new node with the middle element

    // Recursively build the left and right subtrees
    node.left = this.buildTree(arr.slice(0, mid));
    node.right = this.buildTree(arr.slice(mid + 1));

    return node;
  }

  // Insert a value into the binary search tree
  insert(value, currentNode = this.root) {
    if (currentNode === null) return new Node(value); // Create a new node if the current node is null
    if (value === currentNode) return currentNode; // Ignore duplicate values

    if (value < currentNode.data) {
      // Recur to the left subtree if the value is smaller
      currentNode.left = this.insert(value, currentNode.left);
    } else if (value > currentNode.data) {
      // Recur to the right subtree if the value is larger
      currentNode.right = this.insert(value, currentNode.right);
    }
    return currentNode; // Return the updated node
  }

  // Find the node with the smallest value in the tree
  findMin(node) {
    while (node.left !== null) {
      node = node.left; // Keep moving left
    }
    return node; // Return the leftmost node
  }

  // Delete a value from the tree
  deleteItem(value, currentNode = this.node) {
    if (currentNode === null) return null; // Base case: node is not found

    if (value > currentNode.data) {
      // Recur to the right subtree
      currentNode.right = this.deleteItem(value, currentNode.right);
    } else if (value < currentNode.data) {
      // Recur to the left subtree
      currentNode.left = this.deleteItem(value, currentNode.left);
    } else {
      // Node to delete is found
      if (currentNode.left === null && currentNode.right === null) {
        return null; // Case 1: No children
      } else if (currentNode.left === null) {
        return currentNode.right; // Case 2: One child (right)
      } else if (currentNode.right === null) {
        return currentNode.left; // Case 2: One child (left)
      } else {
        // Case 3: Two children
        let successor = this.findMin(currentNode.right); // Find the in-order successor
        currentNode.data = successor.data; // Replace data with successor's data
        currentNode.right = this.deleteItem(successor.data, currentNode.right); // Delete the successor
      }
    }
  }

  // Search for a value in the tree
  findValue(value, currentNode = this.node) {
    if (currentNode === null) return null; // Base case: not found

    if (value === currentNode.data) return currentNode.data; // Value found

    if (value < currentNode.data) {
      // Recur to the left subtree
      return this.findValue(value, currentNode.left);
    } else {
      // Recur to the right subtree
      return this.findValue(value, currentNode.right);
    }
  }

  // Helper function to validate callback functions
  handleError(element) {
    if (typeof element !== "function")
      throw new Error("A callback function is required");
  }

  // Perform level-order traversal (breadth-first traversal)
  levelOrder(callback) {
    this.handleError(callback);

    let queue = [];
    if (this.root !== null) {
      queue.push(this.root); // Start with the root node
    }

    while (queue.length > 0) {
      const currentNode = queue.shift(); // Dequeue the front node
      callback(currentNode.data); // Apply the callback to the current node's data

      if (currentNode.left !== null) queue.push(currentNode.left); // Enqueue the left child
      if (currentNode.right !== null) queue.push(currentNode.right); // Enqueue the right child
    }
  }

  // Perform pre-order traversal (root, left, right)
  preOrder(callback, currentNode = this.root) {
    this.handleError(callback);

    if (currentNode === null) return; // Base case: end of subtree

    callback(currentNode.data); // Process the current node
    this.preOrder(callback, currentNode.left); // Recur to the left subtree
    this.preOrder(callback, currentNode.right); // Recur to the right subtree
  }

  // Perform in-order traversal (left, root, right)
  inOrder(callback, currentNode = this.root) {
    this.handleError(callback);

    if (currentNode === null) return; // Base case: end of subtree

    this.inOrder(callback, currentNode.left); // Recur to the left subtree
    callback(currentNode.data); // Process the current node
    this.inOrder(callback, currentNode.right); // Recur to the right subtree
  }

  // Perform post-order traversal (left, right, root)
  postOrder(callback, currentNode = this.root) {
    this.handleError(callback);

    if (currentNode === null) return; // Base case: end of subtree

    this.postOrder(callback, currentNode.left); // Recur to the left subtree
    this.postOrder(callback, currentNode.right); // Recur to the right subtree
    callback(currentNode.data); // Process the current node
  }

  // Calculate the height of a node (number of edges on the longest path to a leaf)
  height(node) {
    if (node === null) return -1; // Base case: null node has height -1

    const leftChild = this.height(node.left); // Height of the left subtree
    const rightChild = this.height(node.right); // Height of the right subtree

    return Math.max(leftChild, rightChild) + 1; // Return the maximum height + 1
  }

  // Calculate the depth of a node from the root
  depth(node, currentNode = this.root, currentDepth = 0) {
    if (node === null) return -1; // Base case: node not found

    if (node === currentNode) return currentDepth; // Node is found

    const leftSubTree = this.depth(node, currentNode.left, currentDepth + 1); // Check the left subtree

    if (leftSubTree !== -1) return leftSubTree; // If found in the left subtree

    return this.depth(node, currentNode.right, currentDepth + 1); // Otherwise, check the right subtree
  }

  // Check if the tree is balanced (height difference between left and right subtrees <= 1)
  isBalanced(currentNode = this.root) {
    const checkHeight = (node) => {
      if (node === null) return 0;

      const leftHeight = checkHeight(node.left); // Height of the left subtree
      if (leftHeight === -1) return -1; // Unbalanced tree

      const rightHeight = checkHeight(node.right); // Height of the right subtree
      if (rightHeight === -1) return -1; // Unbalanced tree

      if (Math.abs(leftHeight - rightHeight) > 1) return -1; // Unbalanced node

      return Math.max(leftHeight, rightHeight) + 1; // Return the height
    };

    return checkHeight(currentNode) !== -1; // Tree is balanced if height difference is within bounds
  }

  // Rebalance the tree by reconstructing it from sorted values
  rebalance() {
    const values = []; // Collect all values in in-order traversal
    const inOrderTraversal = (node) => {
      if (node === null) return;

      inOrderTraversal(node.left);
      values.push(node.data);
      inOrderTraversal(node.right);
    };

    inOrderTraversal(this.root);

    this.root = this.buildTree(values); // Rebuild the tree using the sorted values
  }
}

// Utility function to pretty-print the binary tree
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

// Generate random numbers and create the binary search tree
const generateRandomNumbers = (size, max = 100) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
};

// Generate an array of 15 random numbers
const randomNumbers = generateRandomNumbers(15);
console.log("Random numbers: ", randomNumbers);

// Create a binary search tree using the generated random numbers
const binarySearchTree = new Tree(randomNumbers);

// Check if the initial tree is balanced
console.log("Is the tree balanced:");
console.log(binarySearchTree.isBalanced());
console.log("======");

// Print the binary search tree in a structured format
prettyPrint(binarySearchTree.root);

// Define a callback function to print elements during traversals
function printData(element) {
  console.log(element);
}

// Perform level-order traversal and print each element
console.log("Level order:");
binarySearchTree.levelOrder(printData);

// Perform pre-order traversal and print each element
console.log("Preorder:");
binarySearchTree.preOrder(printData);

// Perform in-order traversal and print each element
console.log("Inorder:");
binarySearchTree.inOrder(printData);

// Perform post-order traversal and print each element
console.log("Postorder:");
binarySearchTree.postOrder(printData);

console.log("=====");

// Function to generate an additional array of random numbers
const generateRandomOtherNumbers = (size, max = 1000) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
};

// Generate 6 more random numbers and display them
console.log("New numbers:");
const moreNumbers = generateRandomOtherNumbers(6);
console.log(moreNumbers);
console.log("=====");

// Insert each new number into the binary search tree
moreNumbers.forEach((num) => binarySearchTree.insert(num));

// Check if the tree is still balanced after the insertions
console.log("Is the tree still balanced:");
console.log(binarySearchTree.isBalanced());
console.log("======");

// Print the updated binary search tree
prettyPrint(binarySearchTree.root);

// Rebalance the tree to restore balance after insertions
binarySearchTree.rebalance();
console.log("Is the tree rebalanced:");
console.log(binarySearchTree.isBalanced());
console.log("======");

// Print the rebalanced binary search tree
prettyPrint(binarySearchTree.root);
console.log("=====");

// Perform level-order traversal and print each element of the rebalanced tree
console.log("Level order:");
binarySearchTree.levelOrder(printData);

// Perform pre-order traversal and print each element of the rebalanced tree
console.log("Preorder:");
binarySearchTree.preOrder(printData);

// Perform in-order traversal and print each element of the rebalanced tree
console.log("Inorder:");
binarySearchTree.inOrder(printData);

// Perform post-order traversal and print each element of the rebalanced tree
console.log("Postorder:");
binarySearchTree.postOrder(printData);

console.log("=====");
