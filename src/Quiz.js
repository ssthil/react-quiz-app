// @ts-ignore
import React, { Component } from 'react';
import {
  Card,
  CardContent,
  Container,
  CssBaseline,
  Typography,
  Grid,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
/** components */
import {
  Header,
  Answers,
  ActionButton,
  ScoreCard,
  QuestionCount,
  Timer,
  AnswerCard,
} from './components';
/** style */
import './styles.css';

const API_URL = 'https://api.binance.vision/api/glossaries';

export default class Quiz extends Component {
  state = {
    data: [],
    question: [],
    randomQuestions: [],
    selectedQuestion: 0,
    myAnswer: null,
    options: [],
    seconds: 20,
    score: 0,
    isScoreCardView: false,
    buttonDisabled: true,
    selectedAnswers: [],
    answerOptionDisabled: false,
  };

  componentDidMount() {
    this.getData();
    this.setTimer();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.randomQuestions !== this.state.randomQuestions) {
      this.loadQuizData();
    }
    if (prevState.selectedQuestion !== this.state.selectedQuestion) {
      this.loadQuizData();
    }
  }

  /** get data from api */
  getData = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const results = data;
        const randomQuestions = [];
        for (let i = 0; i < 10; i++) {
          const randomItems =
            results[Math.floor(Math.random() * results.length)];
          randomQuestions.push(randomItems);
        }

        this.setState(() => {
          return {
            randomQuestions,
            data: results,
          };
        });
      });
  };

  /** load quiz data */
  loadQuizData = () => {
    const { data, randomQuestions } = this.state;
    const randomOptions = [];
    for (let i = 0; i < 3; i++) {
      const randomItems = data[Math.floor(Math.random() * data.length)];
      randomOptions.push(randomItems.title);
    }

    const suffleOptions = [
      randomQuestions[this.state.selectedQuestion].title,
      ...randomOptions,
    ].sort(() => Math.random() - 0.5);

    this.setState(() => {
      return {
        question: randomQuestions[this.state.selectedQuestion].excerpt,
        options: suffleOptions,
        answer: randomQuestions[this.state.selectedQuestion].title,
        buttonDisabled: true,
      };
    });
  };

  /** go to next question */
  goToNextQuestion = () => {
    const { myAnswer, answer, score, selectedQuestion } = this.state;
    if (myAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }
    this.setState(prevState => ({
      selectedQuestion: selectedQuestion + 1,
      seconds: 20,
      selectedAnswers: [...prevState.selectedAnswers, { myAnswer, answer }],
      answerOptionDisabled: false,
    }));
  };

  /** check answer */
  checkAnswer(answer) {
    this.setState({
      myAnswer: answer,
      buttonDisabled: false,
      answerOptionDisabled: true,
    });
  }

  /** get score */
  getScore = () => {
    const { myAnswer, answer, score } = this.state;
    if (myAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }
    this.setState(prevState => ({
      selectedAnswers: [...prevState.selectedAnswers, { myAnswer, answer }],
      isScoreCardView: true,
      seconds: 0,
    }));
  };

  /** timer */
  setTimer() {
    setInterval(() => {
      const { seconds } = this.state;
      if (seconds > 0) {
        this.setState({
          seconds: seconds - 1,
        });
      }
    }, 1000);
  }
  /** restart quiz */
  restartQuiz = () => window.location.reload();

  render() {
    const {
      randomQuestions,
      question,
      selectedQuestion,
      options,
      seconds,
      myAnswer,
      score,
      isScoreCardView,
      buttonDisabled,
      answerOptionDisabled,
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          <Header className="alignCenter" title="Quiz App" />
          {!isScoreCardView && (
            <QuestionCount
              selectedQuestion={selectedQuestion}
              randomQuestions={randomQuestions.length}
            />
          )}

          {randomQuestions.length === 0 ? (
            <CircularProgress />
          ) : !isScoreCardView ? (
            <div className="marginTopTwenty">
              <Card>
                <CardContent className="paddingZero">
                  <Typography>{question}</Typography>
                  <div className="marginTopTwenty">
                    {options.map((item, index) => (
                      <Answers
                        item={item}
                        key={index}
                        onClick={() => this.checkAnswer(item)}
                        className={`marginBottomTen marginRightTen buttonWidth ${
                          myAnswer === item ? 'selectedAnswer' : null
                        }`}
                        disabled={seconds === 0 ? true : answerOptionDisabled}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item lg={6} sm={6} xs={12}>
                    <ScoreCard
                      score={score}
                      randomQuestions={randomQuestions}
                    />
                  </Grid>
                  <Grid item lg={6} sm={6} xs={12} className="paddingTopBottom">
                    {this.state.selectedAnswers.map((obj, index) => (
                      <AnswerCard
                        key={index}
                        className={`alignCenter
                      ${
                        obj.myAnswer === obj.answer
                          ? 'correctAnswer'
                          : 'inCorrectAnswer'
                      }`}
                        myAnswer={obj.myAnswer}
                      />
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          <div className={`marginTopTwenty`}>
            {selectedQuestion < randomQuestions.length - 1 && (
              <ActionButton
                color="primary"
                onClick={this.goToNextQuestion}
                disabled={seconds === 0 ? false : buttonDisabled}
                text="Next"
              />
            )}
            {selectedQuestion === randomQuestions.length - 1 &&
              !isScoreCardView && (
                <ActionButton
                  color="secondary"
                  onClick={this.getScore}
                  disabled={buttonDisabled}
                  text="Finish"
                />
              )}
            {isScoreCardView && (
              <ActionButton
                color="primary"
                onClick={this.restartQuiz}
                disabled={false}
                text="Restart"
              />
            )}
          </div>
          {!isScoreCardView && <Timer seconds={seconds} />}
        </Container>
      </React.Fragment>
    );
  }
}
