const xlfile = document.getElementById("xlfile");
const analyseBtn = document.getElementById("analyse");

let tableData = [];

const getPageData = (i) => {
  const start = i * 10;
  const end = start + 10;
  return tableData.slice(start, end);
};

const setPage = (i) => {
  const data = getPageData(i);
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  data.forEach((row) => {
    tbody.appendChild(row);
  });
};

const applyStyle = (table) => {
  // Apply CSS classes to the table
  table.classList.add("listing-table");
  table.querySelectorAll("tr").forEach((row, index) => {
    row.classList.add("listing-table__row");
    if (index === 0) {
      // Apply header styles
      row
        .querySelectorAll("td")
        .forEach((th) => th.classList.add("listing-table__header"));
    } else {
      // Apply row styles
      row.classList.add(index % 2 === 0 ? "even" : "odd");
      row
        .querySelectorAll("td")
        .forEach((td) => td.classList.add("listing-table__cell"));
    }
  });

  return table;
};

const renderTable = (data) => {
  const tableContainer = document.getElementById("TableContainer");
  tableContainer.innerHTML = '<div id="spinner1"></div>';

  const reader = new FileReader();

  reader.onload = (e) => {
    const fileContent = XLSX.read(e.target.result, { type: "array" });
    //   const fileContent = XLSX.read(, { type: "array" });
    const sheetName = fileContent.SheetNames[0];
    const sheet = fileContent.Sheets[sheetName];

    // Generate HTML table
    let tableHTML = XLSX.utils.sheet_to_html(sheet);

    // Parse the generated table HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableHTML, "text/html");
    const table = doc.querySelector("table");

    const styledTable = applyStyle(table);

    // Inject the styled table into the container
    tableContainer.innerHTML = "";
    const tableHeader = Array.from(styledTable.querySelectorAll("tr"))[0];
    tableData = Array.from(styledTable.querySelectorAll("tr")).slice(1);
    console.log(tableData);
    tableContainer.innerHTML = `<table class='listing-table'>
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>`;

    // set header
    const thead = document.querySelector("thead");
    thead.appendChild(tableHeader);

    // Set the initial page
    setPage(0);
    document.querySelector(".page-footer").classList.remove("hidden");
    Pagination(1, setPageActive, Math.ceil(tableData.length / 10), setPage);
  };

  reader.readAsArrayBuffer(data);
};

function getCsrfToken() {
  const name = "csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function downloadAndRenderExcel(url, options) {
  fetch(url, options)
    .then((response) => response.blob())
    .then((blob) => {
      renderTable(blob);
      const downloadBtn = document.getElementById("downloadBtn");
      downloadBtn.href = URL.createObjectURL(blob);
      downloadBtn.download = "output.xlsx";
    })
    .catch((error) =>
      console.error("Error downloading or rendering Excel file:", error)
    );
}

analyseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (xlfile.files.length === 0) {
    alert("Please select an Excel file to upload.");
    return;
  }

  const file = xlfile.files[0];
  const formData = new FormData();
  formData.append("xlfile", file);
  const options = {
    method: "POST",
    headers: {
      "X-CSRFToken": getCsrfToken(), // Add CSRF token to the request headers
    },
    body: formData,
  };
  downloadAndRenderExcel("analyse/", options);
});
