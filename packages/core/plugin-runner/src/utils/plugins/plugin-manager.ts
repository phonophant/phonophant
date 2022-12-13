import { PluginListLoader } from './plugin-list-loader';
import { PluginType, Plugin, BasePluginManager, LocalPlugin, PluginDefinition, NpmPlugin, PluginDefinitionSource, LocalPluginDefinition, NpmPluginDefinition } from '@phonophant/shared-models';
import { Application } from 'express';

type triggerData = (triggerPluginName: string, triggerValue: string) => void;

export default class PluginManager extends BasePluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private pluginListLoader: PluginListLoader = new PluginListLoader();

  constructor(
    private app: Application,
  ) {
    super();
    this.initEndpoints();
  }

  private mapLocalPluginToPluginDefinition(plugin: LocalPlugin): LocalPluginDefinition {
    return {
      name: plugin.name,
      version: plugin.version,
      source: plugin.source,
      active: plugin.active,
      options: plugin.options,
      entryFile: plugin.entryFile,
      isRelative: plugin.isRelative,
    }
  }

  private mapNpmPluginToPluginDefinition(plugin: NpmPlugin): NpmPluginDefinition {
    return {
      name: plugin.name,
      version: plugin.version,
      source: plugin.source,
      active: plugin.active,
      options: plugin.options,
      packageName: plugin.packageName,
    }
  }

  private mapPluginToPluginDefinition(plugin: Plugin): PluginDefinition {
    if (plugin.source === PluginDefinitionSource.Npm) {
      return this.mapNpmPluginToPluginDefinition(plugin as NpmPlugin);
    } else if (plugin.source === PluginDefinitionSource.Local) {
      return this.mapLocalPluginToPluginDefinition(plugin as LocalPlugin);
    }
  }

  private updatePluginFile() {
    const pluginDefinitions = this.getAllPlugins().map((plugin) => this.mapPluginToPluginDefinition(plugin));
    this.pluginListLoader.savePlugins(pluginDefinitions);
  }

  private initEndpoints() {
    this.app.get('/plugins/installed', (req, res) => {
      res.send({
        plugins: this.getAllPlugins()
      });
    });

    this.app.get('/plugins/available', async (req, res) => {
      const availablePluginListPlain = await fetch('https://dogs.com/api/breeds/list/all');
      const availablePluginList = await availablePluginListPlain.json();
      res.send({
        plugins: availablePluginList,
      });
    });
    
    this.app.patch('/plugin', (req, res) => {
      const { name, active } = req.body;

      if (active !== undefined && name) {
        const pluginToPatch = this.plugins.get(name);
        pluginToPatch.active = active;
        this.plugins.set(name, pluginToPatch);
        this.updatePluginFile();
        return res.send(pluginToPatch);
      }
      return res.status(404).send('Nothing to update');
    });

    this.app.delete('/plugin', (req, res) => {
      const { name } = req.body;
      const plugin = this.plugins.get(name);
      if (plugin?.instance?.teardown) {
        plugin.instance?.teardown();
      }
      this.plugins.delete(name);
      this.updatePluginFile();
      return res.send('done');
    });
  }

  public getPluginByName(pluginName: string) {
    return this.plugins.get(pluginName) || null;
  }

  public getAllPlugins(): Plugin[] {
    return Object.values(Object.fromEntries(this.plugins.entries()));
  } 

  public async loadPluginList() {
    const loadedPlugins = await this.pluginListLoader.loadPlugins();
    loadedPlugins.forEach(async plugin => {
      this.plugins.set(plugin.name, plugin);
    });
  }

  public async initLoadedPlugins(triggerCallback: triggerData) {
    for (const value of this.plugins.values()) {
      if (value.active) {
        await this.initLoadedPlugin(value, triggerCallback);
      }
    }
  }

  public async initLoadedPlugin(plugin: Plugin, triggerCallback: triggerData) {   
    if (!plugin.instance) {
      return;
    }

    switch(plugin.instance.pluginType) {
      case PluginType.Trigger:
        plugin.instance.init({ version: '1.0.0', express: this.app, pluginManager: this }, {triggerCallback});
        break;
      default:
        plugin.instance.init({ version: '1.0.0', express: this.app, pluginManager: this }, {});
    }
  }
}
