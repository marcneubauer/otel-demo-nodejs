import pino, { Logger } from 'pino';
import { OpenTelemetryResource } from './';
import { once } from 'events'  // TODO revisit for isomorphism

// These are all about transport configs
// TODO these two transports need to be able to be conditionally added to the array of transports based on conditions in the environment or other things like request so that we can spread them into the targets later.
const activeTransportConfigs = [];
// Create a transport for logging to the console
// https://github.com/pinojs/pino/blob/master/docs/transports.md#pinofile
// tldr : transports are on worker thread, destination is on main thread
// https://github.com/pinojs/pino/issues/1514
const consoleTransport = {
  level: 'debug',
  target: 'pino/file',
  options: {
    //   destination: '1',
    loggerName: process.env.npm_package_name + 'pino-file-to-console-transport',
    serviceVersion: OpenTelemetryResource.attributes['service.version'] || '0',
    resourceAttributes: OpenTelemetryResource.attributes,
  },
};
// Create a transport for logging to the opentelemetry collector
// https://github.com/pinojs/pino/blob/master/docs/transports.md#pino-opentelemetry-transport
const otelTransport = {
  level: 'trace',
  target: 'pino-opentelemetry-transport',
  options: {
    loggerName:
      process.env.npm_package_name + 'pino-opentelemetry-transport-example',
    serviceVersion: OpenTelemetryResource.attributes['service.version'] || '0',
    resourceAttributes: OpenTelemetryResource.attributes,
  },
};
activeTransportConfigs.push(consoleTransport);
activeTransportConfigs.push(otelTransport);
// Create transports for each of the destination stream to which we want to emit logs.
const pinoTransports = pino.transport({
  targets: [...activeTransportConfigs],
});



function getLevel() {
  // to override default log levels, set OTEL_LOG_LEVEL env var
  if (
    process.env.OTEL_LOG_LEVEL &&
    process.env.OTEL_LOG_LEVEL.length > 0 &&
    Object.keys(pino.levels.values).includes(process.env.OTEL_LOG_LEVEL)
  ) {
    return process.env.OTEL_LOG_LEVEL;
  }
  return 'info';
}

export const pinoLoggingLib = pino(
  {
    level: getLevel(),
  },
  pinoTransports,
);

 export async function initLogger(): Promise<Logger> {
   // TODO try/catch
  await once(pinoTransports, 'ready');
  return pino(
    {
      level: getLevel(),
    },
    pinoTransports,
  );
}

const logger =  initLogger();


export async function getLogger():Promise<Logger> {
  return pinoLoggingLib;
}


