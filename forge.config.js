const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon',
    ignore: [
      /^\/renderer/,
      /^\/out\/make/,
      /^\/dist/,
      /^\/\.git/,
      /^\/\.claude/,
      /^\/\.gitignore/,
      /^\/\.gitattributes/,
      /^\/package-lock\.json/,
      /^\/forge\.config\.js/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ciudadano_dashboard',
        authors: 'Julio Pineda',
        description: 'Dashboard para la gestión de ciudadanos',
        setupIcon: './assets/icon.ico',
        loadingGif: './assets/Loading.gif',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Julio-Pineda-Namebot',
          name: 'ciudadano-dashboard'
        },
        prerelease: true,
        draft: true
      }
    }
  ]
};
