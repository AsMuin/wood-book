const cloudConfig = {
    endpoint: process.env.CF_R2_ENDPOINT,
    accessKeyId: process.env.CF_R2_KEY,
    secretAccessKey: process.env.CF_R2_SECRET,
    Bucket: process.env.CF_R2_BUCKET,
    BucketFolder: process.env.CF_R2_BUCKET_FOLDER,
    ReturnHost: process.env.CF_R2_RETURN_HOST
};

const dataBaseConfig = {
    url: process.env.DATABASE_URL
};

const upstashConfig = {
    redis: {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
    },
    qstash: {
        url: process.env.QSTASH_URL,
        token: process.env.QSTASH_TOKEN,
        currentSigningKey: process.env.QSTASH_SIGNING_KEY,
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY0
    }
};

export { cloudConfig, dataBaseConfig, upstashConfig };
