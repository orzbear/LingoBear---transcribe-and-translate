import React from 'react'

export default function FileDisplay(props) {
    const {file, audioStream, resetAudio, handleFormSubmission} = props;

    return (
        <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 
        text-center pb-20 max-w-full mx-auto w-72 sm:w-96'>
            <h1 className='font-semibold text-4xl sm:tex-5xl md:text-6xl'>
            <span className='text-blue-400 bold'>Your</span> File
            </h1>
            <div className='flex flex-col text-left  mx-auto my-4'>
                <h3 className='font-semibold'>Name</h3>
                <p>{file ? file?.name : 'Your recording'}</p>
            </div>
            <div className='flex items-center justify-between gap-4'>
                <button className='text-slate-400 hover:text-blue-600 duration-200' onClick={resetAudio}>
                    Reset
                </button>
                <button className='specialBtn px-4 py-2 rounded-lg text-blue-400 flex items-center gap-2
                font-medium' onClick={handleFormSubmission}>
                    <p>Transcribe</p>
                    <i className="fa-solid fa-pen-fancy"></i>
                </button>
            </div>
        </main>
    )
}
