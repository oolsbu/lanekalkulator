var selectedLoanType = ""; // Global variable to store the selected loan type
var lån, terminerPerÅr, løpetid, termingebyr, rente; // Consolidated variable declarations

function selectLoanType(type) {
  var loanTypes = document.getElementsByClassName("loan-type");
  for (var i = 0; i < loanTypes.length; i++) {
    loanTypes[i].classList.remove("active");
    loanTypes[i].style.fontWeight = "normal";
    loanTypes[i].style.textDecoration = "none";
    loanTypes[i].style.fontSize = "initial";
  }

  selectedLoanType = type;
  console.log(selectedLoanType); // Update the selected loan type

  var selectedLoanElement = document.getElementById(type);
  selectedLoanElement.classList.add("active");
  selectedLoanElement.style.fontWeight = "bold";
  selectedLoanElement.style.textDecoration = "underline";
  selectedLoanElement.style.fontSize = "larger";
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("calculateButton").addEventListener("click", calculateLoan);
});

function calculateLoan() {
  lån = parseFloat(document.getElementById("loanAmount").value.replace(/\s/g, '').replace(',', '.'));
  terminerPerÅr = parseInt(document.getElementById("termsPerYear").value);
  løpetid = parseInt(document.getElementById("loanYears").value) * 12 + parseInt(document.getElementById("loanMonths").value);
  termingebyr = parseFloat(document.getElementById("termFee").value.replace(/\s/g, '').replace(',', '.'));
  rente = parseFloat(document.getElementById("rente").value.replace(/\s/g, '').replace(',', '.'));

  var resultElement = document.getElementById("result");
  resultElement.innerHTML = "";

if (selectedLoanType === "serielan") {
  var gjenværendeGjeld = lån;
  var renter, avdrag, terminbeløp;
  var totalRente = 0;

  var table = document.createElement("table");
  var tableHeader = "<tr><th>Termin</th><th>Terminbeløp</th><th>Renter</th><th>Gebyrer</th><th>Avdrag</th><th>Restgjeld</th></tr>";
  var tableRows = "";

  for (var termin = 1; termin <= løpetid; termin++) {
    renter = gjenværendeGjeld * (rente / 100 / 12);
    avdrag = lån / løpetid;
    terminbeløp = renter + avdrag + termingebyr;

    gjenværendeGjeld -= avdrag;
    totalRente += renter;

    tableRows += "<tr><td>" + termin + "</td><td>" + formatCurrency(terminbeløp.toFixed(0)) + "</td><td>" + formatCurrency(renter.toFixed(0)) + "</td><td>" + formatCurrency(termingebyr.toFixed(0)) + "</td><td>" + formatCurrency(avdrag.toFixed(0)) + "</td><td>" + formatCurrency(gjenværendeGjeld.toFixed(0)) + "</td></tr>";
  }

  var effektivRente = totalRente + termingebyr * (løpetid / 12);

  table.innerHTML = tableHeader + tableRows;
  resultElement.appendChild(table);

  resultElement.innerHTML += "<p>Renter/gebyr: " + formatCurrency(effektivRente.toFixed(0)) + "</p>";
  resultElement.innerHTML += "<p>Lån: " + formatCurrency(lån.toFixed(0)) + "</p>";
  resultElement.innerHTML += "<p>Total kostnad: " + formatCurrency((lån + effektivRente).toFixed(0)) + "</p>";
} else {
  var gjenværendeGjeld = lån;
  var månedligRente = rente / 100 / 12;
  var månedligBetaling = lån * (månedligRente * Math.pow(1 + månedligRente, løpetid)) / (Math.pow(1 + månedligRente, løpetid) - 1);

  var table = document.createElement("table");
  var tableHeader = "<tr><th>Termin</th><th>Terminbeløp</th><th>Renter</th><th>Gebyrer</th><th>Avdrag</th><th>Restgjeld</th></tr>";
  var tableRows = "";

  for (var term = 1; term <= løpetid; term++) {
    var interestPayment = gjenværendeGjeld * månedligRente;
    var principalPayment = månedligBetaling - interestPayment;
    gjenværendeGjeld -= principalPayment;

    var row = "<tr><td>" + term + "</td><td>" + formatCurrency(månedligBetaling.toFixed(0)) + "</td><td>" + formatCurrency(interestPayment.toFixed(0)) + "</td><td>" + formatCurrency(termingebyr.toFixed(0)) + "</td><td>" + formatCurrency(principalPayment.toFixed(0)) + "</td><td>" + formatCurrency(Math.abs(gjenværendeGjeld).toFixed(0)) + "</td></tr>";
    tableRows += row;
  }

  table.innerHTML = tableHeader + tableRows;
  resultElement.appendChild(table);

  resultElement.innerHTML += "<p>Renter/gebyr: " + formatCurrency(effektivRente.toFixed(0)) + "</p>";
  resultElement.innerHTML += "<p>Lån: " + formatCurrency(lån.toFixed(0)) + "</p>";
  resultElement.innerHTML += "<p>Total kostnad: " + formatCurrency((lån + effektivRente).toFixed(0)) + "</p>";
}


function formatCurrency(amount) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
}