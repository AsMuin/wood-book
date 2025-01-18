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
    redisUrl: process.env.UPSTASH_REDIS_REST_URL,
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN
};

export { cloudConfig, dataBaseConfig, upstashConfig };
