import { PluginTag } from './plugin-tags.enum';

export interface PackageJson {
  author?: string,
  description?: string,
  version?: string,
  phonoplugin?: {
    piletLocation?: string,
    tags?: PluginTag[],
    settingsEndpoint?: string,
  }
}