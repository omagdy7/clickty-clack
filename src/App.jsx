import { useState, useEffect, useRef } from 'react'
import WordCard from './components/WordCard'
import typeclick from './assets/mixkit-typewriter-hard-hit-1367.wav'
import returnClick from './assets/mixkit-typewriter-classic-return-1381.wav'
import timeSlow from './assets/time_stop.mp3'
import bgMusic from './assets/background_music.mp3'
import freezeSound from './assets/freeze.wav'
import fireSound from './assets/fire.wav'
import dictonary from "./assets/words.json"
import TypedKeysDisplay from './components/TypedKeysDisplay'
import RightBar from './components/RightBar'

function App() {
  // Constants
  const listOfWords = dictonary["listOfWords"]
  const rightCharColor = "#0284c7"
  const shadowBoxColor = "#06b6d4"
  const normalCharColor = "#1c0301"
  const maxHeight = window.innerHeight
  const maxWidth = window.innerWidth
  const minX = Math.floor(0.2 * maxWidth)
  const maxX = innerWidth - minX - 60 // 60 magic number!!
  const spawnTime = 2000
  const click = new Audio(typeclick)
  const finishClick = new Audio(returnClick)
  const slowTime = new Audio(timeSlow)
  const freezeEffect = new Audio(freezeSound)
  const fireEffect = new Audio(fireSound)

  click.volume = 0.4
  finishClick.volume = 0.3
  slowTime.volume = 0.5

  // States
  const [words, setWords] = useState([{ word: listOfWords[getRandomInt(0, listOfWords.length - 1)]["word"], posX: getRandomInt(minX, maxX) + "px", kind: "normal", speed: 30 }])
  const [curKind, setCurKind] = useState("normal")
  const [keyStrokes, setKeyStrokes] = useState([])
  const [curIdx, setCurIdx] = useState(0);
  const [curWord, setCurWord] = useState(null)
  const [isSet, setIsSet] = useState(true)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isFreezing, setIsFreezing] = useState(false)
  const wordsRef = useRef(null)

  // Helper function
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomEffect() {
    // Generate a random number between 0 and 1 (inclusive of 0, exclusive of 1)
    const randomValue = Math.random();

    if (randomValue < 0.60) {
      return "normal"; // 80% chance
    } else {
      const randomIndex = Math.floor(Math.random() * 3); // Random index from 0 to 2
      switch (randomIndex) {
        case 0:
          return "fire";
        case 1:
          return "freeze";
        case 2:
          return "slow";
      }
    }
  }


  // play background music
  useEffect(() => {
    const gameLoopMusic = new Audio(bgMusic)
    gameLoopMusic.volume = 0.4
    gameLoopMusic.loop = true
    gameLoopMusic.play()

    return () => {
      gameLoopMusic.pause();
      gameLoopMusic.currentTime = 0;
    }
  }, [])

  // handle spawning and checks if game is over
  useEffect(() => {
    // spawn a word after spawnTime
    const spawner = setInterval(() => {
      console.log(isFreezing)
      if (!isFreezing) {
        setWords((prevWords) => {
          const randIdx = getRandomInt(0, listOfWords.length - 1);
          const randX = getRandomInt(minX, maxX) + "px";
          const wordToModify = listOfWords[randIdx]
          const newWord = { ...wordToModify, posX: randX, kind: getRandomEffect(), speed: 30 }
          const newWords = [...prevWords, newWord]
          return newWords
        })
      }
    }, spawnTime)

    // Checks if the game is over duh...
    const checkGameOver = setInterval(() => {
      if (wordsRef.current) {
        const currentRef = wordsRef.current;
        const children = [...currentRef.children];
        const closestElement = children.reduce((highest, current) => {
          return current.top > highest.top ? current : highest;
        }, children[0]) // get the closese element from the bottom
        console.log(closestElement)
        if (closestElement) {
          const topValue = parseInt(closestElement.style.top, 10)
          // console.log(closestElement, topValue)
          if (topValue > maxHeight - 48) { // 48 is hardcoded which is bad. figure out how to make it depends of the window size
            setIsGameOver(true)
          }
        }
      }
    }, 200)

    // clean up
    return () => {
      clearInterval(spawner)
      clearInterval(checkGameOver)
    };
  }, [isFreezing]);

  // handle keypresses
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;
      click.play()

      if (key === 'Backspace') {
        setKeyStrokes((strokes) => [...strokes.slice(0, -1)]);
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
              setKeyStrokes((strokes) => [...strokes, key.toUpperCase()])
            }
          }

          if (validElements.length != 0) {
            setIsSet(false)
          }
        } else {
          if (curWord) {
            const lenWord = curWord.children[0].children.length
            const curSpan = curWord.children[0].children[curIdx]
            const tmp = curWord.innerText
            setCurKind(words.find(word => word.word === tmp).kind)
            if (curSpan.innerText === key) {
              curSpan.style.color = rightCharColor
              setCurIdx((idx) => idx + 1)
              setKeyStrokes((strokes) => [...strokes, key.toUpperCase()])
              if (curIdx === lenWord - 1) {
                finishClick.play()
                if (curKind === "fire") {
                  fireEffect.play()
                  setWords(() => [])
                } else if (curKind === "slow") {
                  slowTime.play()
                  setTimeout(() => {
                    setWords((words) => words.map(word => ({
                      ...word,
                      speed: 30,
                    })))
                  }, 20 * 1000)
                  setWords((words) => words.map(word => ({
                    ...word,
                    speed: 15,
                  })))
                } else if (curKind === "freeze") {
                  freezeEffect.play()
                  setTimeout(() => {
                    setWords((words) => words.map(word => ({
                      ...word,
                      speed: 30,
                    })))
                    setIsFreezing(() => false)
                  }, 20 * 1000)
                  setIsFreezing(true)
                  setWords((words) => words.map(word => ({
                    ...word,
                    speed: 1,
                  })))
                }
                curWord.classList.toggle('animate-fade')
                setTimeout(() => {
                  curWord.parentNode.removeChild(curWord)
                }, 1000)
                setIsSet(true)
                setKeyStrokes((_) => []);
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
    <div className="flex flex-row">
      <RightBar />
      <div className="cover flex flex-col w-full">
        <div ref={wordsRef} className="h-[90vh]">
          {!isGameOver ? (
            words.map((word, idx) => {
              return (
                <WordCard key={idx} word={word["word"]} kind={word["kind"]} curFps={word["speed"]} posX={word.posX} intialPosY="0px" id={idx} />
              )
            })) : (<div></div>)
          }
        </div>
        <TypedKeysDisplay keys={keyStrokes} />
      </div>
      <RightBar />
    </div>
  )
}

export default App
