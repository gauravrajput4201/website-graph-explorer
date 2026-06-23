export interface GraphNode {
  id: string;
  url: string;
  title: string;
  depth: number;
  statusCode: number;
  inDegree: number;
  outDegree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  meta: {
    crawledAt: string;
    pageCount: number;
    domain: string;
  };
}

export type JobStatus = "waiting" | "active" | "completed" | "failed";

export interface CrawlOptions {
  url: string;
  depth: number;
  maxPages: number;
}

export interface JobProgress {
  jobId: string;
  status: JobStatus;
  progress: number;
  logLine?: string;
}
