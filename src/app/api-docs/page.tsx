import { getApiDocs } from "@/lib/swagger";
import SwaggerPage from "./swagger-page";

export default async function ApiDocsPage() {
  const spec = await getApiDocs();
  return <SwaggerPage spec={spec} />;
}
