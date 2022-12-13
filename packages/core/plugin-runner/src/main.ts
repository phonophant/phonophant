import * as bodyParser from 'body-parser';
import * as express from "express";
import * as cors from 'cors';
import PluginManager from './utils/plugins/plugin-manager';
import PiralFeedService from '@phonophant/piral-feed-server';
import TriggerActionManager from './utils/plugins/trigger-action-manager';
import { runPiral } from '@phonophant/piral';

async function bootstrap() {
  const app = express();
  app.use(
    cors({
      origin: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  runPiral(app);

  const pluginManager = new PluginManager(app);
  const triggerActionManager = new TriggerActionManager(pluginManager, app);
  await pluginManager.loadPluginList();
  await pluginManager.initLoadedPlugins(triggerActionManager.triggerAction.bind(triggerActionManager));

  const feedService = new PiralFeedService(app, pluginManager);
  await app.listen(3000);
}

bootstrap();
