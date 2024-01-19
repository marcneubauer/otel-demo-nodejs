import pino from 'pino';

console.log('Starting pino-opentelemetry-transport example');

const transport = pino.transport({
  target: 'pino-opentelemetry-transport'
})

const logger = pino(transport)

transport.on('ready', () => {
  setInterval(() => {
    logger.info({'test log':generateRandomString(10)})
  }, 500)
})

function generateRandomString(length) {
  return [...Array(length)]
      .map(() => Math.random().toString(36)[2])
      .join('');
}