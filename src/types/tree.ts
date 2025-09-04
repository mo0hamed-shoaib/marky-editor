// Define proper types for tree nodes
export interface TreeNode {
  id: string
  text: string
  level: number
  children: TreeNode[]
}
