import { BasePlugin } from './base-plugin.model';

export enum PluginDefinitionSource {
  Local = 'Local',
  Npm = 'Npm',
}

interface BasePluginDefinition {
  name: string;
  source: PluginDefinitionSource;
  active?: boolean;
  options?: any;
  instance?: BasePlugin<any>;
}

export interface NpmPluginDefinition extends BasePluginDefinition {
  packageName: string;
  version: string;
}

export interface LocalPluginDefinition extends BasePluginDefinition {
  entryFile?: string;
  isRelative?: boolean;
}

export type PluginDefinition = NpmPluginDefinition | LocalPluginDefinition;
