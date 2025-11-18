export type GeneratedFile = {
  path: string;
  description: string;
  content: string;
};

export type ScaffoldResult = {
  summary: string;
  architectureNotes: string;
  files: GeneratedFile[];
};
