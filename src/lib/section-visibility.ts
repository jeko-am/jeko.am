type SectionRecord = Record<string, unknown> | null | undefined;

export function hiddenSectionCss(sections: Record<string, SectionRecord>): string {
  return Object.entries(sections)
    .filter(([, section]) => section?.__isVisible === false)
    .map(([index]) => `[data-section-index="${index}"]{display:none!important;}`)
    .join("\n");
}

