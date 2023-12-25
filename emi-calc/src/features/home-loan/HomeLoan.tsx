import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: "20px",
    backgroundColor: "#f4f4f4",
  },
  h1: {
    textAlign: "center",
    marginBottom: "20px",
  },
  inputContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  outputContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    "& th, & td": {
      padding: "8px",
      textAlign: "center",
      borderBottom: "1px solid #ddd",
    },
    "& th": {
      backgroundColor: "#f2f2f2",
    },
  },
});

interface IEmiRow {
  installmentNumber: number;
  monthBeginningLoan: number;
  currentEmiAmount: number; // calc based on tenure, if user gives leave it
  extraMoneyPaid: number;
  interestPaidToBank: number;
  principalPaidToBank: number;
  outstandingLoan: number;
  currentInterest: number;
}

export const HomeLoan = () => {
  const classes = useStyles();

  const [loanTakenInp, setLoanTakenInp] = useState(6000000);
  const [initialInterestPercentInp, setInitialInterestPercentInp] = useState(9);
  const [tenureInMonthsInp, setTenureInMonthsInp] = useState<number | null>(
    360
  );
  const [emiAmountInp, setEmiAmountInp] = useState<null | number>(null);

  const [emiRows, setEmiRows] = useState<IEmiRow[]>([]);

  const emptyRowData: IEmiRow = {
    currentEmiAmount: 0,
    currentInterest: 0,
    extraMoneyPaid: 0,
    installmentNumber: 0,
    interestPaidToBank: 0,
    monthBeginningLoan: 0,
    outstandingLoan: 0,
    principalPaidToBank: 0,
  };

  // on input change effect.
  useEffect(() => {
    const emiRows: IEmiRow[] = [];

    //600 -- 50yrs
    for (let i = 0; i < 600; i++) {
      emiRows.push({ ...emptyRowData });
    }

    let calcEmi = emiAmountInp;
    // let calcMonths = tenureInMonthsInp;

    if (tenureInMonthsInp) {
      // if user gives tenure, calc monthly emi based on tenure
      calcEmi = calculateEMIAmountFromTenure(
        loanTakenInp,
        initialInterestPercentInp,
        tenureInMonthsInp
      );
    }
    // else if (emiAmountInp) {
    //   // if use gives a fixed emi
    //   calcMonths = calculateTenureFromEmiAmount(
    //     loanTakenInp,
    //     initialInterestPercentInp,
    //     emiAmountInp
    //   );
    // } else {
    //   alert("Enter either Tenure or Emi f your choice");
    //   return;
    // }

    // From emi amount calculate

    if (calcEmi) {
      let installmentMonth = 0;
      let outstandingLoan = loanTakenInp; // take it from the cell

      while (outstandingLoan > 0) {
        const currentMonthInterest = initialInterestPercentInp / 100 / 12;
        const interestAmount = outstandingLoan * currentMonthInterest;
        let principal = calcEmi - interestAmount;
        if (principal > outstandingLoan) {
          principal = outstandingLoan;
        }
        outstandingLoan = outstandingLoan - principal;
        emiRows[installmentMonth] = {
          installmentNumber: installmentMonth,
          monthBeginningLoan: outstandingLoan + principal,
          currentEmiAmount: calcEmi,
          extraMoneyPaid: 0,
          interestPaidToBank: interestAmount,
          principalPaidToBank: principal,
          currentInterest: initialInterestPercentInp,
          outstandingLoan,
        };
        installmentMonth++;
      }
      setEmiRows(emiRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    emiAmountInp,
    tenureInMonthsInp,
    initialInterestPercentInp,
    loanTakenInp,
  ]);

  //   function updateRows(oldEmiRows: IEmiRow[]) {
  //     let currentRecordEmi = emiAmountInp;
  //     if (tenureInMonthsInp) {
  //       currentRecordEmi = calculateEMIAmountFromTenure(
  //         loanTakenInp,
  //         initialInterestPercentInp,
  //         tenureInMonthsInp
  //       );
  //     }
  //     let installmentMonth = 0;
  //     let outstandingLoan = loanTakenInp;
  //     const newEmiRows: IEmiRow[]=[];

  //     while (outstandingLoan > 0) {
  //       if (tenureInMonthsInp) {
  //         // if user has tenure restricted based on that, outstanding amount interest calc
  //         currentRecordEmi = calculateEMIAmountFromTenure(
  //           outstandingLoan,
  //           oldEmiRows[installmentMonth].currentInterest,
  //           tenureInMonthsInp
  //         );
  //       } else {
  //         currentRecordEmi = emiAmountInp; // just what user wants to pay
  //       }

  //       const currentMonthInterest =
  //         oldEmiRows[installmentMonth].currentInterest / 100 / 12;
  //       const interestAmount = outstandingLoan * currentMonthInterest;
  //       let principal = currentRecordEmi - interestAmount;
  //       if (principal > outstandingLoan) {
  //         principal = outstandingLoan;
  //       }
  //       outstandingLoan = outstandingLoan - principal;
  //       outstandingLoan = outstandingLoan - oldEmiRows[installmentMonth].extraMoneyPaid;
  //       newEmiRows.push({
  //         // installmentNumber: installmentMonth,
  //         // monthBeginningLoan: outstandingLoan + principal,
  //         // currentEmiAmount: calcEmi,
  //         // extraMoneyPaid: 0,
  //         // interestPaidToBank: interestAmount,
  //         // principalPaidToBank: principal,
  //         // currentInterest: initialInterestPercentInp,
  //         // outstandingLoan,
  //       });
  //       installmentMonth++;

  //     }
  //   }

  function updateSubsequentRows(
    oldEmiRows: IEmiRow[],
    updatedRowIndex: number
  ) {
    let outstandingLoan = oldEmiRows[updatedRowIndex].monthBeginningLoan; // take it from the cell

    for (let i = updatedRowIndex; i < 600; i++) {
      const rowData = oldEmiRows[updatedRowIndex];
      const newEmi = rowData.currentEmiAmount;
      if (outstandingLoan > 0) {
        const currentMonthInterest = rowData.currentInterest / 100 / 12;
        const interestAmount = outstandingLoan * currentMonthInterest;
        let principal = newEmi - interestAmount;
        if (principal > outstandingLoan) {
          principal = outstandingLoan;
        }
        outstandingLoan = outstandingLoan - principal;
        if (rowData.extraMoneyPaid > outstandingLoan) {
          rowData.extraMoneyPaid = outstandingLoan;
        }
        outstandingLoan = outstandingLoan - rowData.extraMoneyPaid;
        oldEmiRows[i] = {
          installmentNumber: i,
          monthBeginningLoan: rowData.monthBeginningLoan,
          currentEmiAmount: newEmi,
          extraMoneyPaid: rowData.extraMoneyPaid,
          interestPaidToBank: interestAmount,
          principalPaidToBank: principal,
          currentInterest: rowData.currentInterest,
          outstandingLoan,
        };
      } else {
        oldEmiRows[i] = { ...emptyRowData };
      }
    }

    setEmiRows(oldEmiRows);
  }

  function calculateEMIAmountFromTenure(
    loanAmount: number,
    interestPercent: number,
    months: number
  ) {
    const monthlyInterestRate = interestPercent / 100 / 12;
    const emi =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, months)) /
      (Math.pow(1 + monthlyInterestRate, months) - 1);
    return emi;
  }

  //   function calculateTenureFromEmiAmount(
  //     loanAmount: number,
  //     interestPercent: number,
  //     emiAmount: number
  //   ) {
  //     const monthlyInterestRate = interestPercent / 100 / 12;
  //     const months =
  //       Math.log(emiAmount / (emiAmount - loanAmount * monthlyInterestRate)) /
  //       Math.log(1 + monthlyInterestRate);
  //     return Math.ceil(months);
  //   }

  function onChangeAdditionalAmount(month: number, amount: number) {
    // emiDetail[month - 1].additionalAmountPaid = amount;
    // setEmiRows(emiDetail);
    const emiDetail = emiRows?.map((row) => {
      if (row.installmentNumber >= month) {
        return {
          ...row,
          extraMoneyPaid: amount,
        };
      }
      return { ...row };
    });
    updateSubsequentRows(emiDetail, month);
  }

  function onChangeInterest(month: number, newInterest: number) {
    const emiDetail = emiRows?.map((row) => {
      if (row.installmentNumber >= month) {
        return {
          ...row,
          currentInterest: newInterest,
        };
      }
      return { ...row };
    });
    // setEmiRows(emiDetail ?? []);
    updateSubsequentRows(emiDetail, month);
  }

  return (
    <div className={classes.body}>
      <h1 className={classes.h1}>Home Loan EMI Calculator</h1>

      <div className={classes.inputContainer}>
        <label htmlFor="loanAmount">Loan Amount:</label>
        <input
          type="number"
          id="loanAmount"
          placeholder="Enter Loan Amount"
          value="6000000"
        />

        <label htmlFor="interestRate">Interest Rate (%):</label>
        <input
          type="number"
          id="interestRate"
          placeholder="Enter Interest Rate"
          value="9"
        />

        <label htmlFor="tenure">Tenure (months):</label>
        <input
          type="number"
          id="tenure"
          placeholder="Enter Tenure (optional)"
          value="360"
        />

        <label htmlFor="emiAmount">Desired EMI Amount:</label>
        <input
          type="number"
          id="emiAmount"
          placeholder="Enter Desired EMI Amount"
        />

        <button onClick={() => {}}>Generate Table</button>
      </div>

      {/* <div>
        Computed Stuff:
        <br />
        <br />
        Emi Amount Final: {calcEmiAmount.toFixed(0)}
        <br />
        Months Amount Final: {calcMonths.toFixed(0)}
      </div> */}
      <br />

      <div className={classes.outputContainer}>
        <h2>EMI Details</h2>
        <table className={classes.table}>
          <tr>
            <th>Installment Number</th>
            <th>Beginning Loan</th>
            <th>EMI</th>
            <th>Extra Money Paid</th>
            <th>Interest Paid</th>
            <th>Principal Paid</th>

            <th>Interest %</th>
            <th>Remaining Loan</th>
          </tr>
          <tbody>
            {emiRows?.map((detail, index) => (
              <tr key={index}>
                <td>{detail.installmentNumber + 1}</td>
                <td>
                  {detail.monthBeginningLoan.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>{detail.currentEmiAmount.toFixed(2)}</td>
                <td>
                  <input
                    value={detail.extraMoneyPaid}
                    type="number"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!Number.isNaN(val)) {
                        onChangeInterest(detail.installmentNumber, Number(val));
                      }
                    }}
                  />
                </td>
                <td>{detail.interestPaidToBank.toFixed(2)}</td>
                <td>{detail.principalPaidToBank.toFixed(2)}</td>
                <td>
                  <input
                    value={detail.currentInterest}
                    type="number"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!Number.isNaN(val)) {
                        onChangeAdditionalAmount(
                          detail.installmentNumber,
                          Number(val)
                        );
                      }
                    }}
                  />
                </td>
                <td>{detail.outstandingLoan.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
