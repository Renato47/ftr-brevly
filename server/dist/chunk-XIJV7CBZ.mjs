import {
  env
} from "./chunk-ZICOLQTR.mjs";

// src/storage/client.ts
import { S3Client } from "@aws-sdk/client-s3";
var r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY
  }
});

export {
  r2
};
