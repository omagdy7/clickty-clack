import { useState, useRef, useEffect } from 'react';
import Char from './Char';

function WordCard({ word, kind, posX, intialPosY, id }) {
  const textRef = useRef(null)
  const [posY, setPosY] = useState(intialPosY)
  const [width, setWidth] = useState("112px")


  const fps = 60;

  const deltaY = 1
  const margin = 30

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



  return (
    <>
      <div id={id} className="word flex items-center font-bold text-2xl justify-center text-blue-500 bg-gray-800 mx-5 my-5 rounded-md px-3 h-12 absolute" style={{ top: posY, left: posX, width: width }} >
        <div ref={textRef}>
          {
            word.split('').map((ch) =>
              <Char char={ch} color={'red'} />
            )
          }
        </div>
      </div >
    </>
  )
}

export default WordCard;













