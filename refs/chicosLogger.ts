import pino from 'pino';
import { ExpressContext } from 'apollo-server-express';
import { BaseContext } from 'apollo-server-plugin-base';
import {
  ChicosTelemetryResource,
  SemanticResourceAttributes,
} from './ChicosTelemetryResource';

export type Logger = pino.Logger;
export type LoggerOptions = pino.LoggerOptions;
export type LogFn = pino.LogFn;
export type DestinationStream = pino.DestinationStream;

export interface RequestLogger extends Logger {
  startTime?: number;
}

export const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

/* CloudRun specific */
const GCPSeverityLookup: Record<string, string> = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

export const localNodeEnvs = ['development', 'test', 'local-dev'];

// Log and then spawn a child logger for requests coming into Express->Apollo
export function logExpressRequest(req: ExpressContext['req']): void {
  const { headers, baseUrl, body } = req;
  const { host, remoteAddress } = headers;
  const traceparent = headers.traceparent;
  const userAgent = headers['user-agent'];
  const sessionTraceId = headers['session-trace-id'] ?? '-';
  const query = body.query;

  logger.info(`Incoming Request:`, {
    host,
    baseUrl,
    userAgent,
    remoteAddress,
    traceparent,
    sessionTraceId,
  });
  logger.debug(`Incoming Request Details:`, { Query: query, Headers: headers });
}

export function getElapsedTime(startTime: number = Date.now()): string {
  return `${Date.now() - startTime}`;
}

const formatters = {
  level(label: string, number: number) {
    const LABEL = label.toUpperCase();
    // Sets level as {"severity":"WARNING", "level":40, "LEVEL":"WARN", "SeverityNumber":40, "SeverityText": "WARN" } for GCP AND JSON
    return {
      severity: GCPSeverityLookup[label] || GCPSeverityLookup.info, // google cloud logging
      level: number, // <- gcp
      LEVEL: LABEL, // <- chicos
      SeverityNumber: number, // otel
      SeverityText: LABEL, // otel
    };
  },
};

/* Swaps the first two arguments of logging method calls from pino default e.g.
pino.info(object, "message") becomes logger.info("message", object) */
export function logMethod(
  this: any,
  inputArgs: [msg: string, ...args: any[]],
  method: LogFn
): void {
  if (inputArgs.length >= 2) {
    const arg1 = inputArgs.shift() as string | object;
    const arg2 = inputArgs.shift() as string;
    return method.apply(this, [arg2, arg1, ...inputArgs]);
  }
  return method.apply(this, inputArgs);
}

/* This customizes the logging level that Pino outputs. The default is error.
 The LOG_LEVEL environment variable can be set to change the level.
  The NODE_ENV environment variable can be set to development, test,
   or local-dev to change the level to debug. */
export function setLevel(): string {
  // everything else defaults to error
  let level = 'error';
  if (
    // local dev defaults to debug
    process.env.NODE_ENV &&
    process.env.NODE_ENV.length > 0 &&
    localNodeEnvs.includes(process.env.NODE_ENV)
  ) {
    level = 'debug';
  }
  // to override default log levels, set LOG_LEVEL env var
  if (
    process.env.LOG_LEVEL &&
    process.env.LOG_LEVEL.length > 0 &&
    Object.keys(levels).includes(process.env.LOG_LEVEL)
  ) {
    level = process.env.LOG_LEVEL;
  }
  return level;
}

/* getStream returns the default destination stream for the logger */
export function getStream(): DestinationStream {
  // NodeJS has a stdout stream
  return process.stdout;
}

/* Gathers options for instantiating a logger */
export function getOptions(): LoggerOptions {
  return {
    timestamp: () =>
      `,"timestamp":"${new Date(Date.now()).toISOString().replace('T', ' ')}"`, // this is going to hurt perf
    // timestamp: stdTimeFunctions.isoTime, // 2023-07-25T21:12:09.740Z this is going to hurt perf too, but less?
    customLevels: levels,
    useOnlyCustomLevels: true,
    level: setLevel(),
    messageKey: 'MESSAGE',
    errorKey: 'ERROR',
    formatters,
    hooks: {
      logMethod,
    },
  };
}

// bootstrap logging library
function initLogger(): Logger {
  return pino(getOptions(), getStream());
}

// instantiate
const CHSFASLogger = initLogger();

export const logger = CHSFASLogger.child({
  PROFILE: process.env.NODE_ENV,
  APP: ChicosTelemetryResource.attributes[
    SemanticResourceAttributes.SERVICE_NAME
  ],
  'service.name':
    ChicosTelemetryResource.attributes[SemanticResourceAttributes.SERVICE_NAME],
  'service.version':
    ChicosTelemetryResource.attributes[
      SemanticResourceAttributes.SERVICE_VERSION
    ],
});

// spawn child logger **for request** to put into gql context
export function getRequestLogger(_context: BaseContext): RequestLogger {
  const requestLogger: RequestLogger = logger.child({
    gql_context: _context ?? {},
  });
  requestLogger.startTime = Date.now(); // do I still need this?
  return requestLogger;
}
