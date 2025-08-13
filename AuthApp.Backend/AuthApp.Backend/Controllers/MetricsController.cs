using AuthApp.Backend.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace AuthApp.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetricsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMetrics()
        {
            var (totalRequests, endpointCounts) = RequestMetricsMiddleware.GetMetrics();

            return Ok(new
            {
                TotalRequests = totalRequests,
                EndpointCounts = endpointCounts,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
