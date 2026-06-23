"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { ErrorSuppressor } from "@/components/ErrorSuppressor";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <div className="p-8">Loading Swagger UI...</div>,
});

interface SwaggerPageProps {
  spec: object;
}

export default function SwaggerPage({ spec }: SwaggerPageProps) {
  return (
    <ErrorSuppressor>
      <div className="swagger-container">
        <SwaggerUI spec={spec} />
      </div>
    </ErrorSuppressor>
  );
}
