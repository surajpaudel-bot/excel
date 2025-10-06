const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('excelFile');
const output = document.getElementById('output');

uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    output.textContent = "Please select an Excel file first.";
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});
