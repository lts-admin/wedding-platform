const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

const TEMPLATE_PATH = path.join(__dirname, '../templates/flutter_template');
const OUTPUT_DIR = path.join(__dirname, '../generated_apps');

async function generateFlutterApp(formData) {
    const appId = uuidv4();
    const appPath = path.join(OUTPUT_DIR, appId);

    // Ensure values are sanitized
    const coupleName = (formData.coupleName || '').trim();
    const weddingDate = (formData.weddingDate || '').trim();
    const weddingLocation = (formData.weddingLocation || '').trim();

    console.log('Generating app for:', { coupleName, weddingDate, weddingLocation });

    // Copy template into a unique folder
    await fs.copy(TEMPLATE_PATH, appPath);

    // Customize main.dart
    const mainDartPath = path.join(appPath, 'lib', 'main.dart');
    let mainDartContent = await fs.readFile(mainDartPath, 'utf8');

    mainDartContent = mainDartContent
        .replace(/{{COUPLE_NAME}}/g, coupleName)
        .replace(/{{WEDDING_DATE}}/g, weddingDate)
        .replace(/{{WEDDING_LOCATION}}/g, weddingLocation);

    await fs.writeFile(mainDartPath, mainDartContent);
    console.log('main.dart updated successfully');

    // Archive the folder
    const zipFilename = `${coupleName.toLowerCase().replace(/\s+/g, '-')}-wedding.zip`;
    const zipPath = path.join(OUTPUT_DIR, zipFilename);
    await zipDirectory(appPath, zipPath);

    // Optional cleanup
    await fs.remove(appPath);

    return zipPath;
}

function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve(outPath));
        archive.finalize();
    });
}

module.exports = { generateFlutterApp };
