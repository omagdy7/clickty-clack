import { useState, useEffect, useRef } from 'react'
import WordCard from './components/WordCard'
import dictonary from "../assets/words.json"

function App() {


  const listOfWords = dictonary["listOfWords"]
  const maxHeight = window.innerHeight
  const spawnTime = 2000
  const green = "#09db2f"
  const minX = 200
  const maxX = 1700

  const [words, setWords] = useState([{ word: listOfWords[getRandomInt(0, listOfWords.length - 1)]["word"], posX: getRandomInt(minX, maxX) + "px" }])
  const [curIdx, setCurIdx] = useState(0);
  const [curWord, setCurWord] = useState(null)
  const [isSet, setIsSet] = useState(true)
  const [isGameOver, setIsGameOver] = useState(false)

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const wordsRef = useRef(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWords((prevWords) => {
        const randIdx = getRandomInt(0, listOfWords.length - 1);
        const randX = getRandomInt(minX, maxX) + "px";
        const wordToModify = listOfWords[randIdx]
        const newWord = { ...wordToModify, posX: randX }
        const newWords = [...prevWords, newWord]
        return newWords
      })
    }, spawnTime)

    const checkGameOver = setInterval(() => {
      if (wordsRef.current) {
        const currentRef = wordsRef.current;
        const children = [...currentRef.children];
        const closestElement = children.reduce((highest, current) => {
          return current.top > highest.top ? current : highest;
        }, children[0])
        if (closestElement) {
          const topValue = parseInt(closestElement.style.top, 10)
          if (topValue > maxHeight - 48) {
            setIsGameOver(true)
          }
        }
      }
    }, 200)


    return () => {
      clearInterval(intervalId)
      clearInterval(checkGameOver)
    };
  }, []);


  useEffect(() => {

    const handleKeyPress = (event) => {
      const key = event.key;
      console.log(curIdx)
      if (wordsRef.current) {
        if (isSet) {
          const currentRef = wordsRef.current;
          const children = [...currentRef.children];
          const validElements = children.filter((item) => item.children[0].children[0].innerText === key && !item.classList.contains('animate-fade'))
          const closestElement = validElements.reduce((highest, current) => {
            return current.top > highest.top ? current : highest;
          }, validElements[0])
          setCurWord(closestElement);
          if (closestElement) {
            const curSpan = closestElement.children[0].children[0]
            if (curSpan.innerText === key) {
              curSpan.style.color = green
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
            console.log("char: ", curSpan.innerText, "key: ", key)
            if (curSpan.innerText === key) {
              curSpan.style.color = green
              setCurIdx((idx) => idx + 1)
              if (curIdx === lenWord - 1) {
                console.log(curIdx, lenWord - 1)
                curWord.classList.toggle('animate-fade')
                setTimeout(() => {
                  curWord.parentNode.removeChild(curWord)
                }, 1000)
                setIsSet(true)
                setCurIdx(0)
              }
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
      {!isGameOver ? (
        words.map((word, idx) => {
          return (
            <WordCard key={idx} word={word["word"]} kind={"normal"} posX={word.posX} intialPosY="0px" id={idx} />
          )
        })) : (<div></div>)
      }
    </div>
  )
}

export default App
