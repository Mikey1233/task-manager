import doodle from "../assets/doodle.webp";


function Formbtn({text,loading}) {
  
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
    {/* {text}
     */}
     {loading ? ( <div className="text-center space-y-6">
      <div
        className="w-6 h-6 border-2 border-t-[#fff] border-indigo-500 rounded-full animate-spin mx-auto"
      ></div>
    
      
   
  
</div>):(`${text}`)}
  </button>
  )
}

export default Formbtn