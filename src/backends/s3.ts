import { IBackend } from "./backend";

export class S3 implements IBackend {
  readonly backendBucket: string;
  readonly backendBucketRegion: string;

  constructor() {
    if (!process.env.TF_S3_BACKEND_BUCKET) {
      throw new Error("TF_S3_BACKEND_BUCKET environment variable must be set.")
    }

    if (!process.env.TF_S3_BACKEND_BUCKET_REGION) {
      throw new Error("TF_S3_BACKEND_BUCKET_REGION environment variable must be set.")
    }
    
    this.backendBucket = process.env.TF_S3_BACKEND_BUCKET;
    this.backendBucketRegion = process.env.TF_S3_BACKEND_BUCKET_REGION;
  }

  generateConfigBlock(stateFileKey: string): any {
    return {
      s3: {
        bucket: this.backendBucket,
        region: this.backendBucketRegion,
        key: stateFileKey,
      }
    }
  }
}