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
    "https://cdn.jsdelivr.net/npm/markmap-view@0.18.12/dist/browser/index.js"
  ];
  
  // Build CSS content
  const cssContent = [
    // Include toolbar CSS
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markmap-toolbar@0.18.12/dist/style.css">',
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
        
        // Create a custom toolbar that matches the official markmap toolbar
        function createCustomToolbar() {
          if (!window.mm) {
            console.log('Markmap instance not ready yet');
            return false;
          }
          
          // Create toolbar container
          const toolbar = document.createElement('div');
          toolbar.className = 'mm-toolbar';
          toolbar.setAttribute("style", "position:absolute;bottom:20px;right:20px;z-index:1000;display:flex;align-items:center;background:rgba(255,255,255,0.9);border:1px solid #e5e7eb;border-radius:0.25rem;padding:0.25rem;box-shadow:0 1px 3px 0 rgba(0,0,0,0.1);");
          
          // Create toolbar items
          const items = [
            {
              title: 'Zoom in',
              icon: 'M9 5v4h-4v2h4v4h2v-4h4v-2h-4v-4z',
              action: () => window.mm && window.mm.rescale(1.25)
            },
            {
              title: 'Zoom out', 
              icon: 'M5 9h10v2h-10z',
              action: () => window.mm && window.mm.rescale(0.8)
            },
            {
              title: 'Fit window size',
              icon: 'M4 7h2v-2h2v4h-4zM4 13h2v2h2v-4h-4zM16 7h-2v-2h-2v4h4zM16 13h-2v2h-2v-4h4z',
              action: () => window.mm && window.mm.fit()
            },
            {
              title: 'Toggle dark theme',
              icon: 'M10 4a6 6 0 0 0 0 12a6 6 0 0 0 0 -12v2a4 4 0 0 1 0 8z',
              action: () => document.documentElement.classList.toggle('markmap-dark')
            }
          ];
          
          items.forEach(item => {
            const button = document.createElement('button');
            button.title = item.title;
            button.style.cssText = 'min-width:1rem;cursor:pointer;text-align:center;font-size:0.75rem;line-height:1rem;color:#a1a1aa;background:none;border:none;padding:0.25rem;border-radius:0.25rem;';
            button.innerHTML = \`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="\${item.icon}"/></svg>\`;
            button.addEventListener('click', item.action);
            button.addEventListener('mouseenter', () => {
              if (document.documentElement.classList.contains('markmap-dark')) {
                button.style.backgroundColor = '#52525b';
                button.style.color = '#f4f4f5';
              } else {
                button.style.backgroundColor = '#e4e4e7';
                button.style.color = '#27272a';
              }
            });
            button.addEventListener('mouseleave', () => {
              button.style.backgroundColor = 'transparent';
              if (document.documentElement.classList.contains('markmap-dark')) {
                button.style.color = '#a1a1aa';
              } else {
                button.style.color = '#a1a1aa';
              }
            });
            toolbar.appendChild(button);
          });
          
          document.body.append(toolbar);
          return true;
        }
        
        // Try to create toolbar with retries
        let attempts = 0;
        const maxAttempts = 5;
        const tryCreateToolbar = () => {
          attempts++;
          if (createCustomToolbar()) {
            return; // Success
          }
          if (attempts < maxAttempts) {
            setTimeout(tryCreateToolbar, 200);
          } else {
            console.error('Failed to create toolbar after', maxAttempts, 'attempts');
          }
        };
        
        // Start trying to create toolbar
        setTimeout(tryCreateToolbar, 300);
        
        
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
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.25rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

              .markmap-dark .mm-toolbar {
                background: rgba(39, 39, 42, 0.9);
                border-color: #52525b;
                color: #a1a1aa;
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