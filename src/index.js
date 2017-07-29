import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function WordCell (props) {
  let classes = 'wordCell'
  if (props.character != ' ') {
    classes += ' subrayado'
  }

  return (
    <span className={classes}>{ props.found ? (props.character) : (<span>&nbsp;</span>) }</span>
  )
}

function WordContainer(props) {
  const word = props.gameWord
  const list = word.map( (char) => {
    return <WordCell character={char.character} found={char.found}/>
  })

  return (
    <div>
      {list}
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gameWord : [],
      isGameStarted : false,
      triesRemaining : 5,
    }

    this.updateWord = this.updateWord.bind(this)
    this.toggleGameStatus = this.toggleGameStatus.bind(this)
    this.tryGuessWord = this.tryGuessWord.bind(this)
  }

  updateWord(event){
    const newWord = event.target.value
    let wordArray = []
    newWord.toUpperCase().split("").map( (character) => {
      wordArray.push( {character: character, found : false})
    })
    this.setState({ gameWord : wordArray })
  }

  tryGuessWord(event){
    if (event.charCode === 13) {
      const word = event.target.value.toUpperCase()
      const gameWord = this.state.gameWord
      const triesRemaining = this.state.triesRemaining
      let found = false

      gameWord.filter( wordObj => {
        if (wordObj.character == word) {
          found = true
          wordObj.found = true;
        }
      })

      if (found) {
        this.setState({gameWord : gameWord})
      } else {
        this.setState({ triesRemaining : triesRemaining - 1 })
      }

      if (this.state.triesRemaining == 0) {
        event.target.blur()
      }
      event.target.value = ''
    }
  }

  toggleGameStatus() {
    const isStarted = this.state.isGameStarted
    if (this.state.isGameStarted) {
        this.setState({ gameWord : [], triesRemaining: 5 })
    }
    this.setState({ isGameStarted : !isStarted })
  }

  render() {
    return (
      <div>
        <WordContainer gameWord={this.state.gameWord} />
        <h4>{this.state.triesRemaining} tries remaining</h4>
        <br/>
        {
          !this.state.isGameStarted ?
            (<input type="text" onChange={this.updateWord}></input>)
            : ('')
        }
        <br/>
        <button onClick={this.toggleGameStatus}> { this.state.isGameStarted ?  ('Restart') : ('Start') } </button>
        {
          !this.state.isGameStarted ? ('') : (
            <div>
              <h4>{this.state.triesRemaining !== 0 ? ('Try guessing') : ('You lose!')}</h4>
              <input disabled={this.state.triesRemaining == 0} maxLength={1} onKeyPress={this.tryGuessWord}></input>
            </div>
          )
        }
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('hello')
)
