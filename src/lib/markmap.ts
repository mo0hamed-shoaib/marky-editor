import { loadCSS, loadJS } from 'markmap-common';
import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';

// Create transformer with default configuration
export const transformer = new Transformer();

const { scripts, styles } = transformer.getAssets();

// Only load CSS/JS on client side
if (typeof window !== 'undefined') {
  if (styles) loadCSS(styles);
  if (scripts) loadJS(scripts, { getMarkmap: () => markmap });
}
