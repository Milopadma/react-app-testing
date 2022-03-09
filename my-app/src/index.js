import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  checkWin(i) {
    if (this.props.match) {
      //initial check if array is undefined
      if (this.props.match.includes(i)) {
        //if array is not undefined, check if i is in array
        return "squareWin"; //if i is in array, then this square is the winning square
      } else {
        return "square"; //else, this square is not the winning square
      }
    } // if array is undefined, everything is normal
    else {
      return "square";
    }
  }

  renderSquare(i) {
    //cant push array to this function as it is required
    //to render the squares initally
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={this.checkWin(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      //if someone has already won or square is already filled, ignore click
      return;
    } else if (calculateWinner(squares) === "tied") {
      this.status = "Tied!";
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O"; //flips between X and O
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, match } = calculateWinner(current.squares) || {};

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner && winner !== "tied") {
      status = "Winner: " + winner;
    } else if (winner === "tied") {
      status = "Game Tied!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            match={match}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], //straight horizontals
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], //straight verticals
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], //diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], match: lines[i] }; //returns the winner, which is the value of the square that passes the above check
    } else if (squares.every((square) => square != null)) {
      return "tied";
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
