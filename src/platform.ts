import { platform } from "@winglang/sdk";
import { S3 } from "./backends/s3";
import { IBackend } from "./backends/backend";
import { AzureRM } from "./backends/azurerm";
import { GCS } from "./backends/gcs";
import { Local } from "./backends/local";

// TODO: support more backends: https://developer.hashicorp.com/terraform/language/settings/backends/local
const SUPPORTED_TERRAFORM_BACKENDS = [
  "s3",
  "azurerm",
  "gcs",
  "local"
]

/**
 * Terraform Backends Platform
 */
export class Platform implements platform.IPlatform {
  /**
   * Define the platform's compatibility target
   */
  readonly target = "tf-*"; // works with any platform that starts with "tf-"

  readonly backendType: string;
  readonly stateFileKey: string;

  constructor() {
    if (!process.env.TF_BACKEND_TYPE) {
      throw new Error(`TF_BACKEND_TYPE environment variable must be set. Available options: (${SUPPORTED_TERRAFORM_BACKENDS.join(", ")})`)
    }

    if (!process.env.TF_STATE_FILE_KEY) {
      throw new Error("TF_STATE_FILE_KEY environment variable must be set.")
    }

    this.backendType = process.env.TF_BACKEND_TYPE 
    this.stateFileKey = process.env.TF_STATE_FILE_KEY
  }

  /**
   * Implement the post-synthesize hook, which will be called after synthesis
   * and pass in the generated config file. We will alter this config file to contain
   * the proper backend configuration.
   */
  postSynth(config: any) {
    // Alter the config file to contain the proper backend configuration
    config.terraform.backend = this.getBackend().generateConfigBlock(this.stateFileKey);

    return config;
  }

  /**
   * Determine which backend class to initialize based on the backend type
   * 
   * @returns the backend instance based on the backend type
   */
  getBackend(): IBackend {
    switch (this.backendType) {
      case "local": return new Local();
      case "s3": return new S3();
      case "azurerm": return new AzureRM();
      case "gcs": return new GCS();
      default: throw new Error(`Unsupported backend type: ${this.backendType}, available options: (${SUPPORTED_TERRAFORM_BACKENDS.join(", ")})`);
    }
  }
}