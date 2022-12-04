import { PluginDefinition } from './plugin-definition.model';

export abstract class BasePluginManager {
  abstract getPluginByName(pluginName: string): PluginDefinition | null;
}
