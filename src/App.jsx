import { useState, useEffect, useRef } from 'react'
import WordCard from './components/WordCard'
import { document } from 'postcss'

function App() {

  const wordsRef = useRef(null)

  const listOfWords = [
    {
      word: "china",
      posX: "0px"
    },
    {
      word: "botswana",
      posX: "0px"
    },
    {
      word: "iceland",
      posX: "0px"
    },
    {
      word: "australia",
      posX: "0px"
    },
    {
      word: "germany",
      posX: "0px"
    },
    {
      word: "egypt",
      posX: "0px",
    },
    {
      word: "cool",
      posX: "0px",
    },
    {
      word: "warm",
      posX: "0px",
    },
    {
      word: "random",
      posX: "0px",
    },
    {
      word: "glamorous",
      posX: "0px",
    },
  ]

  const [words, setWords] = useState([{ word: "word", posX: getRandomInt(0, 1700) + "px" }])

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


  useEffect(() => {
    // Function to handle key presses
    const handleKeyPress = (event) => {
      const key = event.key;
      console.log("key pressed = ", key);
      if (wordsRef.current) {
        const currentRef = wordsRef.current;
        const children = [...currentRef.children];
        const validElements = children.filter((item) => item.textContent[0] === key)
        const closestElement = validElements.reduce((highest, current) => {
          return current.top > highest.top ? current : highest;
        }, validElements[0])
        console.log(closestElement);
        closestElement.style.color = 'green'
      }
      // Check if a specific key is pressed
      if (event.key === 'Enter') {
        // Perform an action when the Enter key is pressed
        console.log('Enter key pressed');
      }
    };


    const intervalId = setInterval(() => {
      setWords((prevWords) => {
        const randIdx = getRandomInt(0, listOfWords.length - 1);
        const randX = getRandomInt(200, 1700) + "px";
        const wordToModify = listOfWords[randIdx]
        const newWord = { ...wordToModify, posX: randX }
        const newWords = [...prevWords, newWord]
        return newWords
      })
    }, 1500)

    // Add the event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(intervalId)
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount


  return (
    <div ref={wordsRef}>
      {
        words.map((word, idx) => {
          return (
            <WordCard key={idx} word={word.word} kind={"normal"} posX={word.posX} intialPosY="0px" id={idx + ""} />
          )
        })
      }
    </div>
  )
}

export default App
