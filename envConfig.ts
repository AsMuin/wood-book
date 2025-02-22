const cloudConfig = {
    endpoint: process.env.CF_R2_ENDPOINT_URL,
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY,
    Bucket: process.env.CF_R2_BUCKET,
    BucketFolder: process.env.CF_R2_BUCKET_FOLDER,
    ReturnHost: process.env.CF_R2_RETURN_HOST
};

const dataBaseConfig = {
    url: process.env.NODE_ENV === 'development' ? process.env.DATABASE_NENO_DEV_URL : process.env.DATABASE_NENO_URL
};

const nextProdUrl = process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || 'http://localhost:3000';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_PROD_API_ENDPOINT;

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

const resendConfig = {
    token: process.env.RESEND_TOKEN
};

export { cloudConfig, dataBaseConfig, upstashConfig, resendConfig, nextProdUrl, baseUrl };
