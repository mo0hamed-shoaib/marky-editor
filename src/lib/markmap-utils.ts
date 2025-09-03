export interface MindmapNode {
  id: string
  text: string
  children?: MindmapNode[]
  level: number
  expanded?: boolean
}

export interface MindmapData {
  root: MindmapNode
  nodes: Map<string, MindmapNode>
}

export class MarkmapUtils {
  static parseMarkdownToMindmap(markdown: string): MindmapData {
    const lines = markdown.split('\n').filter(line => line.trim())
    const nodes = new Map<string, MindmapNode>()
    const root: MindmapNode = { id: 'root', text: 'Root', level: 0, children: [], expanded: true }
    
    let currentNode = root
    let currentLevel = 0
    let nodeCounter = 0

    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // Count leading # to determine level
      const level = (trimmedLine.match(/^#+/) || [''])[0].length
      
      if (level === 0) {
        // Regular text line - treat as content of current node
        if (currentNode.text === 'Root') {
          currentNode.text = trimmedLine
        } else {
          currentNode.text += '\n' + trimmedLine
        }
        return
      }

      const text = trimmedLine.replace(/^#+\s*/, '').trim()
      const nodeId = `node-${nodeCounter++}`
      
      const newNode: MindmapNode = {
        id: nodeId,
        text,
        level,
        children: [],
        expanded: true
      }

      nodes.set(nodeId, newNode)

      // Find parent node
      if (level === 1) {
        root.children!.push(newNode)
        currentNode = newNode
        currentLevel = level
      } else if (level > currentLevel) {
        // Child node
        currentNode.children!.push(newNode)
        currentNode = newNode
        currentLevel = level
      } else if (level === currentLevel) {
        // Sibling node
        const parent = this.findParentNode(root, level - 1)
        if (parent) {
          parent.children!.push(newNode)
          currentNode = newNode
        }
      } else {
        // Go back up the tree
        const parent = this.findParentNode(root, level - 1)
        if (parent) {
          parent.children!.push(newNode)
          currentNode = newNode
          currentLevel = level
        }
      }
    })

    return { root, nodes }
  }

  private static findParentNode(node: MindmapNode, targetLevel: number): MindmapNode | null {
    if (node.level === targetLevel) {
      return node
    }
    
    if (node.children) {
      for (const child of node.children) {
        const result = this.findParentNode(child, targetLevel)
        if (result) return result
      }
    }
    
    return null
  }

  static mindmapToMarkdown(mindmap: MindmapData): string {
    const lines: string[] = []
    
    const traverse = (node: MindmapNode, level: number) => {
      if (node.text && node.text !== 'Root') {
        const prefix = '#'.repeat(level)
        lines.push(`${prefix} ${node.text}`)
      }
      
      if (node.children) {
        node.children.forEach(child => traverse(child, level + 1))
      }
    }
    
    traverse(mindmap.root, 0)
    return lines.join('\n')
  }

  static addNode(parentId: string, text: string, mindmap: MindmapData): MindmapData {
    const parent = mindmap.nodes.get(parentId)
    if (!parent) return mindmap

    const newNodeId = `node-${Date.now()}`
    const newNode: MindmapNode = {
      id: newNodeId,
      text,
      level: parent.level + 1,
      children: [],
      expanded: true
    }

    parent.children!.push(newNode)
    mindmap.nodes.set(newNodeId, newNode)

    return mindmap
  }

  static updateNode(nodeId: string, text: string, mindmap: MindmapData): MindmapData {
    const node = mindmap.nodes.get(nodeId)
    if (node) {
      node.text = text
    }
    return mindmap
  }

  static deleteNode(nodeId: string, mindmap: MindmapData): MindmapData {
    const node = mindmap.nodes.get(nodeId)
    if (!node) return mindmap

    // Remove from parent's children
    const parent = this.findParentNodeById(mindmap.root, nodeId)
    if (parent && parent.children) {
      parent.children = parent.children.filter(child => child.id !== nodeId)
    }

    // Remove from nodes map
    mindmap.nodes.delete(nodeId)

    return mindmap
  }

  private static findParentNodeById(node: MindmapNode, targetId: string): MindmapNode | null {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === targetId) {
          return node
        }
        const result = this.findParentNodeById(child, targetId)
        if (result) return result
      }
    }
    return null
  }

  static exportToMarkdown(mindmap: MindmapData): string {
    return this.mindmapToMarkdown(mindmap)
  }

  static importFromMarkdown(markdown: string): MindmapData {
    return this.parseMarkdownToMindmap(markdown)
  }
}
