/**
 * @description Menangani permintaan POST dari React App
 * Update terbaru: Menambahkan handling untuk TikTok dan Social Media Lain
 */
function doPost(e) {
  try {
    // 1. KONFIGURASI
    const SHEET_ID = '103biF_YdRRS1x-LeR5rF9oxDLb8YSNCAZewjEzGfFEQ'; // Pastikan ID ini benar
    const FOLDER_ID = '165n3Do7A7vIyxQxcBVAyvQm3civvYkPg'; // Pastikan ID ini benar
    const SHEET_NAME = 'Sheet2';

    // 2. PARSE DATA
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // 3. DEFINISI KOLOM (URUTAN HEADER)
    // Kita mendefinisikan urutan agar rapi di Spreadsheet
    const desiredOrder = [
      'Nama Lengkap',
      'Tanggal Lahir',
      'No WhatsApp',
      'Email',
      'Username TikTok',     // Field Baru
      'Platform Sosmed',     // Field Baru (Instagram/Facebook)
      'Username Sosmed',     // Field Baru
      'NIK',
      'Alamat',
      'Tanggal Keberangkatan',
      'Tanggal Aktivasi',
      'Nama Perusahaan',
      'Training Center',
      'Merk HP',
      'Biaya Belajar Melalui',
      'Pilihan Paket',
      'Persetujuan',
      'Link Foto KTP',
      'Link Foto Paspor',
      'Timestamp'
    ];

    // 4. BUAT HEADER JIKA SHEET KOSONG
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(desiredOrder);
    } else {
      // (Opsional) Cek jika header yang ada sesuai, jika tidak, bisa append di ujung
      // Untuk script sederhana ini, kita asumsikan header sudah ada atau dibuat pertama kali
    }

    // 5. UPLOAD FILE
    const folder = DriveApp.getFolderById(FOLDER_ID);

    let ktpUrl = '-';
    if (data['Foto KTP'] && data['Foto KTP'].data) {
      ktpUrl = uploadFileToDrive(folder, data['Foto KTP'], (data['Nama Lengkap'] || 'NoName') + '-KTP');
    }

    let pasporUrl = '-';
    if (data['Foto Paspor'] && data['Foto Paspor'].data) {
      pasporUrl = uploadFileToDrive(folder, data['Foto Paspor'], (data['Nama Lengkap'] || 'NoName') + '-Paspor');
    }

    // 6. SUSUN DATA ROW
    const rowData = desiredOrder.map(header => {
      if (header === 'Link Foto KTP') return ktpUrl;
      if (header === 'Link Foto Paspor') return pasporUrl;
      if (header === 'Timestamp') return new Date();
      // Kembalikan data sesuai key, atau string kosong jika undefined
      return data[header] || '';
    });

    // 7. SIMPAN KE SHEET
    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data berhasil disimpan'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function uploadFileToDrive(folder, fileData, newFileName) {
  try {
    const decodedData = Utilities.base64Decode(fileData.data);
    const blob = Utilities.newBlob(decodedData, fileData.mimeType, newFileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (e) {
    return "Error Upload: " + e.toString();
  }
}