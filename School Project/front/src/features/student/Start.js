import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  questionCheckAction,
  setAnswered,
  testIdAction,
} from "../test/Test.Slice";

export const Start = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [answer, setAnswer] = useState(0);
  const test = useSelector((state) => state.test.activeTest);

  useEffect(() => {
    dispatch(testIdAction(id));
  }, []);

  const [finish, setFinish] = useState(false)
  useEffect(()=>{
    setFinish(test?.questions.every(elm => elm.hasBeenAnswered))
  }, [test])

  const checkQuestion = (ans, quest) => {
    dispatch(questionCheckAction({ test: id, quest }))
      .unwrap()
      .then((r) => {

        dispatch(
          setAnswered({ question: quest, selected: ans, right: r.result.id })
        );
        
        if (r.result.id === ans) {
            setAnswer(answer + 1);
        }
    });
  };

  return (
    <div className="col-md-6">
      <h1>Start</h1>
      {test && (
        <>
          {finish && (
            <div className="finish alert alert-dark">
              <p style={{fontSize: "20px"}}>Դուք ավարտեցիք քննությունը</p>
              <p style={{fontSize: "20px"}}>{answer} / 3</p>
              <button onClick={() => setFinish(false)} className="btn btn-outline-warning">Տեսնել արդյունքները</button>
            </div>
          )}
          <h2>
            {test.name} <br/> {answer} / 3
          </h2>
          {test.questions.map((elm, i) => {
            return !elm.hasBeenAnswered ? (
              <div className="alert alert-warning" key={elm.id}>
                <h2>
                  {i + 1}) {elm.text}
                </h2>
                {elm.answers.map((ans) => {
                  return (
                    <div
                      onClick={() => checkQuestion(ans.id, elm.id)}
                      key={ans.id}
                      className="alert alert-dark my-2 p-3"
                    >
                      <label>{ans.text}</label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-dark">
                <p>{i + 1}) {elm.text}</p>
                {elm.answers.map((item) => {
                  return (
                    <p
                      className={
                        " p-3 " +
                        (item.id == elm.correctAnswer
                          ? " bg-success"
                          : item.id == elm.selectedAnswer
                          ? " bg-danger"
                          : " bg-white")
                      }
                      key={item.id}
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
