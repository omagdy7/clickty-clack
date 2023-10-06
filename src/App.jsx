import { useState, useEffect, useRef } from 'react'
import WordCard from './components/WordCard'
import typeclick from './assets/mixkit-typewriter-hard-hit-1367.wav'
import returnClick from './assets/mixkit-typewriter-classic-return-1381.wav'
import bgMusic from './assets/background_music.mp3'
import dictonary from "./assets/words.json"

function App() {
  // Constants
  const listOfWords = dictonary["listOfWords"]
  const rightCharColor = "#0284c7"
  const shadowBoxColor = "#06b6d4"
  const normalCharColor = "rgba(139,69,19,0.5)"
  const maxHeight = window.innerHeight
  const minX = 200
  const maxX = 1600
  const spawnTime = 2000
  const click = new Audio(typeclick)
  const finishClick = new Audio(returnClick)

  // States
  const [words, setWords] = useState([{ word: listOfWords[getRandomInt(0, listOfWords.length - 1)]["word"], posX: getRandomInt(minX, maxX) + "px" }])
  const [curIdx, setCurIdx] = useState(0);
  const [curWord, setCurWord] = useState(null)
  const [isSet, setIsSet] = useState(true)
  const [isGameOver, setIsGameOver] = useState(false)
  const wordsRef = useRef(null)

  // Helper function
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


  // play background music
  useEffect(() => {
    const gameLoopMusic = new Audio(bgMusic)
    gameLoopMusic.loop = true;
    gameLoopMusic.play()

    return () => {
      gameLoopMusic.pause();
      gameLoopMusic.currentTime = 0;
    }
  }, [])

  // handle spawning and checks if game is over
  useEffect(() => {
    // spawn a word after spawnTime
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

    // Checks if the game is over duh...
    const checkGameOver = setInterval(() => {
      if (wordsRef.current) {
        const currentRef = wordsRef.current;
        const children = [...currentRef.children];
        const closestElement = children.reduce((highest, current) => {
          return current.top > highest.top ? current : highest;
        }, children[0]) // get the closese element from the bottom
        if (closestElement) {
          const topValue = parseInt(closestElement.style.top, 10)
          if (topValue > maxHeight - 48) { // 48 is hardcoded which is bad figure out how to make it depends of the window size
            setIsGameOver(true)
          }
        }
      }
    }, 200)

    // clean up
    return () => {
      clearInterval(intervalId)
      clearInterval(checkGameOver)
    };
  }, []);

  // handle keypresses
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      click.play()
      if (key === 'Backspace') {
        if (curWord) {
          setCurIdx((idx) => Math.max(0, idx - 1))
          if (curIdx - 1 === 0) {
            setIsSet(true)
            setCurWord(null)
            curWord.style.boxShadow = "none"
            curWord.style.borderColor = "black"
          }
          const curSpan = curWord.children[0].children[curIdx - 1]
          curSpan.style.color = normalCharColor
        }
      }
      if (wordsRef.current) {
        if (isSet) {
          const currentRef = wordsRef.current;
          const children = [...currentRef.children];
          const validElements = children.filter((item) => item.children[0].children[0].innerText === key && !item.classList.contains('animate-fade')) // filter the current words which match key
          const closestElement = validElements.reduce((highest, current) => {
            return current.top > highest.top ? current : highest;
          }, validElements[0]) // get closeest element from bottom
          setCurWord(closestElement);
          if (closestElement) {
            const curSpan = closestElement.children[0].children[0]
            if (curSpan.innerText === key) {
              curSpan.style.color = rightCharColor
              closestElement.style.boxShadow = `0px 0px 8px 7px ${shadowBoxColor}`
              closestElement.style.borderColor = "transparent"
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
              curSpan.style.color = rightCharColor
              setCurIdx((idx) => idx + 1)
              if (curIdx === lenWord - 1) {
                console.log(curIdx, lenWord - 1)
                finishClick.play()
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
