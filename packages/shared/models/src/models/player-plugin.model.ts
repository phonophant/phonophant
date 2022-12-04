import { AppData } from './appData.model';
import { BasePlugin } from './base-plugin.model';
import { PluginType } from './plugin-type.enum';

export abstract class PlayerPlugin<ConfigModel, PlayModel = string> extends BasePlugin<ConfigModel> {
  constructor() {
    super(PluginType.Player);
  }

  abstract init(applicationData: AppData, configuration: ConfigModel): void;

  abstract play(soundIdentifier: PlayModel): void;
  abstract pause(): void;
  abstract stop(): void;
  
  abstract seek(seconds: number): void;
  abstract getTimeInSec(): Promise<number>;
  abstract getLengthInSec(): Promise<number>;
  abstract getVolume(): Promise<number>;
  abstract volumeUp(volStep: number): void;
  abstract volumeDown(volStep: number): void;
  abstract setVolume(volValue: number): void;
}
