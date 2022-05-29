import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../Utils/Notification/Notification";
import { useSelector } from "react-redux";
import { RevolvingDot } from "react-loader-spinner";
const initalDataState = {
  question: "",
  category: "",
  difficulty: "",
  type: "",
  options: [],
  correct_option: "",
};

const PostQuestion = () => {
  const [quesType, setQuesType] = useState("");
  const [optionsdd, setOptionsdd] = useState();
  const [loading, setLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState([{}]);
  const [data, setData] = useState(initalDataState);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [searchresults, setSearchresults] = useState();

  const token = useSelector((state) => state.rootReducer.token);
  const setoptionsdd = (e) => {
    const { name, value } = e.target;
    setOptionsdd({ ...optionsdd, [name]: value });
  };

  const onDataChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const sendData = async () => {
    try {
      const { category, correct_option, difficulty, question, type, options } =
        data;
      if (!category || !correct_option || !difficulty || !question || !type) {
        setTimeout(() => {
          setErr();
        }, 2000);
        return setErr("Please fill in all fields.");
      }
      if (type === "True/False") {
        data.options.push("True");
        data.options.push("False");
      }

      optionsdd &&
        Object.entries(optionsdd).forEach(([key, value]) => {
          if (optionsdd[key].trim() === "") {
            return setErr(`Options Can't be empty.`);
          }
          if (!data.options.includes(optionsdd[key]))
            data.options.push(optionsdd[key]);
        });
      if (type === "Multiple" && options.length < 4)
        return setErr("Please fill all options.");
      if (type === "True/False" && options.length < 2)
        return setErr("Please fill all options.");

      if (!category || !correct_option || !difficulty || !question || !type)
        return setErr("Please fill in all fields.");

      setData({ options: [] });
      const res = await axios.post("/user/add_question", data, {
        headers: { Authorization: token },
      });
      setErr();
      getAllQuestions();
      setQuesType("");
      setTimeout(() => {
        setSuccess();
      }, 2000);
      setSuccess(res.data.msg);
      document.getElementById("myForm").reset();
    } catch (err) {
      err.response.data.msg && setErr(err.response.data.msg);
    }
  };

  const getAllQuestions = async () => {
    const res = await axios.get("/user/all_questions");
    setAllQuestions(res.data);
    setLoading(false);
  };
  useEffect(() => {
    try {
      setLoading(true);
      getAllQuestions();
    } catch (err) {}
  }, []);

  return (
    <div className="contribute-page">
      <div className="all-questions question-post">
        <h1>Post Question</h1>
        <p>
          <b>Note:</b> Please search the question before posting it.
        </p>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        <form className="question-form" id="myForm">
          <label htmlFor="question">Question/Statement: </label>
          <input
            type="text"
            name="question"
            onChange={(e) => onDataChange(e)}
            required
          />
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            id="category"
            defaultValue="default"
            required
            onChange={(e) => onDataChange(e)}
          >
            <option value="default" disabled hidden>
              Select a category
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
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            name="difficulty"
            id="difficulty"
            required
            defaultValue="Select a difficulty"
            onChange={(e) => onDataChange(e)}
          >
            <option value="Select a difficulty" disabled hidden>
              Select difficulty
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <label htmlFor="type">Type:</label>
          <select
            name="type"
            id="type"
            required
            defaultValue="type"
            onChange={(e) => {
              setQuesType(e.target.value);
              onDataChange(e);
            }}
          >
            <option value="type" disabled hidden>
              Select type
            </option>
            <option value="Multiple">Multiple</option>
            <option value="True/False">True/False</option>
          </select>
          {quesType === "Multiple" ? (
            <>
              <label htmlFor="Option-1">Option 1: </label>
              <input
                type="text"
                name="Option-1"
                onChange={setoptionsdd}
                required
              />
              <label htmlFor="Option-2">Option 2: </label>
              <input
                type="text"
                name="Option-2"
                onChange={setoptionsdd}
                required
              />
              <label htmlFor="Option-3">Option 3: </label>
              <input
                type="text"
                name="Option-3"
                onChange={setoptionsdd}
                required
              />
              <label htmlFor="Option-4">Option 4: </label>
              <input
                type="text"
                name="Option-4"
                onChange={setoptionsdd}
                required
              />
            </>
          ) : quesType === "True/False" ? (
            <>
              <label htmlFor="correct_option">Choose Correct option:</label>
              <select
                name="correct_option"
                id="correct_option"
                defaultValue="Select an option"
                required
                onChange={(e) => {
                  onDataChange(e);
                  // setoptionsdd(e);
                }}
              >
                <option value="Select an option" disabled hidden>
                  Select an option
                </option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </>
          ) : (
            <></>
          )}
          {quesType === "Multiple" && (
            <>
              <label htmlFor="correct_option">Choose Correct option:</label>
              <select
                name="correct_option"
                id="correct_option"
                defaultValue="doption"
                required
                onChange={(e) => {
                  onDataChange(e);
                }}
              >
                <option value="doption" disabled hidden>
                  Select an option
                </option>
                {optionsdd &&
                  Object.entries(optionsdd).map(([key, value]) => {
                    return (
                      optionsdd[key].trim() !== "" && (
                        <option key={key} value={value}>
                          {optionsdd[key]}
                        </option>
                      )
                    );
                  })}
              </select>
            </>
          )}
        </form>
        <button className="question-post-btn" onClick={sendData}>
          Post
        </button>
      </div>
      <div className="search-ques">
        <div className="searchbar p-user-details postq-searchbar">
          <input
            type="text"
            placeholder="Search a question.."
            id="searchbar"
            onChange={(e) => setSearchresults(e.target.value)}
          />
          <img
            src="https://img.icons8.com/ios-glyphs/30/000000/search--v1.png"
            alt="search"
          />
        </div>
        {loading ? (
          <div className="loader">
            <RevolvingDot
              height="100"
              width="100"
              color="#c01616"
              ariaLabel="loading"
            />
          </div>
        ) : (
          <table className="allusers contributor-list">
            <thead>
              <tr>
                <th>Question/Statement</th>
                {/* <th id="status-head">Status</th>
                <th>Contributor</th> */}
              </tr>
            </thead>
            <tbody>
              {allQuestions.map(
                (q) =>
                  q.question &&
                  (!searchresults ||
                    q.question
                      .toLowerCase()
                      .includes(searchresults.trim().toLowerCase())) && (
                    <tr key={q._id}>
                      <td>{q.question}</td>

                      {/* <td
                        style={
                          q.status === "Accepted"
                            ? {
                                backgroundColor: "rgb(9, 158, 54)",
                                color: "white",
                              }
                            : q.status === "Declined"
                            ? {
                                backgroundColor: "rgb(214, 10, 10)",
                                color: "white",
                              }
                            : { backgroundColor: "Yellow" }
                        }
                      >
                        {q.status}
                      </td>
                      <td>{q.posted_by_name}</td> */}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PostQuestion;
