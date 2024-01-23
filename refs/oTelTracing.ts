// Core OpenTelemetry Packages
import { trace as traceAPI } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  NodeTracerProvider,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { InstrumentationOption } from '@opentelemetry/instrumentation';
import {
  ChicosTelemetryResource,
  SemanticResourceAttributes,
} from './ChicosTelemetryResource';

// Individual Instrumentation Libraries
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { FetchInstrumentation } from 'opentelemetry-instrumentation-fetch-node';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { DataloaderInstrumentation } from '@opentelemetry/instrumentation-dataloader';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';

// Exporters
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const zipkinOtlpUrl =
  process.env.ZIPKIN_OTLP_URL ?? 'http://127.0.0.1:9411/api/v2/spans';
const newrelicApiKey = process.env.NEWRELIC_API_KEY ?? null;
const newrelicOtlpUrl =
  process.env.NEWRELIC_OTLP_URL ?? 'https://otlp.nr-data.net:4318/v1/traces';
const traceDestination = process.env.TRACE_DESTINATION ?? 'zipkin';
const traceExporters: Array<{ exporterName: string; processor: any }> = [];
const traceProvider = new NodeTracerProvider({
  resource: ChicosTelemetryResource,
});
const oTelStartupTime = Date.now();

const instrumentations: InstrumentationOption = [
  new HttpInstrumentation({
    headersToSpanAttributes: {
      server: {
        requestHeaders: ['session-trace-id'],
        responseHeaders: ['session-trace-id'],
      },
    },
  }),

  new FetchInstrumentation({}),

  new ExpressInstrumentation(),

  new GraphQLInstrumentation({
    allowValues: true,
    depth: 2,
    mergeItems: true,
    ignoreTrivialResolveSpans: true,
  }),

  new DataloaderInstrumentation(),

  new PinoInstrumentation({
    // Insert additional context to log object when it is called **within a trace context!**
    logHook: (span: any, record, level) => {
      record.LOGGER = span.name ?? '-'; // maybe replace with pino-caller for more accuracy, but it is slow
      record.TRACE_ID = record.trace_id;
      record.SPAN_ID = record.span_id;
      record.session_trace_id =
        span.attributes['http.request.header.session_trace_id'][0] ?? '-';
    },
  }),
];

// Zipkin Span Processor/Exporter
if (
  process.env.NODE_ENV === 'local-dev' ||
  traceDestination.includes('zipkin')
) {
  const zipkinExporter = new ZipkinExporter({
    url: zipkinOtlpUrl,
    serviceName: `${
      ChicosTelemetryResource.attributes[
        SemanticResourceAttributes.SERVICE_NAME
      ]
    }`,
  });
  const zipkinProcessor = new BatchSpanProcessor(zipkinExporter);
  traceExporters.push({ exporterName: 'zipkin', processor: zipkinProcessor });
}

// NewRelic Span Processor/Exporter
if (traceDestination.includes('newrelic') && newrelicApiKey) {
  const newrelicExporter = new OTLPTraceExporter({
    url: newrelicOtlpUrl,
    headers: {
      'api-key': newrelicApiKey,
    },
  });
  const newrelicProcessor = new BatchSpanProcessor(newrelicExporter);
  traceExporters.push({
    exporterName: 'newrelic',
    processor: newrelicProcessor,
  });
}

// Add Exporter/Processors to the Tracer
if (traceExporters.length) {
  for (const traceExporter of traceExporters) {
    traceProvider.addSpanProcessor(traceExporter.processor);
  }
} else {
  console.warn(
    'No OpenTelemetry trace exporters are configured, trace data is not being sent.'
  );
}

// Register Trace Provider
traceProvider.register();

// Ensure we are using multiple span processors, if they are configured
traceAPI.setGlobalTracerProvider(traceProvider);

export const sdk = new NodeSDK({
  resource: ChicosTelemetryResource,
  instrumentations: [instrumentations],
});

sdk.start();

// Logger needs to be loaded after instrumentation is initialized
// eslint-disable-next-line import/first
import { logger } from './chicosLogger';

logger.debug('testing - debug log');
logger.info('testing - info log');
logger.warn('testing - warn log');
logger.error('testing - error log');
logger.fatal('testing - fatal log');
logger.debug('environment', process.env);
logger.info('Registered OpenTelemetry Instrumentations', {
  ChicosTelemetryResource: ChicosTelemetryResource.attributes,
  instrumentations: instrumentations.map((i) => i.instrumentationName),
  exporters: traceExporters.map((i) => i.exporterName),
  elapsed: Date.now() - oTelStartupTime,
});
