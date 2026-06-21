// Apps Script to receive JSON POSTs and append to the active spreadsheet.
// No token required (accepts any POST). Attach this script to the Google Sheet (Extensions → Apps Script)

function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents || '{}');
    } else {
      data = e.parameter || {};
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Determine columns to append. We'll append a set of common fields.
    var row = [
      new Date().toISOString(),
      data.nom || data.name || '',
      data.tel || data.phone || '',
      data.accompagne || data.rsvp || '',
      data.nom_accompagnateur || data.guests || '',
      data.message || data.note || ''
    ];

    // If the sheet is empty, add a header row first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','nom','tel','accompagne','nom_accompagnateur','message']);
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error: String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
