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
  'Consent',
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

    var now = new Date();
    var row = {
      // The sheet keeps a sortable timestamp; the email shows a Thai one.
      timestamp: Utilities.formatDate(now, 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
      received: thaiDateTime(now),
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
      // The form's consent box is required, so anything arriving without it
      // came from outside the form.
      consent: data.consent ? 'ยินยอม' : '',
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

  // Write the header row on the first run, and repair it if the column list
  // has changed since — otherwise a new column lands under a blank heading.
  var width = sheet.getLastColumn();
  var current =
    sheet.getLastRow() === 0 || width === 0
      ? []
      : sheet.getRange(1, 1, 1, width).getValues()[0];
  if (current.join('\u0000') !== HEADERS.join('\u0000')) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
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
    row.consent,
    row.pageUrl,
    '', // Status
    '', // Owner
    '', // Notes
  ]);
}

/**
 * The notification email, in Thai.
 *
 * Sent as HTML with a plain-text alternative, so it reads well in Gmail and
 * still makes sense in a client that strips the styling.
 */
function notify(row) {
  var lang = row.lang === 'en' ? 'อังกฤษ' : 'ไทย';

  var contact = [
    ['ชื่อ', row.name],
    ['อีเมล', row.email],
    ['บริษัท', row.company],
    ['เบอร์โทร', row.phone],
  ];
  var project = [
    ['ประเภทงาน', row.projectType],
    ['รายละเอียด', row.projectDetail],
    ['ความพร้อม', row.projectStage],
    ['ระยะเวลา', row.projectTimeline],
  ];
  var meta = [
    ['ภาษาที่ใช้กรอก', lang],
    ['หน้าที่ส่งมา', row.pageUrl],
    ['เวลาที่ได้รับ', row.received],
    ['การยินยอม (PDPA)', row.consent || 'ไม่ได้ระบุ'],
  ];

  var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  var text =
    'มีผู้ติดต่อเข้ามาใหม่จาก leafsp.com\n\n' +
    '— ข้อมูลผู้ติดต่อ —\n' +
    plainRows(contact) +
    '\n— รายละเอียดโครงการ —\n' +
    plainRows(project) +
    '\n— ข้อความเพิ่มเติม —\n' +
    (row.message || '(ไม่ได้ระบุ)') +
    '\n\n— ข้อมูลระบบ —\n' +
    plainRows(meta) +
    '\nดูรายการทั้งหมด: ' +
    sheetUrl +
    '\n';

  var html =
    '<div style="margin:0;padding:24px 12px;background:#f4f7f4;' +
    'font-family:\'Segoe UI\',Tahoma,\'Sarabun\',Arial,sans-serif;">' +
    '<div style="max-width:600px;margin:0 auto;background:#ffffff;' +
    'border:1px solid #e3eae4;border-radius:16px;overflow:hidden;">' +
    // Header band
    '<div style="background:linear-gradient(135deg,#22a345,#7ac943);' +
    'padding:22px 28px;color:#ffffff;">' +
    '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;' +
    'opacity:.85;">leafsp.com</div>' +
    '<div style="font-size:21px;font-weight:700;margin-top:4px;">' +
    'มีผู้ติดต่อเข้ามาใหม่</div>' +
    '</div>' +
    '<div style="padding:8px 28px 28px;">' +
    htmlSection('ข้อมูลผู้ติดต่อ', contact, row) +
    htmlSection('รายละเอียดโครงการ', project, row) +
    // Free-text note, set apart so it is easy to spot
    '<div style="margin-top:22px;">' +
    sectionTitle('ข้อความเพิ่มเติม') +
    '<div style="margin-top:8px;padding:14px 16px;background:#f7faf7;' +
    'border-left:3px solid #22a345;border-radius:8px;color:#243024;' +
    'font-size:15px;line-height:1.7;white-space:pre-wrap;">' +
    (escapeHtml(row.message) || '<span style="color:#8a958c;">(ไม่ได้ระบุ)</span>') +
    '</div></div>' +
    htmlSection('ข้อมูลระบบ', meta, row) +
    // Actions
    '<div style="margin-top:26px;">' +
    '<a href="mailto:' + encodeURI(row.email) + '" style="display:inline-block;' +
    'background:#22a345;color:#ffffff;text-decoration:none;font-weight:600;' +
    'font-size:15px;padding:11px 22px;border-radius:999px;">ตอบกลับผู้ติดต่อ</a>' +
    '<a href="' + sheetUrl + '" style="display:inline-block;margin-left:10px;' +
    'color:#22a345;text-decoration:none;font-weight:600;font-size:15px;' +
    'padding:11px 4px;">ดูรายการทั้งหมด</a>' +
    '</div>' +
    '<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #eef2ee;' +
    'color:#8a958c;font-size:12px;line-height:1.6;">' +
    'อีเมลฉบับนี้ส่งอัตโนมัติจากแบบฟอร์มติดต่อของ leafsp.com ' +
    'กด “ตอบกลับ” ในอีเมลนี้เพื่อตอบผู้ติดต่อได้โดยตรง</p>' +
    '</div></div></div>';

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: 'ติดต่อใหม่จาก leafsp.com — ' + row.name,
    body: text,
    htmlBody: html,
    // So that hitting Reply in Gmail answers the enquirer, not this script.
    replyTo: row.email,
    name: 'leafsp.com',
  });
}

function sectionTitle(label) {
  return (
    '<div style="font-size:12px;font-weight:700;letter-spacing:.08em;' +
    'text-transform:uppercase;color:#22a345;">' + label + '</div>'
  );
}

/** A labelled block of rows: label on the left, value on the right. */
function htmlSection(label, rows, row) {
  var cells = '';
  for (var i = 0; i < rows.length; i++) {
    var value = rows[i][1];
    var shown = value
      ? linkify(rows[i][0], value, row)
      : '<span style="color:#8a958c;">-</span>';
    cells +=
      '<tr>' +
      '<td style="padding:7px 12px 7px 0;color:#6b776d;font-size:14px;' +
      'white-space:nowrap;vertical-align:top;width:36%;">' + rows[i][0] + '</td>' +
      '<td style="padding:7px 0;color:#243024;font-size:15px;font-weight:600;' +
      'vertical-align:top;">' + shown + '</td>' +
      '</tr>';
  }
  return (
    '<div style="margin-top:22px;">' + sectionTitle(label) +
    '<table style="width:100%;border-collapse:collapse;margin-top:6px;">' +
    cells + '</table></div>'
  );
}

/** Email, phone and page values are more useful as links. */
function linkify(label, value, row) {
  var safe = escapeHtml(value);
  if (value === row.email) {
    return '<a href="mailto:' + encodeURI(value) + '" style="color:#22a345;">' + safe + '</a>';
  }
  if (value === row.phone) {
    return '<a href="tel:' + encodeURI(value) + '" style="color:#22a345;">' + safe + '</a>';
  }
  if (value.indexOf('http') === 0) {
    return '<a href="' + encodeURI(value) + '" style="color:#22a345;">' + safe + '</a>';
  }
  return safe;
}

function plainRows(rows) {
  var out = '';
  for (var i = 0; i < rows.length; i++) {
    out += rows[i][0] + ': ' + (rows[i][1] || '-') + '\n';
  }
  return out;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** e.g. "23 ก.ย. 2569 เวลา 11:31 น." — Thai month, Buddhist year. */
function thaiDateTime(date) {
  var months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  var parts = Utilities.formatDate(date, 'Asia/Bangkok', 'd|M|yyyy|HH:mm').split('|');
  return (
    parts[0] + ' ' + months[Number(parts[1]) - 1] + ' ' +
    (Number(parts[2]) + 543) + ' เวลา ' + parts[3] + ' น.'
  );
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
