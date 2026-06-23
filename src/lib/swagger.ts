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
            properties: {
              success: {
                type: "boolean",
                description: "Whether the request was successful",
                example: true,
              },
              code: {
                type: "integer",
                description: "HTTP status code",
                example: 200,
              },
              data: {
                type: ["object", "null"],
                description: "Response data (null if not provided)",
                example: { url: "https://example.com" },
              },
              message: {
                type: "string",
                description: "Response message (optional)",
                example: "Crawl job started successfully",
              },
            },
            required: ["success", "code", "data"],
          },
        },
      },
    },
  });
};
