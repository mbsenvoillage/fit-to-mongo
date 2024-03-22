const graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["D"],
  D: ["C"],
};

const visited = [];

function detectCycle(graph) {
  let visited = new Set(); // Tracks visited nodes
  let recStack = new Set(); // Tracks nodes in the current recursion stack

  function dfs(node) {
    if (recStack.has(node)) {
      // If the node is in the recursion stack, we found a cycle
      console.log("Detected a cycle involving node: ", node);
      return true;
    }

    if (visited.has(node)) {
      // If we've already visited the node and it's not in the recursion stack, no cycle here
      return false;
    }

    visited.add(node); // Mark the node as visited
    recStack.add(node); // Add the node to the recursion stack

    // Explore all neighbors
    for (let neighbor of graph[node]) {
      if (dfs(neighbor)) {
        return true; // If a cycle is detected in any neighbor, return true
      }
    }

    recStack.delete(node); // Remove the node from the recursion stack after exploring
    return false; // No cycle found from this node
  }

  // Check for cycles starting from each node
  for (let node in graph) {
    if (dfs(node)) {
      return true; // Cycle detected
    }
  }

  return false; // No cycle detected in the graph
}
function B(graph) {
  function dfs(node) {
    if (visited.includes(node)) {
      return false;
    }

    if (visited.length && graph[node].includes(visited[visited.length - 1])) {
      console.log("Detected a cycle");
      return true;
    }

    console.log("visited: ", node);

    visited.push(node);

    for (let child of graph[node]) {
      if (dfs(child)) {
        return true;
      }
    }
  }

  for (let node in graph) {
    if (dfs(node)) {
      return true;
    }
  }

  return false;
}

console.log(detectCycle(graph));
