import { pinoLoggingLib, getLogger } from './instrumentation';

console.log('**Starting pino-opentelemetry-transport example**');

export default async function main() {
  // TODO update to await opentelemetry.init() and this does logging tracing etc all async
  const log = await getLogger();
  let counter = 0;
  doThings();

  function doThings() {
    setInterval(() => {
      logStuff();
    }, 700);
  }

  function generateRandomString() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  function logStuff() {
    // pinoLoggingLib.error(OpenTelemetryResource.attributes);
    // pinoLoggingLib.info({ 'test log': generateRandomString(10) });
    log.trace(`${counter} - trace log`); //TODO for some reason Trace logs dont show
    log.debug(`${counter} - debug log`);
    log.info(`${counter} - info log`);
    log.warn(`${counter} - warn log`);
    log.error(`${counter} - error log`);
    log.fatal(`${counter} - fatal log`);

    let thingToLog = { round: counter, randomString: generateRandomString() };

    log.info(thingToLog, `${counter} - LoggerInfo`);

    console.info(`${counter} - LoggerInfo`, thingToLog);

    counter++;
  }
}
void main();
