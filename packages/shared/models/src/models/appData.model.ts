import { Application } from 'express';
import { BasePluginManager } from './base-plugin-manager.model';

export interface AppData {
  version: string;
  express: Application;
  pluginManager: BasePluginManager;
}