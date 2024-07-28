import React from 'react'
import { LANGUAGES } from '../utils/Presets'
import bearicon from '../assets/images/bearicon.png'

export default function Translation(props) {
  
  const {textElement, toLanguage, translating, setTranslating, setTranslation, setToLanguage, generateTranslation} = props
  
  return (
      <div className='flex flex-col gap-2 max-w-[400px] w-full mx-auto'>
        {!translating && (<div className='flex flex-col gap-1'>
            <p className='text-xs sm:text-sm font-medium text-slate-500 mr-auto'>To language</p>
            <div className='flex items-stretch gap-2'>
            <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)} 
            className='flex-1 outline-none bg-white focus:outline-none border border-solid border-transparent
            hover:border-blue-400 duration-200 p-2 rounded'>
                <option value={'Select Language'}>Select Language</option>
                {Object.entries(LANGUAGES).map(([key, value]) => {
                    return (
                        <option key = {key} value={value}>{key}</option>
                    )    
                })}
            </select>
            <button className='specialBtn px-3 py-2 rounded-lg text-blue-400 duration-200' 
            onClick={generateTranslation}>Translate</button>
            </div>
        </div>)}
        {(textElement && !translating) && (
            <p>{textElement}</p>
        )}
        {translating && (
            <div className='grid place-items-center'>
                <img src={bearicon} alt="Bear Icon" className="bear-icon animate-spin" />
            </div>
        )}
      </div>
    )
}
