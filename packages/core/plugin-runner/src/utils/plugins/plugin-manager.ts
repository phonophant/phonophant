import { PluginListLoader } from './plugin-list-loader';
import { PluginType, PluginDefinition, BasePluginManager } from '@phonophant/shared-models';
import { Application } from 'express';

type triggerData = (triggerPluginName: string, triggerValue: string) => void;


export default class PluginManager extends BasePluginManager {
  private plugins: Map<string, PluginDefinition> = new Map();
  private pluginListLoader: PluginListLoader = new PluginListLoader();

  public getPluginByName(pluginName: string) {
    return this.plugins.get(pluginName) || null;
  }

  public async loadPluginList() {
    const loadedPlugins = await this.pluginListLoader.loadPluginDefinitions();
    loadedPlugins.forEach(async pluginDefinition => {
      this.plugins.set(pluginDefinition.name, pluginDefinition);
    });
  }

  public async initLoadedPlugins(express: Application, triggerCallback: triggerData) {
    for (const value of this.plugins.values()) {
      await this.initLoadedPlugin(value, express, triggerCallback);
    }
  }

  public async initLoadedPlugin(pluginDefinition: PluginDefinition, express: Application, triggerCallback: triggerData) {   
    switch(pluginDefinition.instance.pluginType) {
      case PluginType.Trigger:
        pluginDefinition.instance.init({ version: '1.0.0', express, pluginManager: this }, {triggerCallback});
        break;
      default:
        pluginDefinition.instance.init({ version: '1.0.0', express, pluginManager: this }, {});
    }
  }
}
