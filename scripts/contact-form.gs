/**
 * LEAF Software and Production — contact form endpoint.
 *
 * Receives submissions from the contact form on leafsp.com, appends one row
 * per enquiry to the bound spreadsheet, and emails the team. See the
 * "Contact form" section of README.md for the setup and deployment steps.
 *
 * The site is a static build with no backend, so this script is the backend:
 * it must be bound to a Google Sheet and deployed as a Web App with
 * "Execute as: me" and "Who has access: Anyone".
 */

/** Where enquiry notifications are sent. */
var NOTIFY_TO = 'leaf.sandp@gmail.com';

/** Tab the rows are appended to; created on first submission if missing. */
var SHEET_NAME = 'Enquiries';

/**
 * Column order. The last three are left empty for whoever works the lead —
 * that is what turns this sheet into a small tracker rather than a log.
 */
var HEADERS = [
  'Timestamp',
  'Language',
  'Name',
  'Email',
  'Company',
  'Phone',
  'Project type',
  'Detail',
  'Stage',
  'Timeline',
  'Message',
  'Page',
  'Status',
  'Owner',
  'Notes',
];

/**
 * Opening the deployed URL in a browser is the quickest way to tell whether
 * the deployment is live, so answer GET with something readable.
 */
function doGet() {
  return json({ ok: true, message: 'LEAF contact endpoint is running.' });
}

function doPost(e) {
  try {
    var data = parseBody(e);

    // Honeypot: a hidden field no human ever sees, so anything in it is a bot.
    // Answer with success so the bot does not learn to work around it.
    if (data.botcheck) return json({ success: true });

    var name = trim(data.name);
    var email = trim(data.email);
    if (!name || !isEmail(email)) {
      return json({ success: false, message: 'Name and a valid email are required.' });
    }

    var row = {
      timestamp: Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
      lang: trim(data.lang) || 'th',
      name: name,
      email: email,
      company: trim(data.company),
      phone: trim(data.phone),
      projectType: trim(data.projectType),
      projectDetail: trim(data.projectDetail),
      projectStage: trim(data.projectStage),
      projectTimeline: trim(data.projectTimeline),
      message: trim(data.message),
      pageUrl: trim(data.pageUrl),
    };

    appendRow(row);
    notify(row);

    return json({ success: true });
  } catch (err) {
    // The row may or may not have been written, so report the failure rather
    // than letting the form tell the visitor their message is on its way.
    console.error(err);
    return json({ success: false, message: String(err) });
  }
}

/**
 * The form posts a JSON string as text/plain, which keeps the request "simple"
 * and so avoids a CORS preflight this script cannot answer. Form-encoded
 * bodies are still accepted so the endpoint can be tested with plain curl.
 */
function parseBody(e) {
  if (e && e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    if (raw.charAt(0) === '{') return JSON.parse(raw);
  }
  return (e && e.parameter) || {};
}

function appendRow(row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    row.timestamp,
    row.lang,
    row.name,
    row.email,
    row.company,
    row.phone,
    row.projectType,
    row.projectDetail,
    row.projectStage,
    row.projectTimeline,
    row.message,
    row.pageUrl,
    '', // Status
    '', // Owner
    '', // Notes
  ]);
}

function notify(row) {
  var body =
    'New enquiry from leafsp.com\n\n' +
    field('Name', row.name) +
    field('Email', row.email) +
    field('Company', row.company) +
    field('Phone', row.phone) +
    '\n' +
    field('Project type', row.projectType) +
    field('Detail', row.projectDetail) +
    field('Stage', row.projectStage) +
    field('Timeline', row.projectTimeline) +
    '\n' +
    'Message:\n' +
    (row.message || '-') +
    '\n\n' +
    field('Language', row.lang) +
    field('Page', row.pageUrl) +
    field('Received', row.timestamp) +
    '\n' +
    'All enquiries: ' +
    SpreadsheetApp.getActiveSpreadsheet().getUrl() +
    '\n';

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: 'New enquiry from leafsp.com — ' + row.name,
    body: body,
    // So that hitting Reply in Gmail answers the enquirer, not this script.
    replyTo: row.email,
    name: 'leafsp.com',
  });
}

function field(label, value) {
  return label + ': ' + (value || '-') + '\n';
}

function trim(value) {
  return value == null ? '' : String(value).trim();
}

function isEmail(value) {
  return /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(value);
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
