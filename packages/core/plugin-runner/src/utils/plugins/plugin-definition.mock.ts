import { LocalPluginDefinition, NpmPluginDefinition, PluginDefinitionSource } from '@phonophant/shared-models';

export function createMockNpmPluginDefinition(pluginDefinition: Partial<NpmPluginDefinition>): NpmPluginDefinition {
  const defaultMock = {
    name: 'mock-npm-plugin-definition',
    source: PluginDefinitionSource.Npm,
    active: true,
    options: {},
    packageName: 'mock-npm-package-name',
    version: '1.0.0',
  };

  return { ...defaultMock, ...pluginDefinition };
}

export function createMockLocalPluginDefinition(pluginDefinition: Partial<LocalPluginDefinition>): LocalPluginDefinition {
  const defaultMock = {
    name: 'mock-npm-plugin-definition',
    source: PluginDefinitionSource.Local,
    active: true,
    options: {},
    entryFile: './index.js',
    isRelative: true,
  };

  return { ...defaultMock, ...pluginDefinition };
}
