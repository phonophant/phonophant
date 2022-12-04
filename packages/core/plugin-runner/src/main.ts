import * as bodyParser from 'body-parser';
import * as express from "express";
import PluginManager from './utils/plugins/plugin-manager';
import TriggerActionManager from './utils/plugins/trigger-action-manager';

async function bootstrap() {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const pluginManager = new PluginManager();
  const triggerActionManager = new TriggerActionManager(pluginManager, app);
  await pluginManager.loadPluginList();
  await pluginManager.initLoadedPlugins(app, triggerActionManager.triggerAction.bind(triggerActionManager));

  await app.listen(3000);
}

bootstrap();
