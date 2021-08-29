
import redis, { RedisClient } from 'redis'
import { promisify } from 'util'
import { getLogger, Logger } from '../../logger'

export default (config: any) => {

    config = {
        ...config,
        retry_strategy: function (options: any) {

            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                // return new Error('Connection refused by the server')
                logger.error('redis server refused the connection')
            }

            // if (options.total_retry_time > 1000 * 60 * 60) {
            //     // End reconnecting after a specific timeout and flush all commands
            //     // with a individual error
            //     return new Error('Retry time exhausted')
            // }

            if (options.attempt > 10) {
                // End reconnecting with built in error
                return new Error(`reached max retry attempts`)
            }

            // reconnect after
            const time = Math.pow(2, options.attempt)
            logger.info(`attempting redis reconnect in %ds`, time)
            return time * 1000
        }
    }

    const logger: Logger = getLogger('RedisAgent')
    const redisClient: RedisClient = redis.createClient(config)
    let defaultEntryExpiration: number = 3600
    let connected: boolean = false

    redisClient.on('error', function (error) {
        connected = false
        logger.error('redis connector error', error)
    })

    redisClient.on('end', function () {
        connected = false
        logger.warn(`redis connection closed`)
    })

    redisClient.on('connect', function () {
        connected = true
        logger.info(`established connection with redis`)
    })

    const initialConnection: Promise<boolean> =
        new Promise(function (resolve, reject) {

            redisClient.on('connect', function () {
                connected = true
                return resolve(true)
            })
        })

    const _set = promisify(redisClient.setex).bind(redisClient)
    const _get = promisify(redisClient.get).bind(redisClient)

    return {
        isConnected: () => { return connected },
        waitConnection: async () => {
            await initialConnection
            logger.debug(`redis agent is %s connected`, connected ? '' : 'not ')
            return connected
        },
        get: async (key: string) => _get(key),
        set: async (key: string, value: string): Promise<string> =>
            _set(key, defaultEntryExpiration, value),
        clear: async () => {
            redisClient.flushall((err, succeeded) => {
                logger.info(`redis cache clear %ssuccessfully`, succeeded ? '' : 'not ')
            })
        }
    }

}
