import React, { Component } from 'react';
import axios from 'axios';
import "./JokeList.css";
import Joke from './Joke';
import { v4 as uuidv4 } from "uuid";

class JokeList extends Component {
    static defaultProps = {
        numJokesToGet:10
    };
    constructor(props) {
        super(props);
        this.state = {jokes:JSON.parse(window.localStorage.getItem("jokes") || "[]"),
        loading:false
      };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
      if(this.state.jokes.length === 0) this.getJokes();
    }

    async getJokes(){
      let jokes = [];
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        jokes.push({ id: uuidv4(), text: res.data.joke, votes: 0 });
      }
      this.setState(
        (st) => ({
          jokes: [...st.jokes, ...jokes],
        }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
      window.localStorage.setItem("jokes", JSON.stringify(jokes));
      }

    handleVote(id,delta){
        this.setState(st => ({
            jokes:st.jokes.map(j => 
                j.id === id ? {...j, votes: j.votes + delta} : j
            )
        }),
        () => window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes))
        );
    }

    handleClick(){
      this.setState({loading:true},this.getJokes);
    }

    render() {
        return (
          <div className="JokeList">
            <div className="JokeList-sidebar">
              <h1 className="JokeList-title">
                <span>Dad</span> Jokes
              </h1>
              <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"/>
              <button className="JokeList-getmore" onClick={this.handleClick}>
                Fetch Jokes
              </button>
            </div>
            <div className="JokeList-jokes">
              {this.state.jokes.map((j) => (
                <Joke
                  key={j.id}
                  votes={j.votes}
                  text={j.text}
                  upvote={() => this.handleVote(j.id, 1)}
                  downvote={() => this.handleVote(j.id, -1)}
                />
              ))}
            </div>
          </div>
        );
    }
}

export default JokeList;
