const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Optimisations pour accélérer le démarrage
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

// Optimiser le watcher pour éviter de surveiller trop de fichiers
config.watchFolders = [__dirname];

module.exports = withNativeWind(config, { input: './global.css' });
