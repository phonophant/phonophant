import * as fs from 'fs';
import { ActionPlugin, BasePluginManager, BaseTriggerActionManager } from '@phonophant/shared-models';
import { Application } from 'express';

interface TargetActionPluginDetails {
  id: string;
  actionPluginName: string;
  actionPluginConfig: any;
}

export default class TriggerActionManager extends BaseTriggerActionManager {
  private BASE_URL = 'trigger-action-manager';
  private FILENAME = 'triggerActionRelations.json';
  public plugins: Map<string, TargetActionPluginDetails[]> = new Map();

  constructor(
    private pluginManager: BasePluginManager,
    private express: Application,
  ) {
    super();
    try {
      const triggerActionRelationString = fs.readFileSync(this.FILENAME).toString();
      const triggerActionRelation = JSON.parse(triggerActionRelationString) as { key: [TargetActionPluginDetails]};
      Object.entries(triggerActionRelation).forEach(([key, relation]) => {
        this.plugins.set(key, relation);
      });
    } catch (e) {
      console.log(`Trigger registration file not found. Will create one when a trigger gets created.`);
    }

    this.express.post(`/${this.BASE_URL}/relationship`, (request, response) => {
      const { triggerPluginName, triggerValue, actionPluginName, actionPluginConfig } = request.body;
      this.registerTriggerToActionRelation(triggerPluginName, triggerValue, actionPluginName, actionPluginConfig);
      response.end('Relationship added.');
    });

    this.express.get(`/${this.BASE_URL}/relationship`, (request, response) => {
      const pluginsWithoutInstance = {};
      Object.entries(Object.fromEntries(this.plugins)).forEach(([key, value]) => {
        pluginsWithoutInstance[key] = value;
      })
      response.end(JSON.stringify(pluginsWithoutInstance));
    });
  }

  private createMapKey(triggerPluginName: string, triggerValue: string) {
    return `${triggerPluginName}-${triggerValue}`;
  }

  triggerAction(triggerPluginName: string, triggerValue: string) {
    const foundRelationships = this.plugins.get(this.createMapKey(triggerPluginName, triggerValue));
    if (!foundRelationships) {
      return;
    }

    foundRelationships.forEach(relationship => {
      const foundActionPlugin = this.pluginManager.getPluginByName(relationship.actionPluginName);
      if (foundActionPlugin) {
        (foundActionPlugin.instance as ActionPlugin<any, any>).execute(relationship.actionPluginConfig);
      }
    });
  }
  
  registerTriggerToActionRelation(triggerPluginName: string, triggerValue: string, actionPluginName: string, actionPluginConfig: any) {
    this.plugins.set(
      this.createMapKey(triggerPluginName, triggerValue), [
        {
          id: `${this.createMapKey(triggerPluginName, triggerValue)}-${actionPluginName}`,
          actionPluginName,
          actionPluginConfig,
        }
      ]
    );
    const pluginsJSON = Object.fromEntries(this.plugins);
    fs.writeFileSync(this.FILENAME, JSON.stringify(pluginsJSON));
  }
}
