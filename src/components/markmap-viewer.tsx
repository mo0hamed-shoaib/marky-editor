"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from '@/lib/markmap';
import { Toolbar } from 'markmap-toolbar';
import { useTheme } from 'next-themes';
import 'markmap-toolbar/dist/style.css';

interface MarkmapViewerProps {
  markdown: string;
  className?: string;
}

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    wrapper.append(toolbar.render());
  }
}

export function MarkmapViewer({ markdown, className }: MarkmapViewerProps) {
  const { theme, resolvedTheme } = useTheme();
  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap | null>(null);
  const refToolbar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refMm.current || !refSvg.current) return;
    
    // Create Markmap with basic options
    const mm = Markmap.create(refSvg.current);
    
    refMm.current = mm;
    if (refToolbar.current) {
      renderToolbar(refMm.current, refToolbar.current);
    }
  }, [resolvedTheme, theme]);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(markdown);
    mm.setData(root);
    mm.fit();
  }, [markdown]);

  // Update Markmap theme when theme changes
  useEffect(() => {
    const mm = refMm.current;
    if (!mm || !refSvg.current) return;
    
    const currentTheme = resolvedTheme || theme || 'light';
    const svg = refSvg.current;
    
    // Apply theme-specific CSS variables
    if (currentTheme === 'dark') {
      svg.style.setProperty('--markmap-node-fill', '#1f2937');
      svg.style.setProperty('--markmap-node-stroke', '#4b5563');
      svg.style.setProperty('--markmap-link-stroke', '#6b7280');
      svg.style.setProperty('--markmap-text-fill', '#f9fafb');
      svg.style.setProperty('--markmap-background', '#111827');
    } else {
      svg.style.setProperty('--markmap-node-fill', '#ffffff');
      svg.style.setProperty('--markmap-node-stroke', '#d1d5db');
      svg.style.setProperty('--markmap-link-stroke', '#9ca3af');
      svg.style.setProperty('--markmap-text-fill', '#111827');
      svg.style.setProperty('--markmap-background', '#ffffff');
    }
    
    // Force re-render to apply theme changes
    mm.fit();
  }, [resolvedTheme, theme]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg 
        className="w-full h-full markmap-svg" 
        ref={refSvg}
        style={{
          '--markmap-node-fill': 'var(--markmap-node-fill, #ffffff)',
          '--markmap-node-stroke': 'var(--markmap-node-stroke, #d1d5db)',
          '--markmap-link-stroke': 'var(--markmap-link-stroke, #9ca3af)',
          '--markmap-text-fill': 'var(--markmap-text-fill, #111827)',
          '--markmap-background': 'var(--markmap-background, #ffffff)',
        } as React.CSSProperties}
      />
      <div className="absolute bottom-4 right-4" ref={refToolbar}></div>
    </div>
  );
}