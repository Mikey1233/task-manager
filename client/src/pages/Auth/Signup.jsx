import { CheckCircle } from "lucide-react"
import doodle from "../../assets/doodle.webp";
import SignupForm from "../../components/SignupForm";
import { signUpcontent } from "../../textdata/authContent";



// import "./App.css"


function Signup() {
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-display2">
      {/* Left side - White background with info */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col">
        <div className="max-w-md mx-auto md:mx-0 md:ml-auto w-full">
          {/* Logo */}
          <div className="mb-16">
            <div className="flex items-center gap-1.5">
              <span className="font-bold  text-2xl">TXpanel</span>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Signup badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 bg-indigo-100 rounded-md">
            <div className="w-5 h-5 flex items-center justify-center bg-indigo-600 rounded">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs font-medium text-indigo-600">Signup</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl font-bold font-display mb-6">Get started for free.</h1>

          {/* Features list */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-3.5">What's included in the free plan:</p>
            {signUpcontent.map((item)=> ( <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{item}</span>
            </div>))}

           

          
          </div>
        </div>
      </div>

      {/* Right side - Dark background with form */}
      <div className="w-full md:w-1/2 bg-black p-8 md:p-12 flex items-center justify-center relative" 
       
       >
         <img
               alt="Doodle"
               loading="lazy"
               className="absolute w-full h-full object-cover top-0 left-0 opacity-15 text-transparent"
               // sizes="100vw"
               src={doodle}
             ></img>
     <SignupForm/>
     </div>
    </div>
  )
}

export default Signup

