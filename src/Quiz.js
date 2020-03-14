import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.css';
// import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

export default class Quiz extends Component {
  state = {
    datad: [],
    question: [],
    randomQuestions: [],
    selectedQuestion: 0,
    answer: null,
    options: [],
    seconds: 20,
  };

  componentDidMount() {
    this.getData();

    this.myInterval = setInterval(() => {
      const { seconds } = this.state;
      if (seconds > 0) {
        this.setState({
          seconds: seconds - 1,
        });
      }
    }, 1000);
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
          };
        });
      });
  };

  loadQuizData = () => {
    const { randomQuestions } = this.state;
    const randomOptions = [];
    for(let i=0; i < 3; i++) {
        const randomItems = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
        randomOptions.push(randomItems.title)
    }
    console.log(randomOptions)
    this.setState(() => {
      return {
        question: randomQuestions[this.state.selectedQuestion].excerpt,
        options: [randomQuestions[this.state.selectedQuestion].title, ...randomOptions],
      };
    });
  };

  checkNextQuestion = () => {
    this.setState({
      selectedQuestion: this.state.selectedQuestion + 1,
      seconds: 20,
    });
  };

  handleClick = () => console.log(this.state.options[0]);

  render() {
    const {
      randomQuestions,
      question,
      selectedQuestion,
      options,
      seconds,
    } = this.state;
    console.log(options);
    return (
      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          <h1>Quiz</h1>
          <Typography variant="subtitle1">
            Question {selectedQuestion + 1} of {randomQuestions.length}
          </Typography>
          {randomQuestions.length > 0 ? (
            <div className="marginTopOne">
              <Card>
                <CardContent>
                  <Typography>{question}</Typography>
                </CardContent>
                <CardActions>
                  {options.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onClick={this.handleClick}
                      deleteIcon={<DoneIcon />}
                    />
                  ))}
                </CardActions>
              </Card>
            </div>
          ) : (
            <CircularProgress />
          )}
          <div className="marginTopOne">
            {selectedQuestion < randomQuestions.length - 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={this.checkNextQuestion}
              >
                Next
              </Button>
            )}
            {selectedQuestion === randomQuestions.length - 1 && (
              <Button variant="contained" color="secondary">
                Done
              </Button>
            )}
          </div>

          <div className="marginTopOne">
            <Typography variant="h6">
              Time Remaining:
              <span
                className={this.state.seconds < 10 ? 'redColor' : 'default'}
              >
                00:{seconds >= 10 ? seconds : `0${seconds}`}
              </span>
            </Typography>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}
