function calculateEMI() {
  const loanAmount = parseFloat(document.getElementById("loanAmount").value);
  const interestRate =
    parseFloat(document.getElementById("interestRate").value) / 100 / 12;
  const loanTenure =
    parseFloat(document.getElementById("loanTenure").value) * 12;

  const emi =
    (loanAmount * interestRate * Math.pow(1 + interestRate, loanTenure)) /
    (Math.pow(1 + interestRate, loanTenure) - 1);

  document.getElementById("emiResult").innerHTML =
    "Your EMI is: " + emi.toFixed(2);
}
