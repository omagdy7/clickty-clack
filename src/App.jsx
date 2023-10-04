import { useState } from 'react'
import WordCard from './components/WordCard'
import MyComponent from './components/testWidth'

function App() {

  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-row gap-4'>
        <WordCard word={"word"} kind={"normal"} />
        <WordCard word={"china"} kind={"normal"} />
        <WordCard word={"united"} kind={"normal"} />
        <WordCard word={"egypt"} kind={"normal"} />
        <WordCard word={"glamorous"} kind={"normal"} />
      </div>
      {/* <MyComponent /> */}
    </div>
  )
}

export default App
