import React, { useState } from "react";
import "./api.css";
import CopyButton from "../../Utils/Copy Button/CopyButton";
import { showErrMsg } from "../../Utils/Notification/Notification";

const Api = () => {
  const [amount, setAmount] = useState("10");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [err, setErr] = useState();
  const [showUrl, setshowUrl] = useState(false);
  const [url, setUrl] = useState(
    `https://quizry.herokuapp.com/api/amount=${amount}${category}${difficulty}${type}`
  );

  const onDataChange = () => {
    if (amount > 30) {
      return setErr("Maximum limit of amount is 30");
    }
    setUrl(
      `${process.env.CLIENT_URL}api/amount=${amount}${
        (category || difficulty || type) && "?"
      }${category && `category=${category}`}${
        !category && difficulty ? `difficulty=${difficulty}` : ""
      }${category && difficulty && `&difficulty=${difficulty}`}${
        type && (category || difficulty) && `&type=${type}`
      }${type && !category && !difficulty ? `type=${type}` : ""}
      `
    );
    setshowUrl(true);
  };

  return (
    <div className="api-container contribute-page bg-gradient">
      <div className="all-questions api-page">
        <h1>API</h1>
        <p>
          Simply select the parameters ,copy the generated api link below and
          use anywhere you want to get trivia questions!
        </p>
        <div className="question-form api-form">
          {err && showErrMsg(err)}
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            name="amount"
            defaultValue="10"
            min="1"
            value={amount}
            max="30"
            onChange={(e) => {
              if (e.target.value > 30) {
                setErr("Maximum limit of amount is 30");
              } else {
                setErr();
              }
              setAmount(e.target.value);
            }}
          />

          <label htmlFor="difficulty">Difficulty:</label>
          <select
            name="difficulty"
            id="difficulty"
            required
            defaultValue="Select a difficulty"
            onChange={(e) => {
              setDifficulty(`${e.target.value}`);
            }}
          >
            <option value="Select a difficulty" disabled hidden>
              Any
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            id="category"
            required
            defaultValue="default"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="default" disabled hidden>
              Any
            </option>
            <option value="General Knowledge">General Knowledge</option>
            <option value="Politics">Politics</option>
            <option value="Technology">Technology</option>
            <option value="History">History</option>
            <option value="Celebrities">Celebrities</option>
            <option value="Economy">Economy</option>
            <option value="Geography">Geography</option>
            <option value="Sports">Sports</option>
            <option value="Science">Science</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Food&Drink">Food&Drink</option>
            <option value="Animals">Animals</option>
            <option value="Art and Literature">Animals</option>
            <option value="Kids">Kids</option>
          </select>
          <label htmlFor="type">Type:</label>
          <select
            name="type"
            id="type"
            required
            defaultValue="type"
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option value="type" disabled hidden>
              Any
            </option>
            <option value="Multiple">Multiple</option>
            <option value="True/False">True/False</option>
          </select>
          <button onClick={() => onDataChange()} id="url-btn">
            Generate Url
          </button>
        </div>
        {showUrl && (
          <div id="url-input">
            <input type="text" value={url.trim()} id="url" />
            <CopyButton text={url.trim()} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Api;
