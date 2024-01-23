
### OTel Demo for Node
##### logs, traces, metrics to otelcol and on to backends

- Node 20
    - .env file support!
    - tsx + --watch
    - no nodemon!, no ts-node!, no dotenv!


`node --env-file=dev.env --import=tsx --watch ./src/index.ts`


```env 
OTEL_EXPORTER_OTLP_LOGS_PROTOCOL="grpc"
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT="http://localhost:4317"
OTEL_RESOURCE_ATTRIBUTES="service.name=my-service,service.version=1.2.3"
```

source for the tsx stuff: https://dev.to/_staticvoid/how-to-run-typescript-natively-in-nodejs-with-tsx-3a0c


Otelcol's own metrics: http://localhost:8888/metrics
zipkin ui: http://localhost:9411/zipkin/
prometheus ui: http://0.0.0.0:9090/graph



Trying out grafana Loki Promtail
https://raw.githubusercontent.com/grafana/loki/v2.9.1/production/docker-compose.yaml
