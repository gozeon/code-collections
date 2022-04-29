package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
	"github.com/uber/jaeger-client-go"
	jaegerConfig "github.com/uber/jaeger-client-go/config"
	jaegerLog "github.com/uber/jaeger-client-go/log"
)

func main() {
	r := gin.Default()

	r.Use(func(c *gin.Context) {

		cfg := jaegerConfig.Configuration{
			ServiceName: "gin 中间件上报",
			Sampler: &jaegerConfig.SamplerConfig{
				Type:  jaeger.SamplerTypeConst,
				Param: 1,
			},
			Reporter: &jaegerConfig.ReporterConfig{
				LogSpans:          true,
				CollectorEndpoint: "http://127.0.0.1:14268/api/traces",
				// LocalAgentHostPort: "192.168.20.162:5775",
			},
		}

		tracer, closer, err := cfg.NewTracer(
			jaegerConfig.Logger(jaegerLog.StdLogger),
		)
		defer closer.Close()
		if err != nil {
			log.Fatal(err)
		}

		var parentSpan opentracing.Span

		spanContext, err := tracer.Extract(opentracing.HTTPHeaders, opentracing.HTTPHeadersCarrier(c.Request.Header))
		if err != nil {
			parentSpan = tracer.StartSpan(c.Request.URL.Path)
			defer parentSpan.Finish()
		} else {
			parentSpan = opentracing.StartSpan(
				c.Request.URL.Path,
				opentracing.ChildOf(spanContext),
				opentracing.Tag{Key: string(ext.Component), Value: "HTTP"},
				ext.SpanKindRPCServer,
			)
			defer parentSpan.Finish()
		}

		// 这样不好，会冲突
		// opentracing.SetGlobalTracer(tracer)

		c.Set("Tracer", tracer)
		c.Set("parentSpanContext", parentSpan.Context())

		c.Next()
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run()
}
