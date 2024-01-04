export interface IBackend {
  generateConfigBlock(stateFileKey: string): void;
}