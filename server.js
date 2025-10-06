const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// store uploaded data in memory
let excelData = []; // This will hold the data from uploaded Excel file

// --- Upload route ---
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");

    const filePath = req.file.path;

    // read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // store in memory
    excelData = data;

    // delete the uploaded file
    fs.unlinkSync(filePath);

    res.json({ success: true, rows: data });
  } catch (err) {
    console.error(err); // show error in server console
    res.status(500).json({ error: err.message });
  }
});

// --- Search route ---
app.post('/search', (req, res) => {
  try {
    const { query } = req.body;

    if (!query) return res.json({ rows: excelData });

    const filtered = excelData.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );

    res.json({ rows: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
