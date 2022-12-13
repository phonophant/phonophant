import TriggerActionManager from './trigger-action-manager';
import PluginManager from './plugin-manager';
import { createMockNpmPlugin } from './plugin-definition.mock';
import { BasePlugin, PluginType } from '@phonophant/shared-models';
import { Application } from 'express';

const mockPluginDefinitionInstanceExecution = jest.fn();
jest.mock('./plugin-manager', () => {
  return {
    default: jest.fn().mockImplementation(() => {
        return {getPluginByName: (name: string) => {
          return createMockNpmPlugin({
            name,
            instance: {
              init: () => {},
              pluginType: PluginType.Action,
              execute: mockPluginDefinitionInstanceExecution,
            } as BasePlugin<any>
          });
        }};
      })
  }
});

const expressMock = {
  use: jest.fn(),
  post: jest.fn(),
  get: jest.fn(),
} as any as Application;


describe('TriggerActionManager', () => {
  let triggerActionManager: TriggerActionManager;
  let pluginManager: PluginManager;

  const mocks = {
    get triggerPluginName() {
      return 'triggerPluginName';
    },
    get triggerValue() {
      return 'triggerValue';
    },
    get actionPluginName() {
      return 'actionPluginName';
    },
    get actionPluginConfig() {
      return {
        testConfig: 'test-config'
      };
    },
  }

  beforeEach(() => {
    jest.clearAllMocks;
    mockPluginDefinitionInstanceExecution.mockClear();
    pluginManager = new PluginManager(expressMock);
    triggerActionManager = new TriggerActionManager(pluginManager, expressMock);
  });

  it('should execute an action with the correct config if it has a registered trigger action relationship and the corresponding trigger is called.', () => {
    const { triggerPluginName, triggerValue, actionPluginName, actionPluginConfig } = mocks;

    triggerActionManager.registerTriggerToActionRelation(triggerPluginName, triggerValue, actionPluginName, actionPluginConfig);
    triggerActionManager.triggerAction(triggerPluginName, triggerValue);
    expect(mockPluginDefinitionInstanceExecution).toBeCalledWith(mocks.actionPluginConfig);
  });

  it('should NOT execute an action if the trigger value is not matching the registered trigger action relationship.', () => {
    const { triggerPluginName, triggerValue, actionPluginName, actionPluginConfig } = mocks;

    triggerActionManager.registerTriggerToActionRelation(triggerPluginName, triggerValue, actionPluginName, actionPluginConfig);
    triggerActionManager.triggerAction(triggerPluginName, 'non-matching-trigger-value');
    expect(mockPluginDefinitionInstanceExecution).not.toBeCalled();
  });

  it('should NOT execute an action if the trigger plugin is not matching the one of the registered trigger action relationship', () => {
    const { triggerPluginName, triggerValue, actionPluginName, actionPluginConfig } = mocks;

    triggerActionManager.registerTriggerToActionRelation(triggerPluginName, triggerValue, actionPluginName, actionPluginConfig);
    triggerActionManager.triggerAction('non-matching-trigger', triggerValue);
    expect(mockPluginDefinitionInstanceExecution).not.toBeCalled();
  });
});