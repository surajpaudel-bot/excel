const { Console } = require('console');
const express =require('express'); // import express to create a web server
const path= require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const app= express();

const PORT = process.env.PORT||5000;
app.use(express.static(path.join(__dirname, 'public')));

// configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// upload route
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;

    // read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // delete the file after reading (optional)
    fs.unlinkSync(filePath);

    // send JSON data back to browser
    res.json({ success: true, rows: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));