const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

const TEMPLATE_PATH = path.join(__dirname, '../templates/flutter_template');
const OUTPUT_DIR = path.join(__dirname, '../generated_apps');

async function generateFlutterApp(formData) {
  const appId = uuidv4();
  const appPath = path.join(OUTPUT_DIR, appId);

  //await fs.copy(TEMPLATE_PATH, appPath);

  await fs.copy(TEMPLATE_PATH, appPath, {
    filter: (src) => {
      // Skip copying this test file if it exists
      if (src.includes("widget_test.dart")) return false;
      return true;
    }
  });

  // === MAIN.DART ===
  const mainDartPath = path.join(appPath, 'lib', 'main.dart');
  let mainDartContent = await fs.readFile(mainDartPath, 'utf8');

  mainDartContent = mainDartContent
    .replace(/{{COUPLE_NAME}}/g, formData.coupleName)
    .replace(/{{WEDDING_DATE}}/g, formData.weddingDate)
    .replace(/{{WEDDING_LOCATION}}/g, formData.weddingLocation);

  if (formData.appPassword) {
    mainDartContent = mainDartContent.replace(/{{APP_PASSWORD}}/g, formData.appPassword);
  }


  await fs.writeFile(mainDartPath, mainDartContent);

  // === ITINERARY.DART ===
  const itineraryDartPath = path.join(appPath, 'lib', 'itinerary.dart');
  let itineraryDartContent = await fs.readFile(itineraryDartPath, 'utf8');

  const formatEvent = (event) => {
    const name = event.name || '';
    const location = event.location || '';
    const time = event.time || '';
    const date = event.date || '';
    const dressCode = event.dressCode || '';

    return `Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text(
      '• ${name}',
      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
    ),
    Text(
      'Location: ${location}',
      style: TextStyle(fontSize: 15),
    ),
    Text(
      'Date: ${date} • Time: ${time}',
      style: TextStyle(fontSize: 15),
    ),
    Text(
      'Dress Code: ${dressCode}',
      style: TextStyle(fontSize: 15, fontStyle: FontStyle.italic),
    ),
    SizedBox(height: 12),
  ],
),`;
  };

  const injectEventSection = (dartContent, sectionLabel, marker, events = []) => {
    if (!events?.length) {
      return dartContent.replace(
        new RegExp(`\\s*Text\\([^)]*${sectionLabel}[^)]*\\)[\\s\\S]*?// ${marker}_END\\s*`),
        ''
      );
    }

    const eventWidgets = events.map(formatEvent).join('\n\n');
    return dartContent.replace(
      new RegExp(`// ${marker}_START[\\s\\S]*?// ${marker}_END`),
      `// ${marker}_START\n${eventWidgets}\n// ${marker}_END`
    );
  };

  itineraryDartContent = injectEventSection(itineraryDartContent, 'Bride Events', 'BRIDE_EVENTS', formData.brideEvents);
  itineraryDartContent = injectEventSection(itineraryDartContent, 'Groom Events', 'GROOM_EVENTS', formData.groomEvents);
  itineraryDartContent = injectEventSection(itineraryDartContent, 'Wedding Events', 'WEDDING_EVENTS', formData.weddingEvents);

  itineraryDartContent = itineraryDartContent
    .replace(/{{WEDDING_DATE}}/g, formData.weddingDate)
    .replace(/{{WEDDING_LOCATION}}/g, formData.weddingLocation);

  await fs.writeFile(itineraryDartPath, itineraryDartContent);

  // === OUR_FAMILY.DART ===
  const familyDartPath = path.join(appPath, 'lib', 'our_family.dart');
  let familyDartContent = await fs.readFile(familyDartPath, 'utf8');

  const formatFamilyCard = (name, description, image) => `
  Padding(
    padding: const EdgeInsets.symmetric(vertical: 12),
    child: _buildMemberCard(
      '${name?.replace(/'/g, "\\'") ?? ''}',
      '${description?.replace(/'/g, "\\'") ?? ''}',
      '${image || 'assets/placeholder.jpg'}',
    ),
  ),`;

  const injectFamilyBlock = (dartContent, marker, members = []) => {
    const content = members.map(m =>
      formatFamilyCard(m.name, m.relation || m.description || '', m.image)
    ).join('\n');
    return dartContent.replace(
      new RegExp(`// ${marker}_START[\\s\\S]*?// ${marker}_END`),
      `// ${marker}_START\n${content}\n// ${marker}_END`
    );
  };

  familyDartContent = injectFamilyBlock(familyDartContent, 'BRIDE_SIDE', formData.familyDetails?.bride || []);
  familyDartContent = injectFamilyBlock(familyDartContent, 'GROOM_SIDE', formData.familyDetails?.groom || []);
  familyDartContent = injectFamilyBlock(familyDartContent, 'PET_SIDE', formData.familyDetails?.pets || []);

  await fs.writeFile(familyDartPath, familyDartContent);

  // === WEDDING_PARTY.DART ===
  const partyDartPath = path.join(appPath, 'lib', 'wedding_party.dart');
  let partyDartContent = await fs.readFile(partyDartPath, 'utf8');

  const formatPartyCard = (name, role, relation, image) => `
  Padding(
    padding: const EdgeInsets.symmetric(vertical: 12),
    child: _buildMemberCard(
      '${name?.replace(/'/g, "\\'") ?? ''}',
      '${role?.replace(/'/g, "\\'") ?? ''}',
      '${relation?.replace(/'/g, "\\'") ?? ''}',
      '${image || 'assets/placeholder.jpg'}',
    ),
  ),`;

  const injectPartyBlock = (dartContent, marker, members = []) => {
    const content = members.map(m =>
      formatPartyCard(m.name, m.role || '', m.relation || '', m.image)
    ).join('\n');
    return dartContent.replace(
      new RegExp(`// ${marker}_START[\\s\\S]*?// ${marker}_END`),
      `// ${marker}_START\n${content}\n// ${marker}_END`
    );
  };

  partyDartContent = injectPartyBlock(partyDartContent, 'BRIDAL_PARTY', formData.weddingParty?.bride || []);
  partyDartContent = injectPartyBlock(partyDartContent, 'GROOM_PARTY', formData.weddingParty?.groom || []);

  await fs.writeFile(partyDartPath, partyDartContent);

  // === SHEET ID INJECTION ===
  const sheetIdMatch = (formData.rsvpSheetUrl || '').match(/\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = sheetIdMatch ? sheetIdMatch[1] : '';

  const rsvpFormPath = path.join(appPath, 'lib', 'rsvpForm.dart');
  let rsvpFormContent = await fs.readFile(rsvpFormPath, 'utf8');
  rsvpFormContent = rsvpFormContent.replace(/{{SHEET_ID}}/g, sheetId);
  await fs.writeFile(rsvpFormPath, rsvpFormContent);

  // === DRIVE FOLDER ID INJECTION ===
  const driveMatch = (formData.galleryDriveUrl || '').match(/\/folders\/([a-zA-Z0-9-_]+)/);
  const driveFolderId = driveMatch ? driveMatch[1] : '';

  const galleryPath = path.join(appPath, 'lib', 'photo_gallery.dart');
  let galleryContent = await fs.readFile(galleryPath, 'utf8');
  galleryContent = galleryContent.replace(/{{DRIVE_FOLDER_ID}}/g, driveFolderId);
  await fs.writeFile(galleryPath, galleryContent);

  // === ZIP ARCHIVE ===
  const zipPath = path.join(OUTPUT_DIR, `${appId}.zip`);
  await zipDirectory(appPath, zipPath);
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
