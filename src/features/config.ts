import 'dotenv/config'

const featuresConfigByEnv: FeaturesConfigByEnv = {
    production: {
        caching: {
            enabled: true,
            provider: {
                redis: {
                    config: {
                        host: process.env.REDIS_HOST || '192.168.99.100',
                        password: 'redis'
                    }
                }
            }
        }
    },
    test: {
        caching: {
            enabled: false
        }
    },
    development: {
        caching: {
            enabled: true,
            provider: {
                redis: {
                    config: {
                        host: process.env.REDIS_HOST || '192.168.99.100',
                        password: 'redis'
                    }
                }
            }
        }
    }
}

export type CachingConfig = {
    enabled: boolean,
    provider?: {
        redis: {
            config: object
        }
    }
}

export type FeaturesConfig = {
    caching: CachingConfig,
}

type FeaturesConfigByEnv = {
    [key: string]: FeaturesConfig
}

export default featuresConfigByEnv[process.env.NODE_ENV || 'production'];