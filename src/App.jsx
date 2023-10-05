import { useState, useEffect, useRef } from 'react'
import WordCard from './components/WordCard'
import dictonary from "../assets/words.json"

function App() {

  const wordsRef = useRef(null)

  const [words, setWords] = useState([{ word: "word", posX: getRandomInt(200, 1000) + "px" }])
  const [curIdx, setCurIdx] = useState(0);
  const [curWord, setCurWord] = useState(null)
  const [isSet, setIsSet] = useState(true)

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const listOfWords = dictonary["listOfWords"]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWords((prevWords) => {
        const randIdx = getRandomInt(0, listOfWords.length - 1);
        const randX = getRandomInt(200, 1000) + "px";
        const wordToModify = listOfWords[randIdx]
        const newWord = { ...wordToModify, posX: randX }
        const newWords = [...prevWords, newWord]
        return newWords
      })
      setId((id) => id + 1)
    }, 2000)


    return () => {
      clearInterval(intervalId)
    };
  }, []);


  useEffect(() => {

    const handleKeyPress = (event) => {
      const key = event.key;
      if (wordsRef.current) {
        if (isSet) {
          const currentRef = wordsRef.current;
          const children = [...currentRef.children];
          const validElements = children.filter((item) => item.children[0].children[0].innerText === key)
          const closestElement = validElements.reduce((highest, current) => {
            return current.top > highest.top ? current : highest;
          }, validElements[0])
          setCurWord(closestElement);
          if (closestElement) {
            const curSpan = closestElement.children[0].children[curIdx]
            if (curSpan.innerText === key) {
              curSpan.style.color = 'green'
              setCurIdx((idx) => idx + 1)
            }
          }
          if (validElements.length != 0) {
            setIsSet(false)
          }
        } else {
          if (curWord) {
            const lenWord = curWord.children[0].children.length
            const curSpan = curWord.children[0].children[curIdx]
            if (curSpan.innerText === key) {
              curSpan.style.color = 'green'
              setCurIdx((idx) => idx + 1)
            }
            if (curIdx == lenWord - 1) {
              curWord.parentNode.removeChild(curWord)
              setIsSet(true)
              setCurIdx(0)
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };

  }, [curIdx, isSet]);


  return (
    <div ref={wordsRef}>
      {
        words.map((word, idx) => {
          return (
            <WordCard key={idx} word={word["word"]} kind={"normal"} posX={word.posX} intialPosY="0px" id={idx} />
          )
        })
      }
    </div>
  )
}

export default App
