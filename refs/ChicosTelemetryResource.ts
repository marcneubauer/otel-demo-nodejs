import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const serviceName = process.env.NODE_ENV
  ? `${process.env.NODE_ENV}-orchestration-service`
  : `any-orchestration-service`;

const serviceVersion = process.env.npm_package_version ?? 0;

const ChicosTelemetryResource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
  })
);

export { ChicosTelemetryResource, SemanticResourceAttributes };
