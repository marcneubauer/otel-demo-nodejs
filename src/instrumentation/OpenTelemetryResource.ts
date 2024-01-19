import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const serviceName = process.env.NODE_ENV
  ? `${process.env.NODE_ENV}-otel-demo-nodejs`
  : `any-otel-demo-nodejs`;

const serviceVersion = process.env.npm_package_version ?? 0;

const OpenTelemetryResource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
  })
);

export { OpenTelemetryResource, SemanticResourceAttributes };
