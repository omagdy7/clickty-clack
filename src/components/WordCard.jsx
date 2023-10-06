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

  <h1 class="[text-shadow:_0_1px_0_var(--tw-shadow-color)]">Hello</h1>


  return (
    <>
      <div id={id} className="border-black border-2 bg-contain bg-[url('../../assets/wooden_texture.jpg')] flex items-center font-bold text-2xl justify-center text-blue-500 bg-amber-600 mx-5 my-5 rounded-lg px-3 h-12 absolute" style={{ top: posY, left: posX, width: width }} >
        <div className="word wood" ref={textRef}>
          {
            word.split('').map((ch, idx) =>
              <Char key={idx} char={ch} color={"rgba(139,69,19,0.5)"} />
            )
          }
        </div>
      </div >
    </>
  )
}

export default WordCard;













