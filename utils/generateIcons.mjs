import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const manifestIconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const htmlIconSizeMap = {
  'favicon.png': 32,
  'apple-touch-icon.png': 180,
};
const htmlSnippet = '<link rel="icon" type="image/png" href="/icons/favicon.png" sizes="32x32 16x16" />\n<link rel="shortcut icon" href="/icons/favicon.png" sizes="32x32 16x16" />\n<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />';

(async function main() {
  // Extract target paths
  const [, , sourcePath, outputPath] = process.argv;

  // Validate user inputs
  if (!sourcePath || !outputPath) {
    console.error('No source path or output path specified.\nSyntax: node utils/generateIcons.js src/favicon.png src/icons');
    process.exit(1);
  }
  if (!fs.existsSync(sourcePath)) {
    console.error('Invalid source path specified.\nSyntax: node utils/generateIcons.js src/favicon.png src/icons');
    process.exit(1);
  }
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const createdManifestIcons = [];

  // Generate icons required for web manifest
  for (const iconSize of manifestIconSizes) {
    const iconFileName = `icon-${iconSize}x${iconSize}.png`;
    const iconPathPublic = '/icons/' + iconFileName;
    const iconPathInternal = path.join(outputPath, iconFileName);

    // Generate icon <iconFileName> with dimensions <iconSize>
    await sharp(sourcePath)
      .resize(iconSize, iconSize)
      .png()
      .toFile(iconPathInternal);

    createdManifestIcons.push({
      src: iconPathPublic,
      sizes: iconSize + 'x' + iconSize,
      type: 'image/png',
      purpose: 'maskable',
    });
  }

  // Generate icons required for document
  for (const htmlIcon of Object.entries(htmlIconSizeMap)) {
    const iconPathInternal = path.join(outputPath, htmlIcon[0]);
    const iconSize = htmlIcon[1];

    await sharp(sourcePath)
      .resize(iconSize, iconSize)
      .png()
      .toFile(iconPathInternal);
  }

  // Output instructions
  console.log(`Insert the following JSON into your web manifest at the property "icons":\n\n${JSON.stringify(createdManifestIcons)}\n\nInsert the follwing HTML into the head tag of your document:\n${htmlSnippet}`);

})()
  // Catch errors during execution of main
  .catch(error => {
    console.error('Caught Error:', error);
    process.exit(1);
  });
