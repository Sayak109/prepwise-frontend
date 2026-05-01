"use client";

import { useMemo } from "react";

function sanitizeHtml(html: string) {
  const doc = new DOMParser().parseFromString(html ?? "", "text/html");
  doc.querySelectorAll("script, style, iframe, object, embed").forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (attr.name.toLowerCase().startsWith("on")) el.removeAttribute(attr.name);
    });
  });
  return doc.body.innerHTML;
}

export function HtmlBlock({ html, className }: { html: string; className?: string }) {
  const safe = useMemo(() => sanitizeHtml(html), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}

