import React from 'react'
import doodle from "../assets/doodle.webp";


function Formbtn({text}) {
  return (
    <button
    type="submit"
    className="relative w-full py-2.5 cursor-pointer bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-600 transition-colors"
  >
    <img
      alt="Doodle"
      loading="lazy"
      className="absolute w-full h-full object-cover top-0 left-0 opacity-10 text-transparent"
      src={doodle}
    />
    {text}
  </button>
  )
}

export default Formbtn