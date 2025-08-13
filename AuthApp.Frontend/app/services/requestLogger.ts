interface RequestLog {
  method: string;
  url: string;
  timestamp: Date;
  duration?: number;
  status?: number;
  error?: string;
}

class RequestLogger {
  private logs: RequestLog[] = [];
  private maxLogs = 100;

  logRequest(method: string, url: string): RequestLog {
    const log: RequestLog = {
      method,
      url,
      timestamp: new Date()
    };
    
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    
    console.log(`🚀 ${method} ${url} at ${log.timestamp.toISOString()}`);
    return log;
  }

  completeRequest(log: RequestLog, status: number, duration: number) {
    log.status = status;
    log.duration = duration;
    
    const statusIcon = status >= 200 && status < 300 ? '✅' : '❌';
    console.log(`${statusIcon} ${log.method} ${log.url} - ${status} (${duration}ms)`);
  }

  errorRequest(log: RequestLog, error: string, duration: number) {
    log.error = error;
    log.duration = duration;
    
    console.error(`❌ ${log.method} ${log.url} - Error: ${error} (${duration}ms)`);
  }

  getLogs(): RequestLog[] {
    return [...this.logs];
  }

  getStats() {
    const totalRequests = this.logs.length;
    const successfulRequests = this.logs.filter(log => log.status && log.status >= 200 && log.status < 300).length;
    const failedRequests = this.logs.filter(log => log.status && log.status >= 400 || log.error).length;
    const avgDuration = this.logs
      .filter(log => log.duration)
      .reduce((sum, log) => sum + (log.duration || 0), 0) / 
      this.logs.filter(log => log.duration).length || 0;

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      avgDuration: Math.round(avgDuration)
    };
  }
}

export const requestLogger = new RequestLogger();
export type { RequestLog };
