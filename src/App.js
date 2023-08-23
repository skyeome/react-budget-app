import "./App.css";
import React, { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Alert from "./components/Alert";
import { useEffect } from "react";
import { useRef } from "react";

const App = () => {
  const timerRef = useRef(null);
  const [expenses, setExpenses] = useState([
    { id: 1, charge: "렌트비", amount: 1600 },
    { id: 2, charge: "교통비", amount: 400 },
    { id: 3, charge: "식비", amount: 1200 },
  ]);

  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState(0);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", text: "" });

  const clearItems = () => {
    setExpenses([]);
  };

  const handleEdit = (id) => {
    const expense = expenses.find((item) => item.id === id);
    setCharge(expense.charge);
    setAmount(expense.amount);
    setEdit(true);
    setId(id);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    timerRef.current = setTimeout(() => {
      setAlert({ show: false, type: "", text: "" });
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        // 수정 할 요소에 id를 가진 객체는 charge, amount를 변경한다.
        // 그렇지 않은 요소는 그대로 리턴한다.
        const newExpenses = expenses.map((item) =>
          item.id === id ? { ...item, charge, amount } : item
        );
        setExpenses(newExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "성공적으로 수정되었습니다." });
      } else {
        // expenses state에 새로운 객체를 만들어서 추가해주기, setExpenses
        // state를 업데이트 할 때는 항상 불변성을 지켜줘야 합니다.
        // 불변성을 지킨다는 말은 이전에 있던 값을 건드리지 X, 새로운 값을 만들어서 교체

        // 새로운 객체 생성
        const newExpense = { id: crypto.randomUUID(), charge, amount };
        const newExpenses = [...expenses, newExpense];
        setExpenses(newExpenses);
        handleAlert({ type: "success", text: "성공적으로 등록되었습니다." });
      }
      setCharge("");
      setAmount(0);
    } else {
      handleAlert({
        type: "danger",
        text: "지출 비용은 빈 값일 수 없으며, 비용은 0 이상이어야 합니다.",
      });
    }
  };

  const handleDelete = (id) => {
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(newExpenses);
  };
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  const handleAmount = (e) => {
    setAmount(e.target.valueAsNumber);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <main className="main-container">
      {alert.show ? <Alert type={alert.type} text={alert.text} /> : null}

      <h1>예산 계산기</h1>

      <div style={{ width: "100%", backgroundColor: "white", padding: "1rem" }}>
        <ExpenseForm
          charge={charge}
          handleCharge={handleCharge}
          amount={amount}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
      </div>
      <div style={{ width: "100%", backgroundColor: "white", padding: "1rem" }}>
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </div>
      <div
        style={{ display: "flex", justifyContent: "end", marginTop: "1rem" }}
      >
        <p style={{ fontSize: "2rem" }}>
          총 지출: {expenses.reduce((acc, cur) => acc + cur.amount, 0)}
          <span>원</span>
        </p>
      </div>
    </main>
  );
};
export default App;
