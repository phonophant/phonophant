import { BasePlugin } from './base-plugin.model';
import { PluginTag } from './plugin-tags.enum';

export enum PluginDefinitionSource {
  Local = 'Local',
  Npm = 'Npm',
}

interface BasePluginDefinition {
  name: string;
  version?: string;
  source: PluginDefinitionSource;
  active?: boolean;
  options?: any;
}

export interface NpmPluginDefinition extends BasePluginDefinition {
  packageName: string;
}

export interface LocalPluginDefinition extends BasePluginDefinition {
  entryFile?: string;
  isRelative?: boolean;
}

export interface RuntimePluginData {
  instance?: BasePlugin<any>;
  piletLocation?: string;
  description?: string;
  tags?: PluginTag[];
  settingsEndpoint?: string;
  author?: string;
}

export type PluginDefinition = NpmPluginDefinition | LocalPluginDefinition;
export type NpmPlugin = NpmPluginDefinition & RuntimePluginData;
export type LocalPlugin = LocalPluginDefinition & RuntimePluginData;
export type Plugin = NpmPlugin | LocalPlugin;
