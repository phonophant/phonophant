import { AppData } from './appData.model';
import { PluginType } from './plugin-type.enum';

export abstract class BasePlugin<ConfigModel> {
  constructor(public readonly pluginType: PluginType) {}

  abstract init(applicationData: AppData, configuration: ConfigModel): void;
}
