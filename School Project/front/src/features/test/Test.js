import { useState } from "react";
import { useDispatch } from "react-redux"
import { addTestAction } from "./Test.Slice";

export const Test = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch()
  const [test, setTest] = useState({
    name: "",
    questions: [
      {
        id: 101,
        text: "what will be the result of 2+2",
        answers: [
          { id: 10001, text: "4", correct: true },
          { id: 10002, text: "43", correct: false },
          { id: 10003, text: "22", correct: false },
        ],
      },
      {
        id: 102,
        text: "what will be the result in js  4&2",
        answers: [
          { id: 101, text: "4", correct: false },
          { id: 102, text: "2", correct: true },
          { id: 103, text: "NaN", correct: false },
        ],
      },
      {
        id: 103,
        text: "what will be 1  0  3",
        answers: [
          { id: 101, text: "1", correct: true },
          { id: 102, text: "0", correct: false },
          { id: 103, text: "3", correct: false },
        ],
      },
    ],
  });

  const handleSave = () => {
    let question = test.questions.every((e) => Boolean(e.text));
    let answers = test.questions.every((elm) =>
      elm.answers.every((e) => e.text.length)
    );
    let answersLentgh = test.questions.every((elm) => elm.answers.length > 1);
    switch (true) {
      case !answersLentgh:
        setError("the number of answers should not be less than");
        break;
      case test.name.length && question && answers:
        dispatch(addTestAction(test))
        setError("");
        break;
      default:
        setError("Fill in the blank field.");
    }
  };
  const handelAdd = () => {
    setTest({
      ...test,
      questions: [{ id: Math.ceil(Math.random() * 9999), text: "", answers: [] }, ...test.questions],
    });
  };
  const addAnswer = (id) => {
    let quest = {...test.questions.find((elm) => elm.id === id)}
    quest.answers.push({
      id: Math.ceil(Math.random() * 9999),
      text: "",
      correct: false,
    });
    setTest({ ...test });
  };

  const update = (quest, val) => {
    quest.text = val;
    setTest({ ...test });
  };
  const handelDelete = (id) => {
    // console.log(id);
    setTest({ ...test, questions: test.questions.filter((e) => e.id !== id) });
  };

  const handleCorrect = (ans) => {
    // console.log(ans);
    ans.correct = !ans.correct;
    setTest({ ...test });
  };

  const handleDeleteAnswer = (quest, id) => {
    let temp = quest.answers.findIndex((elm) => elm.id == id);
    quest.answers.splice(temp, 1);
    setTest({ ...test });
  };

  const handleCopyQuest = (quest) => {
    let temp = { ...quest, id: Math.ceil(Math.random() * 9999), answers:[...quest.answers] };
    // console.log(temp)
    setTest({ ...test, questions: [temp, ...test.questions] });
  };

  return (
    <div>
      <h1>Test</h1>
      <input
        type="text"
        value={test.name}
        onChange={(e) => setTest({ ...test, name: e.target.value })}
      />
      <button onClick={() => handleSave()} className="btn btn-success">
        Save test
      </button>
      <button onClick={() => handelAdd()} className="btn btn-dark">
        add question
      </button>
      {error && <p className="text-danger">{error}</p>}
      {test.questions.map((quest) => {
        return (
          <div key={quest.id} className="alert alert-dark my-4 p-4">
            <button
              onClick={() => addAnswer(quest.id)}
              className="btn btn-info"
            >
              +
            </button>
            <button
              onClick={() => handelDelete(quest.id)}
              className="btn btn-danger"
            >
              x
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleCopyQuest(quest)}
            >
              <i className="fas fa-copy"></i>
            </button>
            <input
              value={quest.text}
              className="form-control"
              onChange={(e) => update(quest, e.target.value)}
            />
            <div>
              <label>Answers:</label>
              {quest.answers.map((ans) => {
                return (
                  <div key={ans.id}>
                    <input
                      onDoubleClick={() => handleCorrect(ans)}
                      onChange={(e) => update(ans, e.target.value)}
                      value={ans.text}
                      className={ans.correct && "bg-success my-2"}
                    />
                    <button
                      onClick={() => handleDeleteAnswer(quest, ans.id)}
                      className=" btn btn-danger"
                    >
                      x
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
