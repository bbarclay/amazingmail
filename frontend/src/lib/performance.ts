// Performance monitoring utilities

export const measurePerformance = (metricName: string, callback: () => void) => {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${metricName}: ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};

export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  // You can send metrics to an analytics service here
};

export const prefetchRoute = (router: any, path: string) => {
  router.prefetch(path);
};
