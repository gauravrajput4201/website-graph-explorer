"use client";

import React, { useEffect } from "react";

export function ErrorSuppressor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress console.error for specific warnings
    const originalError = console.error;
    
    console.error = (...args: any[]) => {
      const message = String(args[0] || '');
      
      if (
        message.includes('UNSAFE_componentWillReceiveProps') ||
        (args.length > 0 && String(args[args.length - 1] || '').includes('RequestBodyEditor'))
      ) {
        return;
      }
      
      originalError.apply(console, args as any);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <>{children}</>;
}
