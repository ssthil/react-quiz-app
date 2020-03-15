// import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from 'react';
import './styles.css';

/** components */
import { Header } from './components/Header';
import { ActionButton } from './components/Button';

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

  getData = () => {
    fetch('https://api.binance.vision/api/glossaries')
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

  goToNextQuestion = () => {
    const { myAnswer, answer, score, selectedQuestion } = this.state;
    if (myAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }
    this.setState({
      selectedQuestion: selectedQuestion + 1,
      seconds: 20,
    });
  };

  checkAnswer(answer) {
    this.setState({
      myAnswer: answer,
      buttonDisabled: false,
    });
  }

  getScore = () => {
    this.setState({
      score: this.state.score + 1,
      isScoreCardView: true,
    });
  };

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
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          <Header className="alignCenter" title="Quiz App" />
          {!isScoreCardView && (
            <Typography variant="subtitle1" className="alignCenter">
              Question {selectedQuestion + 1} of {randomQuestions.length}
            </Typography>
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
                      <Button
                        variant="outlined"
                        size="medium"
                        color="default"
                        key={index}
                        onClick={() => this.checkAnswer(item)}
                        className={`marginBottomTen marginRightTen buttonWidth ${
                          myAnswer === item ? 'selectedAnswer' : null
                        }`}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="scoreContainer alignCenter">
              <Typography variant="subtitle1">Your score is</Typography>
              <Typography variant="h3">
                {score}/{randomQuestions.length}
              </Typography>
            </div>
          )}
          <div className={`marginTopTwenty`}>
            {selectedQuestion < randomQuestions.length - 1 && (
              <ActionButton
                color="primary"
                onClick={this.goToNextQuestion}
                disabled={buttonDisabled}
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
                color="secondary"
                onClick={this.restartQuiz}
                disabled={false}
                text="Restart"
              />
            )}
          </div>
          {!isScoreCardView && (
            <div className="marginTopTwenty">
              <Typography
                variant="subtitle1"
                className={`alignCenter ${
                  this.state.seconds < 10 ? 'redColor' : 'default'
                }`}
              >
                Time Remaining:
                <span className="boldText">
                  00:{seconds >= 10 ? seconds : `0${seconds}`}
                </span>
              </Typography>
            </div>
          )}
        </Container>
      </React.Fragment>
    );
  }
}
