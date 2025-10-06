// --- Elements ---
const fileInput = document.getElementById('excelFile');   // File input
const uploadBtn = document.getElementById('uploadBtn');   // Upload button
const searchQuery = document.getElementById('searchQuery'); // Search input
const searchBtn = document.getElementById('searchBtn');     // Search button
const output = document.getElementById('output');           // Where results will be shown

// --- Upload Excel File ---
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    output.textContent = "Please select an Excel file first.";
    return;
  }

  const formData = new FormData();
  formData.append('file', file); // must match server's upload.single('file')

  try {
    const res = await fetch('/upload', {
      method: 'POST', // must be POST
      body: formData   // sending FormData with file
    });

    // Important: check response type
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json(); // parse JSON
    output.textContent = JSON.stringify(data.rows, null, 2); // show Excel rows
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// --- Search Excel Data ---
searchBtn.addEventListener('click', async () => {
  const query = searchQuery.value;

  try {
    const res = await fetch('/search', {
      method: 'POST',                          // must be POST
      headers: { 'Content-Type': 'application/json' }, // JSON
      body: JSON.stringify({ query })          // send search query as JSON
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();            // parse JSON response
    output.textContent = JSON.stringify(data.rows, null, 2); // show filtered rows
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});
