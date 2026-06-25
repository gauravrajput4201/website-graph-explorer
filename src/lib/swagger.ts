"use server";

import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Site Graph API Documentation",
        version: "1.0.0",
        description: "API for managing site graph crawling and visualization",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local development server",
        },
        {
          url: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
          description: "Production server",
        },
      ],
      components: {
        schemas: {
          ApiResponse: {
            type: "object",
            required: ["success", "code", "data"],
            properties: {
              success: { type: "boolean", example: true },
              code: { type: "integer", example: 200 },
              data: {
                nullable: true,
                description: "Response payload, null when not applicable",
              },
              message: { type: "string", example: "Crawl job started successfully" },
            },
          },
          GraphNode: {
            type: "object",
            required: ["id", "url", "title", "depth", "statusCode", "inDegree", "outDegree"],
            properties: {
              id: { type: "string", example: "https://example.com/about" },
              url: { type: "string", example: "https://example.com/about" },
              title: { type: "string", example: "About Us" },
              depth: { type: "integer", example: 1 },
              statusCode: { type: "integer", example: 200 },
              inDegree: { type: "integer", example: 3 },
              outDegree: { type: "integer", example: 5 },
            },
          },
          GraphEdge: {
            type: "object",
            required: ["source", "target"],
            properties: {
              source: { type: "string", example: "https://example.com" },
              target: { type: "string", example: "https://example.com/about" },
            },
          },
          GraphData: {
            type: "object",
            required: ["nodes", "edges", "meta"],
            properties: {
              nodes: {
                type: "array",
                items: { $ref: "#/components/schemas/GraphNode" },
              },
              edges: {
                type: "array",
                items: { $ref: "#/components/schemas/GraphEdge" },
              },
              meta: {
                type: "object",
                required: ["crawledAt", "pageCount", "domain"],
                properties: {
                  crawledAt: { type: "string", format: "date-time", example: "2026-06-24T10:00:00Z" },
                  pageCount: { type: "integer", example: 42 },
                  domain: { type: "string", example: "example.com" },
                },
              },
            },
          },
          CrawlOptions: {
            type: "object",
            required: ["url"],
            properties: {
              url: { type: "string", format: "uri", example: "https://example.com" },
              depth: { type: "integer", default: 2, example: 2 },
              maxPages: { type: "integer", default: 100, example: 100 },
            },
          },
        },
      },
    },
  });
};
