package main

import (
	"log"

	"github.com/opentracing/opentracing-go"
	opentracingLog "github.com/opentracing/opentracing-go/log"
	"github.com/uber/jaeger-client-go"
	jaegerConfig "github.com/uber/jaeger-client-go/config"
	jaegerLog "github.com/uber/jaeger-client-go/log"
)

func main() {
	cfg := jaegerConfig.Configuration{
		ServiceName: "主动上报",
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

	opentracing.SetGlobalTracer(tracer)
	defer closer.Close()
	if err != nil {
		log.Fatal(err)
	}

	parentSpan := opentracing.GlobalTracer().StartSpan("parentSpan")
	defer parentSpan.Finish()
	parentSpan.LogFields(
		opentracingLog.String("hello", "world"),
	)

	childSpan := opentracing.GlobalTracer().StartSpan("childSpan", opentracing.ChildOf(parentSpan.Context()))
	defer childSpan.Finish()

}
