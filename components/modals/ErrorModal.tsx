import { FaCross } from "@node_modules/react-icons/fa6"

export interface ErrorModalProps {
    title: string
    message: string
    isOpen: boolean
}

const ErrorModal = ({ title, message, isOpen }: ErrorModalProps) => {
  return (
    <>
    {isOpen && (     
    <div className="absolute top-0 left-0 w-full h-full bg-black/25 backdrop-blur-sm animate-fadeIn">
        <div className="bg-[#7a2c39]/50 text-text p-4 rounded-md flex flex-col justify-center items-center gap-3">
          <div className="flex flex-col justify-center items-center gap-3">
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
          <button className="bg-[#7a2c39] text-text p-2 rounded-md"><FaCross /></button>
        </div>
    </div>
    )}
    </> 
  )
}

export default ErrorModal