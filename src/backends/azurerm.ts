import { IBackend } from "./backend";

export class AzureRM implements IBackend {
  readonly backendStorageAccountName: string;
  readonly backendStorageAccountResourceGroupName: string;
  readonly backendContainerName: string;

  constructor() {
    if (!process.env.TF_AZURERM_BACKEND_STORAGE_ACCOUNT_NAME) {
      throw new Error("TF_AZURERM_BACKEND_STORAGE_ACCOUNT_NAME environment variable must be set.")
    }

    if (!process.env.TF_AZURERM_BACKEND_STORAGE_ACCOUNT_RESOURCE_GROUP_NAME) {
      throw new Error("TF_AZURERM_BACKEND_STORAGE_ACCOUNT_RESOURCE_GROUP_NAME environment variable must be set.")
    }

    if (!process.env.TF_AZURERM_BACKEND_CONTAINER_NAME) {
      throw new Error("TF_AZURERM_BACKEND_CONTAINER_NAME environment variable must be set.")
    }
    
    this.backendStorageAccountName = process.env.TF_AZURERM_BACKEND_STORAGE_ACCOUNT_NAME;
    this.backendStorageAccountResourceGroupName = process.env.TF_AZURERM_BACKEND_STORAGE_ACCOUNT_RESOURCE_GROUP_NAME;
    this.backendContainerName = process.env.TF_AZURERM_BACKEND_CONTAINER_NAME;
  }

  generateConfigBlock(stateFileKey: string): any {
    return {
      azurerm: {
        storage_account_name: this.backendStorageAccountName,
        resource_group_name: this.backendStorageAccountResourceGroupName,
        container_name: this.backendContainerName,
        key: stateFileKey,
      }
    }
  }
}