// Suppress known third-party library warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Suppress swagger-ui-react UNSAFE_componentWillReceiveProps warning
    // This is a known issue in swagger-ui-react's RequestBodyEditor component
    // that doesn't affect functionality
    if (
      message.includes('UNSAFE_componentWillReceiveProps') ||
      message.includes('RequestBodyEditor')
    ) {
      return;
    }
    
    originalError(...args);
  };
}
