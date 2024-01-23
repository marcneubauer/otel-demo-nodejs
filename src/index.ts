import {
  pinoLoggingLib,
  getLogger,
} from './instrumentation';

console.log('**Starting pino-opentelemetry-transport example**');

export default async function main() {
  // TODO update to await opentelemetry.init() and this does logging tracing etc all async
  const log = await getLogger();

  doThings();

  function doThings() {
    setInterval(() => {
      logStuff();
    }, 700);
  }

  function logStuff() {
    // pinoLoggingLib.error(OpenTelemetryResource.attributes);
    // pinoLoggingLib.info({ 'test log': generateRandomString(10) });
    log.trace('testing - trace log'); //TODO for some reason Trace logs dont show
    log.debug('testing - debug log');
    log.info('testing - info log');
    log.warn('testing - warn log');
    log.error('testing - error log');
    log.fatal('testing - fatal log');
  }

}
void main();
