import { TreeNode } from '@/types/tree';
import { transformer } from '@/lib/markmap';

// Use the official markmap IPureNode interface
interface IPureNode {
  content: string;
  children: IPureNode[];
  payload?: {
    [key: string]: unknown;
    fold?: number;
  };
}

// Convert our TreeNode to IPureNode format
const convertTreeNodeToPureNode = (node: TreeNode): IPureNode => {
  return {
    content: node.text,
    children: node.children.map(convertTreeNodeToPureNode),
    payload: {
      fold: 0, // Default to not folded
    },
  };
};

// Convert markdown to IPureNode using official markmap transformer
export const markdownToMarkmapData = (markdown: string) => {
  // Use the official markmap transformer to process the markdown
  const { root, features } = transformer.transform(markdown);
  return { root, features };
};

// Generate static HTML representation of the mindmap
export const generateStaticHTML = (nodes: TreeNode[]): string => {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return '<div style="text-align: center; color: #666; padding: 40px;">No mindmap data to display</div>';
  }
  
  const renderNode = (node: TreeNode, depth: number = 0): string => {
    const indent = depth * 30;
    const isRoot = depth === 0;
    
    let html = '';
    
    if (isRoot) {
      html += `<div class="mindmap-node" style="margin-left: ${indent}px;">${node.text}</div>`;
    } else {
      html += `<div class="mindmap-child" style="margin-left: ${indent}px;">${node.text}</div>`;
    }
    
    if (node.children && node.children.length > 0) {
      html += `<div class="mindmap-children">`;
      node.children.forEach(child => {
        html += renderNode(child, depth + 1);
      });
      html += `</div>`;
    }
    
    return html;
  };
  
  return nodes.map(node => renderNode(node)).join('');
};

// Generate complete interactive HTML using official markmap approach
export const generateMarkmapHTML = (markdownContent: string, mapTitle: string, treeData: TreeNode[]): string => {
  let transformResult;
  
  if (markdownContent.trim()) {
    // Use the official markmap transformer to process the markdown
    transformResult = markdownToMarkmapData(markdownContent);
  } else if (treeData.length > 0) {
    // Fallback to tree data
    transformResult = {
      root: { content: 'Mindmap', children: treeData.map(convertTreeNodeToPureNode) },
      features: {}
    };
  } else {
    // Empty mindmap
    transformResult = {
      root: { content: 'Empty Mindmap', children: [] },
      features: {}
    };
  }

  const { root, features } = transformResult;
  
  // Get the assets needed for this specific markmap
  const assets = transformer.getUsedAssets(features);
  
  // Base JavaScript files needed for markmap
  const baseJsFiles = [
    "https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js",
    "https://cdn.jsdelivr.net/npm/markmap-view@0.18.12/dist/browser/index.js",
    "https://cdn.jsdelivr.net/npm/markmap-toolbar@0.18.12/dist/browser/index.js"
  ];
  
  // Build CSS content
  const cssContent = [
    ...(assets.styles || []).map(style => {
      if (typeof style === 'string') {
        return `<link rel="stylesheet" href="${style}">`;
      } else if (style.type === 'stylesheet') {
        return `<link rel="stylesheet" href="${style.data.href}">`;
      } else if (style.type === 'style') {
        return `<style>${style.data}</style>`;
      }
      return '';
    })
  ].filter(Boolean).join('\n');
  
  // Build JavaScript content
  const jsContent = [
    ...baseJsFiles.map(src => `<script src="${src}"></script>`),
    ...(assets.scripts || []).map(script => {
      if (typeof script === 'string') {
        return `<script src="${script}"></script>`;
      } else if (script.type === 'script') {
        if (script.data.src) {
          return `<script src="${script.data.src}"></script>`;
        } else if (script.data.textContent) {
          return `<script>${script.data.textContent}</script>`;
        }
      } else if (script.type === 'iife') {
        return `<script>${script.data.fn.toString()}</script>`;
      }
      return '';
    }),
    `<script>
      (function() {
        const getMarkmap = () => window.markmap;
        const getOptions = () => null;
        const jsonOptions = {};
        const root = ${JSON.stringify(root)};
        
        const markmap = getMarkmap();
        const options = (getOptions || markmap.deriveOptions)(jsonOptions);
        window.mm = markmap.Markmap.create("svg#mindmap", options, root);
        
        // Add toolbar
        setTimeout(() => {
          if (window.markmap && window.markmap.Toolbar) {
            const { Toolbar } = window.markmap;
            const toolbar = new Toolbar();
            toolbar.attach(window.mm);
            const toolbarEl = toolbar.render();
            toolbarEl.setAttribute("style", "position:absolute;bottom:20px;right:20px");
            document.body.append(toolbarEl);
          }
        }, 100);
        
        // Dark mode toggle
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("markmap-dark");
        }
      })();
    </script>`
  ].filter(Boolean).join('\n');
  
  // Official markmap HTML template (based on markmap.js.org)
  return `<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>${mapTitle || 'Markmap'}</title>
<style>
* {
  margin: 0;
  padding: 0;
}
html {
  font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
#mindmap {
  display: block;
  width: 100vw;
  height: 100vh;
}
.markmap-dark {
  background: #27272a;
  color: white;
}

/* Toolbar styles */
.mm-toolbar {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
${cssContent}
</head>
<body>
<svg id="mindmap"></svg>
${jsContent}
</body>
</html>`;
};