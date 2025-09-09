// Performance utilities for React components
import React, { ComponentType } from 'react';

// Retry logic for dynamic imports
export const retryImport = async <T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  retries = 3,
  delay = 1000
): Promise<{ default: ComponentType<T> }> => {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryImport(importFn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Memoization helper for component props
export const createMemoizedComponent = <T extends object>(
  Component: ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) => {
  return React.memo(Component, propsAreEqual);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Props comparison for complex objects
export const shallowEqual = <T extends object>(prevProps: T, nextProps: T): boolean => {
  const keys1 = Object.keys(prevProps) as (keyof T)[];
  const keys2 = Object.keys(nextProps) as (keyof T)[];
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (prevProps[key] !== nextProps[key]) return false;
  }
  
  return true;
};