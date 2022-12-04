export abstract class BaseTriggerActionManager {
  abstract triggerAction(triggerPluginName: string, triggerValue: string): void;
  abstract registerTriggerToActionRelation<ActionPluginConfig = any>(triggerPluginName: string, triggerValue: string, actionPluginName: string, actionPluginConfig: ActionPluginConfig): void;
}
