import { createUseStyles } from "react-jss";

export const homeLoanStyles = createUseStyles({
  inputContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
  },
  inputNumber: {
    width: "100%",
    padding: "8px",
    marginBottom: "12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#45a049",
    },
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
  },
  th: {
    padding: "8px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f2f2f2",
  },
  td: {
    padding: "8px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  },
});
