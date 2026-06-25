import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/apiResponse";
import { ApiError, handleException } from "@/lib/exceptionHandler";
import { crawlWebsite } from "@/lib/crawler";

/**
 * @swagger
 * /api/crawl:
 *   post:
 *     summary: Start a crawl job
 *     description: Crawls a website up to the given depth and returns a graph of nodes and edges.
 *     tags:
 *       - Crawl
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrawlOptions'
 *     responses:
 *       200:
 *         description: Crawl completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/GraphData'
 *       400:
 *         description: Missing or invalid URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) throw new ApiError(400, "URL is required");
    if (typeof url !== "string") throw new ApiError(400, "URL must be a string");

    const data = await crawlWebsite({ url, depth: 2, maxPages: 100 });
    return ApiResponse(true, 200, data, "Crawl job started successfully");
  } catch (error) {
    return handleException(error);
  }
}
