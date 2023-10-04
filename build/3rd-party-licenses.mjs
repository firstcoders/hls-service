import * as esbuild from 'esbuild';
import esbuildPluginLicense from 'esbuild-plugin-license';
import { copyFileSync, rmSync } from 'fs';

await esbuild.build({
  entryPoints: [
    'src/handlers/createM3u8.js',
    'src/handlers/getM3u8.js',
    'src/handlers/purgeObjects.js',
  ],
  outdir: 'licenses',
  target: 'es2020',
  format: 'esm',
  external: ['@aws-sdk'],
  plugins: [
    esbuildPluginLicense({
      banner: `/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */`,
      thirdParty: {
        includePrivate: false,
        output: {
          file: 'THIRD-PARTY-LICENSES.txt',
          // Template function that can be defined to customize report output
          template(dependencies) {
            return dependencies
              .map(
                (dependency) =>
                  `Package: ${dependency.packageJson.name}\nVersion: ${dependency.packageJson.version}\nLicense: ${dependency.packageJson.license}\n\n${dependency.licenseText}`,
              )
              .join('\n');
          },
        },
      },
    }),
  ],
  bundle: true,
  platform: 'node',
});

['CreateM3u8Function', 'GetM3u8Function', 'PurgeObjectsFromS3Function'].forEach((functionName) =>
  copyFileSync(
    'licenses/THIRD-PARTY-LICENSES.txt',
    `./.aws-sam/build/${functionName}/THIRD-PARTY-LICENSES.txt`,
  ),
);

rmSync('./licenses', { recursive: true });
