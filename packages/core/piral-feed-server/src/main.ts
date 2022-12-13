import express, { Application } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { BasePluginManager, Plugin } from '@phonophant/shared-models';

export default class PiralFeedService {
  exposedPilets: string[] = [];

  constructor(
    private express: Application,
    private pluginManager: BasePluginManager
  ) {
    this.express.get('/pilet-feed-service', (req, res) => {
      res.send(this.createPiletFeed());
    });
  }

  private isAlreadyExposed(plugin: Plugin) {
    return this.exposedPilets.includes(plugin.name);
  }

  private pluginNameToPiletUrl(plugin: Plugin) {
    return plugin.name.replace('@', '').replace('/', '-').toLowerCase();
  }

  private exposePilets(plugins: Plugin[]) {
    plugins.forEach((plugin) => {
      if(!this.isAlreadyExposed(plugin) && plugin.active) {
        const endpointName = this.pluginNameToPiletUrl(plugin);
        if (plugin.piletLocation) {
          this.express.use(`/${endpointName}`, express.static(plugin.piletLocation));
          this.exposedPilets.push(plugin.name);
        }
      }
    });
  }

  private getRequireRef(entryFilePath: string): string {
    const entryFile = fs.readFileSync(entryFilePath).toString();
    const checkRequireRef = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
    const [, requireRef] = checkRequireRef.exec(entryFile) as RegExpExecArray;
    return requireRef;
  }

  private mapPluginsToPiletItem(plugins: Plugin[]) {
    const entryFile = 'index.js';
    return plugins
      .map(plugin => ({
        author: { name: "", email: "" },
        dependencies: {},
        description: plugin.description || "",
        link: `http://localhost:3000/${this.pluginNameToPiletUrl(plugin)}/${entryFile}`,
        name: plugin.name,
        requireRef: plugin.piletLocation ? this.getRequireRef(path.join(plugin.piletLocation, entryFile)) : '',
        spec: "v2",
        version: plugin.version || "1.0.0",
      }));
  }

  private createPiletFeed() {
    const allPlugins = this.pluginManager.getAllPlugins();
    const pluginsWithPilets = allPlugins.filter(plugin => plugin.piletLocation);
    this.exposePilets(pluginsWithPilets);

    return {
      feed: "phonophant-plugin-feed",
      items: this.mapPluginsToPiletItem(pluginsWithPilets),
    };
  }
}