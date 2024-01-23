/**
 * process.on will listen for following events:
 * SIGTERM, SIGINT, uncaughtException, unhandledRejection
 * once triggered, handler callback function is invoked
 */
// process
//     .on('SIGTERM', handler)
//     .on('SIGINT', handler)
//     .on('uncaughtException', handler)
//     .on('unhandledRejection', handler);


import { logger } from './chicosLogger';
import { sdk } from './oTelTracing';

const listenedSignals = [
  'SIGBREAK', // Ctrl-Break on Windows
  'SIGHUP', // 1 - terminal closed
  'SIGINT', // 2 - triggered when ctrl + c is pressed
  'SIGTERM', //  triggered when kill event is called ex. kill <pid>
  'SIGUSR2', // Used by Nodemon
] as const;

/**
 * process.on will listen for following events:
 * SIGTERM, SIGINT, uncaughtException, unhandledRejection
 * once triggered, handler callback function is invoked
 */
// process.on('uncaughtException', (handler(err,origin)));
// process
//   .on('SIGTERM', handler(error,origin))
//   .on('SIGINT', handler)
//   .on('uncaughtException', handler)
//   .on('unhandledRejection', handler);
export function handler(): void {
  process.on('uncaughtException', (error, origin) => {
    logger.fatal(`Exiting process: uncaughtException ${origin}`, error);
    process.exit(1);
    // handler(error, origin).then();
    // .catch((err) => {logger.error(`Error while handling error: ${err}`)});
  });

  process.on('unhandledRejection', (error) => {
    logger.fatal(`Exiting process: unhandledRejection`, error);
  });

  listenedSignals.forEach((signal) => process.on(signal, signalHandler));
}

/**
 * Handler will log and exit the application on following events:
 * SIGTERM: triggered when ctrl + c is pressed ,used in development
 * SIGINT:  triggered when kill event is called ex. kill <pid>
 * uncaughtException: triggered when error is thrown and not handled with try..catch block
 * unhandledRejection: triggered when promise is rejected and unhandled
 * Process.exit(1) - task is exited with an error
 *
 // * @param error
 // * @param origin
 */
// function handler(error: any, origin: string): void {
//   logger.fatal(`Exiting: ${origin}`, error);
//   // shutdown otel sdk to allow traces to send
//   // await sdk.shutdown();
//   // .then(process.exit(123));
//
//   // setTimeout(process.exit(1111), 1000);
//
//   process.exit(1);
// }

function signalHandler(signal: NodeJS.Signals): void {
  logger.fatal(`Received ${signal} signal.`);
  // nodemon restart
  if (signal === 'SIGUSR2') {
    sdk.shutdown().finally(() => process.exit(1));
  } else {
    // shutdown otel sdk to allow traces to send
    sdk.shutdown().finally(() => process.kill(process.pid, signal));
  }
}
