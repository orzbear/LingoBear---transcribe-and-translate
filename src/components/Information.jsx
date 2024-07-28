import React, { useState, useEffect, useRef } from 'react'
import Translation from './Translation'
import Transcription from './Transcription'

export default function Information(props) {

    const { output, finished } = props
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    const [translating, setTranslating] = useState(null)
    console.log(output)


    const worker = useRef(null)

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.status) {
                case 'initiate':
                    console.log('DOWNLOADING')
                    break;
                case 'progress':
                    console.log('LOADING')
                    break;
                case 'update':
                    setTranslation(e.data.output)
                    console.log(e.data.output)
                    break;
                case 'complete':
                    setTranslating(false)
                    console.log("DONE")
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => worker.current.removeEventListener('message', onMessageReceived)
    })

   const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || ''


   function handleCopy() {
    navigator.clipboard.writeText(textElement)
}

function handleDownload() {
    const element = document.createElement("a")
    const file = new Blob([textElement], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `Freescribe_${new Date().toString()}.txt`
    document.body.appendChild(element)
    element.click()
}

function generateTranslation() {
    if (translating || toLanguage === 'Select language') {
        return
    }

    setTranslating(true)

    worker.current.postMessage({
        text: output.map(val => val.text),
        src_lang: 'eng_Latn',
        tgt_lang: toLanguage
    })
}

    
    return (
        <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 
            text-center pb-20 mx-auto max-w-prose w-full'>
            <h1 className='font-semibold text-4xl sm:tex-5xl md:text-6xl whitespace-nowrap'>
            <span className='text-blue-400 bold'>Your</span> {tab === 'transcription' ? 'Transcription' : 'Translation'}
            </h1>
            <div className='grid grid-cols-2 mx-auto bg-white  items-center 
            shadow rounded-full overflow-hidden items-center'>
                <button onClick={() =>setTab('transcription')} className={'px-4 duration-200 py-1 font-medium '+ 
                    (tab === 'transcription' ? ' bg-blue-400 text-white' :'text-blue-400 hover:text-blue-800') }>Transcription</button>
                <button onClick={() =>setTab('translation')} className={'px-4 duration-200 py-1 font-medium'+ 
                    (tab === 'translation' ? ' bg-blue-400 text-white' :'text-blue-400 hover:text-blue-600')}>Translation</button>
            </div>
            <div className='flex my-8 flex-col'>
                {tab === 'transcription' ? (
                <Transcription {...props} textElement = {textElement}/>
            ) : (
                <Translation {...props} toLanguage={toLanguage} translating={translating} textElement={textElement} setTranslating={setTranslating} setTranslation={setTranslation} setToLanguage={setToLanguage} generateTranslation={generateTranslation} />
            )}
            </div>
            <div className='flex items-center gap-4 mx-auto'>
                <button title='Copy'  className='hover:text-blue-600 duration-200 bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded px-4'><i className="fa-solid fa-clone"></i></button>
                <button title='Download'  className='hover:text-blue-600 duration-200 bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded px-4'><i className="fa-solid fa-download"></i></button>
            </div>
        </main>
    )
}

