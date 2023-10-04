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
  const [curIdx, setCurIdx] = useState(0);
  const [curWord, setCurWord] = useState(null)
  const [isSet, setIsSet] = useState(true)

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


  useEffect(() => {
    const intervalId = setInterval(() => {
      setWords((prevWords) => {
        const randIdx = getRandomInt(0, listOfWords.length - 1);
        const randX = getRandomInt(200, 1700) + "px";
        const wordToModify = listOfWords[randIdx]
        const newWord = { ...wordToModify, posX: randX }
        const newWords = [...prevWords, newWord]
        return newWords
      })
    }, 1000)


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
          const validElements = children.filter((item) => item.children[0].children[curIdx].innerText === key)
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
          setIsSet(false)
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
            console.log(curIdx, lenWord);
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
            <WordCard key={idx} word={word.word} kind={"normal"} posX={word.posX} intialPosY="0px" id={idx + ""} />
          )
        })
      }
    </div>
  )
}

export default App
