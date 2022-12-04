import { AppData } from './appData.model';
import { BasePlugin } from './base-plugin.model';
import { PluginType } from './plugin-type.enum';

export abstract class ActionPlugin<ConfigModel, TriggerDataModel> extends BasePlugin<ConfigModel> {
  constructor() {
    super(PluginType.Action);
  }

  abstract init(applicationData: AppData, configuration: ConfigModel): void;
  abstract execute(triggerData: TriggerDataModel): void;
}
