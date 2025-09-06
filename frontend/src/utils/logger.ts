// Structured logging system for debugging and monitoring
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error
    };
  }

  private log(entry: LogEntry): void {
    if (!this.isDevelopment && entry.level === 'debug') return;
    
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    
    switch (entry.level) {
      case 'error':
        console.error(prefix, entry.message, entry.context, entry.error);
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.context);
        break;
      case 'info':
        console.info(prefix, entry.message, entry.context);
        break;
      case 'debug':
        console.debug(prefix, entry.message, entry.context);
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(this.formatMessage('debug', message, context));
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(this.formatMessage('error', message, context, error));
  }

  // Landing page specific logging
  componentMount(componentName: string): void {
    this.debug(`Component mounted: ${componentName}`);
  }

  componentUnmount(componentName: string): void {
    this.debug(`Component unmounted: ${componentName}`);
  }

  userInteraction(action: string, element?: string): void {
    this.info(`User interaction: ${action}`, { element });
  }

  performanceMetric(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric}`, { value, unit });
  }
}

export const logger = new Logger();
export default logger;