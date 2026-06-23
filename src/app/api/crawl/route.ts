import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, type ApiResponse as IApiResponse } from "@/lib/apiResponse";
import { ApiError, handleException } from "@/lib/exceptionHandler";

/**
 * @swagger
 * /api/crawl:
 *   post:
 *     summary: Start a crawl job
 *     tags:
 *       - Crawl
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com"
 *             required:
 *               - url
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
export async function POST(req: NextRequest): Promise<NextResponse<IApiResponse>> {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      throw new ApiError(400, "URL is required");
    }

    if (typeof url !== "string") {
      throw new ApiError(400, "URL must be a string");
    }

    // TODO: Add crawl logic here
    const response = ApiResponse(true, 200, { url }, "Crawl job started successfully");
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorResponse = handleException(error);
    return NextResponse.json(errorResponse, { status: errorResponse.code });
  }
}
