export interface DimensionMeta {
  key: string;
  acronym: string;
  fullName: string;
  weight: string;
  whyItMatters: string;
}

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: "csiAlignment",
    acronym: "CSI",
    fullName: "Central Search Intent Alignment",
    weight: "High",
    whyItMatters: "AI models prioritize content that directly and completely addresses the core intent behind a search query.",
  },
  {
    key: "blufQuality",
    acronym: "BLUF",
    fullName: "Bottom Line Up Front",
    weight: "Medium-High",
    whyItMatters: "AI systems prefer content that leads with the answer rather than burying it, making extraction faster and more reliable.",
  },
  {
    key: "chunkQuality",
    acronym: "",
    fullName: "Section Autonomy and Chunk Sizing",
    weight: "Medium",
    whyItMatters: "AI models extract content in chunks. Self-contained, well-sized sections are easier to cite without losing context.",
  },
  {
    key: "urrPlacement",
    acronym: "URR",
    fullName: "Unique, Rare, and Remarkable Attribute Placement",
    weight: "Medium",
    whyItMatters: "AI answer engines favor content with distinctive facts and data points that differentiate it from commodity information.",
  },
  {
    key: "costOfRetrieval",
    acronym: "",
    fullName: "Cost of Retrieval (Structure and Formatting Quality)",
    weight: "Medium",
    whyItMatters: "Well-structured content with clear headings, lists, and tables reduces the computational cost for AI models to extract information.",
  },
  {
    key: "informationDensity",
    acronym: "",
    fullName: "Information Density (Fact-to-Filler Ratio)",
    weight: "Medium-High",
    whyItMatters: "AI models rank content higher when every sentence adds factual value rather than filler, fluff, or repeated claims.",
  },
  {
    key: "srlSalience",
    acronym: "SRL",
    fullName: "Semantic Role Labeling Salience",
    weight: "Low-Medium",
    whyItMatters: "When the main entity is the grammatical subject of sentences, AI models can more easily attribute claims and build knowledge graphs.",
  },
  {
    key: "tfidfQuality",
    acronym: "TF-IDF",
    fullName: "Term Frequency-Inverse Document Frequency Quality",
    weight: "Medium",
    whyItMatters: "Specialized, domain-specific terminology signals expertise and helps AI models distinguish authoritative content from generic rewrites.",
  },
  {
    key: "eeat",
    acronym: "E-E-A-T",
    fullName: "Experience, Expertise, Authoritativeness, and Trustworthiness",
    weight: "High",
    whyItMatters: "AI search engines use E-E-A-T signals to determine which sources are credible enough to cite in their responses.",
  },
];
