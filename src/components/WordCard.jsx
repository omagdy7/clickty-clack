import { useState, useRef, useEffect } from 'react';

function WordCard({ word, kind, posX, intialPosY, id }) {

  const textRef = useRef(null);
  const [posY, setPosY] = useState(intialPosY)
  const [width, setWidth] = useState("112px")



  const deltaY = 2
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
    }, 17)

    return () => {
      clearInterval(intervalId)
    };
  }, []);


  return (
    <>
      <div className="word flex items-center font-bold text-2xl justify-center text-blue-500 bg-gray-800 mx-5 my-5 rounded-md px-3 h-12 absolute" style={{ top: posY, left: posX, width: width }} >
        <p ref={textRef}>
          {word}
        </p>
      </div >
    </>
  )
}

export default WordCard;













