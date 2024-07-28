import React, {useState, useRef, useEffect} from 'react'

export default function HomePage(props) {
    const {setAudioStream, setFile} = props;

    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [audioChunks, setAudioChunks] = useState([]);
    const [duration, setDuration] = useState(0);

    const mediaRecorder = useRef(null);
    
    const mimeType = 'audio/webm'

    async function startRecording(){
        let tempStream

        console.log('start recording')

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            tempStream = streamData
        } catch (err){
            console.log(err.message)
            return
        }

        setRecordingStatus('recording')

        //create new MediaRecorder instance using the stream
        const media = new MediaRecorder(tempStream, {type: mimeType})
        mediaRecorder.current = media

        mediaRecorder.current.start()
        let localAudioChunks= []
        mediaRecorder.current.ondataavailable = (event) =>{
            if (typeof event.data === 'undefined'){return}
            if (event.data.size === 0 ){return}
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    async function stopRecording(){
        setRecordingStatus('inactive')

        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () =>{
            const audioBlob = new Blob(audioChunks, {type: mimeType})
            setAudioStream(audioBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }

    useEffect(() => {
        if (recordingStatus === 'inactive'){return}

        const interval = setInterval(() =>{
            setDuration(curr => curr +1)
        }, 1000)

        return () => clearInterval(interval)
    })
    

    return (
        <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5 text-center pb-20'>
            <h1 className='font-semibold text-5xl sm:tex-6xl md:text-7xl'>
                <span className='text-blue-400 bold'>Lingo</span>Bear</h1>
            <h3 className='font-medium md:text-lg'> Record <span className='text-blue-400'>&rarr;</span> Transcribe <span 
            className='text-blue-400'>&rarr;</span> Translate</h3>
            <button onClick={recordingStatus === 'recording' ? stopRecording: startRecording} className='flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4
            specialBtn px-4 py-2 rounded-xl'>
                <p className={'text-black-400'+ (recordingStatus === 'recording' ? ' text-rose-300': '')}>{recordingStatus === 'inactive' ? "Record" : "Stop recording"}</p>
                <div className='flex items-center gap-2'>
                    {duration !== 0 && (
                        <p className='text-sm'>{duration}s</p>
                    )}
                </div>
                <i className={"fa-solid duration-200 fa-microphone"+ (recordingStatus === 'recording' ? ' text-rose-300': '')} ></i>
            </button>
            <p className='text-base'>Or <label className='text-blue-400 cursor-pointer hover:text-blue-600 duration-200'>upload 
                <input onChange={(e) => {
                    const tempFile = e.target.files[0]
                    setFile(tempFile)
                }} className='hidden' type="file" name="" id="" accept='.mp3, .wav'/></label> a .mp3/.wav file</p>
            <p className='italic text-slate-400'>Your best travel helper!</p>
        </main>
    )
}
