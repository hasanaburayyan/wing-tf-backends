import { IBackend } from "./backend";

export class GCS implements IBackend {
  readonly backendBucket: string;

  constructor() {
    if (!process.env.TF_GCS_BACKEND_BUCKET) {
      throw new Error("TF_GCS_BACKEND_BUCKET environment variable must be set.")
    }

    if (!process.env.TF_GCS_BACKEND_PREFIX) {
      throw new Error("TF_GCS_BACKEND_PREFIX environment variable must be set.")
    }
    
    this.backendBucket = process.env.TF_GCS_BACKEND_BUCKET;
  }

  generateConfigBlock(stateFileKey: string): any {
    return {
      gcs: {
        bucket: this.backendBucket,
        key: stateFileKey,
      }
    }
  }
}