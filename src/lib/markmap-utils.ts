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

// Markmap export node structure as found inside HTML exports
interface MarkmapExportNode {
  content?: string
  children?: MarkmapExportNode[]
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

  /**
   * Extract markdown content from a markmap HTML file
   * @param htmlContent The HTML content of the exported markmap
   * @returns The extracted markdown content
   */
  static extractMarkdownFromHTML(htmlContent: string): string {
    try {
      // Try multiple patterns to find markmap data
      const patterns = [
        // Pattern 1: Marky export format - const root = {...};
        { search: 'const root = ', description: 'Marky export format' },
        // Pattern 2: markmap.js.org IIFE format - ((b,L,T,D)=>{...})(()=>window.markmap,null,{DATA},null)
        { search: '((b,L,T,D)=>{', description: 'markmap.js.org IIFE format' },
        // Pattern 3: Standard markmap format - window.mm = markmap.Markmap.create(..., root);
        { search: 'window.mm = markmap.Markmap.create', description: 'Standard markmap format' },
        // Pattern 4: Look for JSON data in script tags
        { search: 'JSON.stringify', description: 'JSON stringified data' },
        // Pattern 5: Look for markmap data in data attributes or variables
        { search: 'markmap', description: 'General markmap reference' }
      ];

      let rootData: MarkmapExportNode | null = null;

      // Try each pattern
      for (const pattern of patterns) {
        const index = htmlContent.indexOf(pattern.search);
        if (index !== -1) {
          // Found pattern, attempting extraction
          
          if (pattern.search === 'const root = ') {
            rootData = this.extractFromConstRoot(htmlContent, index);
            if (rootData) break;
          } else if (pattern.search === '((b,L,T,D)=>{') {
            rootData = this.extractFromMarkmapJsOrg(htmlContent, index);
            if (rootData) break;
          } else if (pattern.search === 'window.mm = markmap.Markmap.create') {
            rootData = this.extractFromMarkmapCreate(htmlContent, index);
            if (rootData) break;
          } else if (pattern.search === 'JSON.stringify') {
            rootData = this.extractFromJsonStringify(htmlContent);
            if (rootData) break;
          }
        }
      }

      if (!rootData) {
        // If no pattern worked, try to extract any JSON-like data from script tags
        rootData = this.extractFromScriptTags(htmlContent);
      }

      if (!rootData) {
        // Debug: Log some information about the HTML file to help troubleshoot
        const hasScript = htmlContent.includes('<script');
        const hasMarkmap = htmlContent.toLowerCase().includes('markmap');
        const hasD3 = htmlContent.toLowerCase().includes('d3');
        const hasSvg = htmlContent.includes('<svg');
        
        console.log('HTML Debug Info:', {
          hasScript,
          hasMarkmap,
          hasD3,
          hasSvg,
          fileSize: htmlContent.length,
          firstScript: htmlContent.indexOf('<script'),
          firstMarkmap: htmlContent.toLowerCase().indexOf('markmap')
        });
        
        throw new Error(`Could not find markmap data in HTML file. Debug info: Script tags: ${hasScript}, Markmap references: ${hasMarkmap}, D3 references: ${hasD3}, SVG elements: ${hasSvg}. Please ensure this is a valid markmap HTML file exported from Marky or another markmap tool.`);
      }

      // Successfully extracted data
      
      // Convert the markmap tree structure back to markdown
      return this.convertMarkmapDataToMarkdown(rootData);
    } catch (error) {
      throw new Error(`Failed to extract markdown from HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract data from "const root = " pattern
   */
  private static extractFromConstRoot(htmlContent: string, startIndex: number): MarkmapExportNode | null {
    const jsonStartIndex = startIndex + 'const root = '.length;
    
    // Find the end of the JSON object by counting braces
    let braceCount = 0;
    let jsonEndIndex = jsonStartIndex;
    let inStringConst = false;
    let isEscapedConst = false;

    for (let i = jsonStartIndex; i < htmlContent.length; i++) {
      const char = htmlContent[i];
      
      if (isEscapedConst) {
        isEscapedConst = false;
        continue;
      }
      
      if (char === '\\') {
        isEscapedConst = true;
        continue;
      }
      
      if (char === '"' && !isEscapedConst) {
        inStringConst = !inStringConst;
        continue;
      }
      
      if (!inStringConst) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEndIndex = i + 1;
            break;
          }
        }
      }
    }

    if (braceCount !== 0) {
      return null;
    }

    const jsonString = htmlContent.substring(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonString) as MarkmapExportNode;
  }

  /**
   * Extract data from markmap.js.org IIFE format
   * Pattern: ((b,L,T,D)=>{...})(()=>window.markmap,null,{DATA},null)
   */
  private static extractFromMarkmapJsOrg(htmlContent: string, startIndex: number): MarkmapExportNode | null {
    // Find the complete IIFE call
    const iifeStart = htmlContent.indexOf('((b,L,T,D)=>{', startIndex);
    if (iifeStart === -1) {
      return null;
    }

    // The IIFE has two parts: ((b,L,T,D)=>{...})(()=>window.markmap,null,{DATA},null)
    // We need to find the second part which contains the actual data
    
    // Find the end of the first part (the function definition)
    let parenCount = 0;
    let firstPartEnd = iifeStart;
    let inStringIife = false;
    let isEscapedIife = false;

    for (let i = iifeStart; i < htmlContent.length; i++) {
      const char = htmlContent[i];
      
      if (isEscapedIife) {
        isEscapedIife = false;
        continue;
      }
      
      if (char === '\\') {
        isEscapedIife = true;
        continue;
      }
      
      if (char === '"' && !isEscapedIife) {
        inStringIife = !inStringIife;
        continue;
      }
      
      if (!inStringIife) {
        if (char === '(') {
          parenCount++;
        } else if (char === ')') {
          parenCount--;
          if (parenCount === 0) {
            firstPartEnd = i + 1;
            break;
          }
        }
      }
    }

    if (parenCount !== 0) {
      return null;
    }

    // Now find the second part which contains the data
    // Look for the pattern: (()=>window.markmap,null,{DATA},null)
    const secondPartStart = htmlContent.indexOf('(()=>window.markmap,null,', firstPartEnd);
    if (secondPartStart === -1) {
      return null;
    }

    // Find the start of the JSON data (after "null,")
    const jsonStart = htmlContent.indexOf('{', secondPartStart);
    if (jsonStart === -1) {
      return null;
    }
    
    // Find the end of the JSON object by counting braces
    let braceCount = 0;
    let jsonEnd = jsonStart;
    let inStringJson = false;
    let isEscapedJson = false;

    for (let i = jsonStart; i < htmlContent.length; i++) {
      const char = htmlContent[i];
      
      if (isEscapedJson) {
        isEscapedJson = false;
        continue;
      }
      
      if (char === '\\') {
        isEscapedJson = true;
        continue;
      }
      
      if (char === '"' && !isEscapedJson) {
        inStringJson = !inStringJson;
        continue;
      }
      
      if (!inStringJson) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
      }
    }

    if (braceCount !== 0) {
      return null;
    }

    // Extract the JSON string
    const jsonString = htmlContent.substring(jsonStart, jsonEnd);
    try {
      return JSON.parse(jsonString) as MarkmapExportNode;
    } catch {
      return null;
    }

    return null;
  }

  /**
   * Extract data from markmap.create pattern
   */
  private static extractFromMarkmapCreate(htmlContent: string, startIndex: number): MarkmapExportNode | null {
    // Look for the root parameter in the create call
    const createCall = htmlContent.substring(startIndex, startIndex + 200);
    const rootMatch = createCall.match(/create\([^,]+,\s*([^,)]+)\)/);
    if (rootMatch) {
      try {
        return JSON.parse(rootMatch[1]) as MarkmapExportNode;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Extract data from JSON.stringify pattern
   */
  private static extractFromJsonStringify(htmlContent: string): MarkmapExportNode | null {
    // Look for JSON.stringify(root) pattern
    const stringifyMatch = htmlContent.match(/JSON\.stringify\(([^)]+)\)/);
    if (stringifyMatch) {
      try {
        // Try to find the variable definition
        const varName = stringifyMatch[1].trim();
        const varMatch = htmlContent.match(new RegExp(`const\\s+${varName}\\s*=\\s*({[^;]+});`));
        if (varMatch) {
          return JSON.parse(varMatch[1]) as MarkmapExportNode;
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Extract data from script tags
   */
  private static extractFromScriptTags(htmlContent: string): MarkmapExportNode | null {
    const scriptMatch = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      const scriptContent = scriptMatch[1];
      
      // Look for any JSON-like object that might be markmap data
      const jsonMatches = scriptContent.match(/\{[^{}]*"content"[^{}]*\}/g);
      if (jsonMatches) {
        for (const match of jsonMatches) {
          try {
            const parsed = JSON.parse(match) as MarkmapExportNode;
            if (parsed.content && (parsed.children || Array.isArray(parsed))) {
              return parsed;
            }
          } catch {
            continue;
          }
        }
      }
    }
    return null;
  }

  /**
   * Convert markmap data structure back to markdown
   * @param node The markmap node data
   * @param level The current heading level (starts at 1)
   * @returns The markdown representation
   */
  private static convertMarkmapDataToMarkdown(node: MarkmapExportNode, level: number = 1): string {
    if (!node) return '';

    let markdown = '';
    
    // Add the current node as a heading (if it has content and is not empty)
    if (node.content && node.content.trim() && node.content !== 'Empty Mindmap') {
      // Clean up the content - remove HTML entities and tags
      const cleanContent = node.content
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#x2019;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/<code>/g, '`')
        .replace(/<\/code>/g, '`')
        .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags
      
      const headingPrefix = '#'.repeat(Math.min(level, 3)); // Max 3 levels of headings
      markdown += `${headingPrefix} ${cleanContent}\n`;
    }

    // Process children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (level < 3) {
          // Use headings for first 3 levels
          markdown += this.convertMarkmapDataToMarkdown(child, level + 1);
        } else {
          // Use list items for deeper levels
          markdown += this.convertChildrenToListItems(child, level);
        }
      }
    }

    return markdown;
  }

  /**
   * Convert children nodes to markdown list items
   * @param node The markmap node data
   * @param level The current level
   * @returns The markdown list representation
   */
  private static convertChildrenToListItems(node: MarkmapExportNode, level: number): string {
    if (!node) return '';

    let markdown = '';
    const indent = '  '.repeat(level - 3); // Indent based on depth beyond level 3

    if (node.content && node.content.trim()) {
      // Clean up the content - remove HTML entities and tags
      const cleanContent = node.content
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#x2019;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/<code>/g, '`')
        .replace(/<\/code>/g, '`')
        .replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags
      
      markdown += `${indent}- ${cleanContent}\n`;
    }

    // Process nested children
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        markdown += this.convertChildrenToListItems(child, level + 1);
      }
    }

    return markdown;
  }
}
