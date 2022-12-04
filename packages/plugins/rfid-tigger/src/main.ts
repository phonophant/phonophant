import { AppData, BasePlugin, PluginType } from '@phonophant/shared-models';

export default class RfidTrigger extends BasePlugin<any> {
  constructor() {
    super(PluginType.Trigger);
  }

  init(appData: AppData, configuration: any) {
    const { triggerCallback } = configuration;
    const stdin = process.openStdin();

    stdin.addListener("data", function(d) {
      const message = d.toString().trim();
      triggerCallback('RfidTrigger', message);
    });
  }
}