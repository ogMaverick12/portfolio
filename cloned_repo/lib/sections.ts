export const SECTIONS = {
  projects: "02",
  about: "03",
  education: "04",
  achievements: "05",
  journey: "06",
  manifesto: "07",
  blog: "08",
  terminal: "09",
  stats: "10",
  contact: "11",
} as const;

export type SectionKey = keyof typeof SECTIONS;

export function getSectionNum(key: SectionKey): string {
  return SECTIONS[key];
}
