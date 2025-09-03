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
    
    // Apply theme-specific styling directly to SVG
    if (currentTheme === 'dark') {
      svg.style.backgroundColor = 'oklch(0.145 0 0)'; // Exact same as website dark background
      svg.style.color = 'oklch(0.985 0 0)'; // Exact same as website dark foreground
    } else {
      svg.style.backgroundColor = 'oklch(1 0 0)'; // Exact same as website light background
      svg.style.color = 'oklch(0.145 0 0)'; // Exact same as website light foreground
    }
    
    // Force re-render to apply theme changes
    mm.fit();
  }, [resolvedTheme, theme]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg 
        className="w-full h-full" 
        ref={refSvg}
      />
      <div className="absolute bottom-4 right-4" ref={refToolbar}></div>
    </div>
  );
}