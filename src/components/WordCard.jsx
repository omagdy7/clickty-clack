import { useState, useRef, useEffect } from 'react';
import Char from './Char';

function WordCard({ word, kind, curFps, posX, intialPosY, id }) {
  const textRef = useRef(null)
  const [posY, setPosY] = useState(intialPosY)
  const [width, setWidth] = useState("112px")

  console.log(kind)
  const fps = curFps;
  const deltaY = 1
  const margin = 20

  // adjust the wordCard width depending on the word size
  useEffect(() => {
    if (textRef.current) {
      setWidth(() => {
        const width = textRef.current.offsetWidth + margin;
        const newWidth = width + "px"
        return newWidth
      }
      );
    }
    const intervalId = setInterval(() => {
      setPosY((prevPosY) => {
        const num = parseInt(prevPosY.split('p')[0]) + deltaY;
        const newPosY = num.toString() + "px"
        return newPosY
      })
    }, 1000 / fps)

    return () => {
      clearInterval(intervalId)
    };
  }, []);

  let color = "white"

  if (kind === "fire") {
    color = "red"
  } else if (kind === "freeze") {
    color = "blue"
  } else if (kind === "slow") {
    color = "orange"
  }

  // bg-[url('./assets/wooden_texture.jpg')]

  return (
    <>
      <div id={id} className="
        border-black border-2 bg-cover
        flex items-center font-bold text-2xl justify-center 
        mx-5 my-5 rounded-lg px-3 h-12 absolute
        "
        style={{ top: posY, left: posX, width: width, backgroundColor: color }} >
        <div className="word wood" ref={textRef}>
          {
            word.split('').map((ch, idx) =>
              <Char key={idx} char={ch} color={"#1c0301"} />
            )
          }
        </div>
      </div >
    </>
  )
}

export default WordCard;













