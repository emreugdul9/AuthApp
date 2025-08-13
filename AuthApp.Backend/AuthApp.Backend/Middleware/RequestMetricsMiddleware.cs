using System.Diagnostics;

namespace AuthApp.Backend.Middleware
{
    public class RequestMetricsMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestMetricsMiddleware> _logger;
        private static long _requestCount = 0;
        private static readonly Dictionary<string, long> _endpointCounts = new();
        private static readonly object _lock = new();

        public RequestMetricsMiddleware(RequestDelegate next, ILogger<RequestMetricsMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            var requestId = Guid.NewGuid().ToString("N")[..8];

            Interlocked.Increment(ref _requestCount);

            var endpoint = $"{context.Request.Method} {context.Request.Path}";
            lock (_lock)
            {
                _endpointCounts[endpoint] = _endpointCounts.GetValueOrDefault(endpoint, 0) + 1;
            }

            _logger.LogInformation("Request {RequestId} started: {Method} {Path} | Total requests: {TotalCount}",
                requestId, context.Request.Method, context.Request.Path, _requestCount);

            try
            {
                await _next(context);
            }
            finally
            {
                stopwatch.Stop();
                _logger.LogInformation("Request {RequestId} completed: {StatusCode} in {ElapsedMs}ms | Endpoint count: {EndpointCount}",
                    requestId, context.Response.StatusCode, stopwatch.ElapsedMilliseconds, 
                    _endpointCounts.GetValueOrDefault(endpoint, 0));
            }
        }

        public static (long TotalRequests, Dictionary<string, long> EndpointCounts) GetMetrics()
        {
            lock (_lock)
            {
                return (_requestCount, new Dictionary<string, long>(_endpointCounts));
            }
        }
    }
}
