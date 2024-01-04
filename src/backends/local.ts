import { IBackend } from "./backend";

export class Local implements IBackend {
  readonly backendFilePath: string;

  constructor() {
    if (!process.env.TF_LOCAL_BACKEND_FILE_PATH) {
      throw new Error("TF_LOCAL_BACKEND_FILE_PATH environment variable must be set.")
    }
    
    this.backendFilePath = process.env.TF_LOCAL_BACKEND_FILE_PATH;
  }
  
  generateConfigBlock(stateFileKey: string): any {
    return {
      local: {
        path: `${this.backendFilePath}/${stateFileKey}`,
      }
    }
  }
}