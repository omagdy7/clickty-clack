import CharBlock from "./CharBlock";

function TypedKeysDisplay({ keys }) {
  return (
    <div className="flex flex-row gap-1 justify-center items-center text-center">
      {
        keys.map((ch, idx) => {
          return (
            <CharBlock key={idx} char={ch} />
          )
        })
      }
    </div>
  )
}
export default TypedKeysDisplay;













