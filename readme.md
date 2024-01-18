
### OTel Demo for Node
##### logs, traces, metrics to otelcol and on to backends

- Node 20
    - .env file support!
    - tsx + --watch
    - no nodemon!, no ts-node!, no dotenv!

```env 
OTEL_EXPORTER_OTLP_LOGS_PROTOCOL="grpc"
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT="http://localhost:4317"
OTEL_RESOURCE_ATTRIBUTES="service.name=my-service,service.version=1.2.3"
```


https://dev.to/_staticvoid/how-to-run-typescript-natively-in-nodejs-with-tsx-3a0c
