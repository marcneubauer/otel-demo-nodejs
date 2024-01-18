import pino from 'pino';

const transport = pino.transport({
  target: 'pino-opentelemetry-transport'
})

const logger = pino(transport)

transport.on('ready', () => {
  setInterval(() => {
    logger.info({'test log':""})
  }, 1000)
})

function generateRandomString(length) {
  return [...Array(length)]
      .map(() => Math.random().toString(36)[2])
      .join('');
}