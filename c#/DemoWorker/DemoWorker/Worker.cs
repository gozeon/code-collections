using Microsoft.Extensions.Options;

namespace DemoWorker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly TaskOptions _options;

        public Worker(ILogger<Worker> logger, IOptions<TaskOptions> options)
        {
            _logger = logger;
            _options = options.Value;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Worker started");

            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logger.IsEnabled(LogLevel.Information))
                {
                    _logger.LogInformation("Worker running {message} at: {time}", _options.Message, DateTimeOffset.Now);
                }
                await Task.Delay(TimeSpan.FromSeconds(_options.IntervalSeconds), stoppingToken);
            }

            _logger.LogInformation("Worker stopping");
        }
    }
}
