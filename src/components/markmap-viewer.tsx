"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from '@/lib/markmap';
import { Toolbar } from 'markmap-toolbar';
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
  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap>();
  const refToolbar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refMm.current || !refSvg.current) return;
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
    if (refToolbar.current) {
      renderToolbar(refMm.current, refToolbar.current);
    }
  }, []);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(markdown);
    mm.setData(root);
    mm.fit();
  }, [markdown]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg className="w-full h-full" ref={refSvg} />
      <div className="absolute bottom-4 right-4" ref={refToolbar}></div>
    </div>
  );
}