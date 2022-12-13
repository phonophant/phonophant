import { Plugin } from './plugin-definition.model';

export abstract class BasePluginManager {
  abstract getPluginByName(pluginName: string): Plugin | null;
  abstract getAllPlugins(): Plugin[];
}
