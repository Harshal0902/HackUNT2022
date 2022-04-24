import React, { useContext, useEffect, useState, useRef } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import { SocketContext } from '../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import fetch from "node-fetch";
import { HiX } from "react-icons/hi";

// For AssemblyAI
import MicRecorder from "mic-recorder-to-mp3"
import { Oval } from "react-loader-spinner"
import axios from "axios"


const APIKey = process.env.ASSEMBLY_AI_API_KEY;
const assemblyAI = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: APIKey,
        "content-type": "application/json",
        "transfer-encoding": "chunked",
    },
})

const useStyles = makeStyles((theme) => ({
    video: {
        width: '400px',
        [theme.breakpoints.down('xs')]: {
            width: '250px',
        },
    },
    gridContainer: {
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        padding: '10px',
        border: '2px solid black',
        margin: '10px',
    },
}));

const VideoPlayer = () => {

    const [showModal, setShowModal] = useState(false);

    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
    const classes = useStyles();

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [ex, setEx] = useState(0);
    const [ais, setAis] = useState([])
    const [question, setQuestion] = useState("")
    const [answerToCheck, setAnswerToCheck] = useState("")
    const [quiz, setQuiz] = useState("")
    const [correct, setCorrect] = useState("")

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    function handleChange(event) {
        setAnswerToCheck(event.target.value)
    }
    function actionItem() {
        console.log("AI")
        // if (arg === 3) {
        //     inArg = "I think you should try to worry less about other people's opinions of you and I would encourage you to remind yourself of how you're a great asset to the team just think about how you got hired here over many other candidates for a reason."
        // }
        // if (arg === 1) {
        //     inArg = "I think you should really start taking breaks for example I suggest that every hour go take a walk around the office also make sure to communicate with the team when you're feeling overloaded so we can share the work."
        // }

        // const x = "adfds+fsdf-sdf";
        const separators = ["I think you should really", "for example I suggest that", "also make sure to", "I think you should try to", "and I would encourage you to", "just"];
        const tokens = transcript.split(new RegExp(separators.join('|'), 'g'));
        tokens.forEach(token => {
            if (token.length > 1) {
                setAis(curr => [...curr, token])
            }
        })
    }
    function checkAnswer() {
        const gold1 = "everyone around me seems smarter than me it takes my co-workers half the time it takes me to get something done my manager also always gives me a disappointing look it's actually really discouraging and makes me feel out of place I just feel like I'm lacking the natural at ability everyone else has"
        const gold2 = "I feel like my work life balance has really taken a toll since starting this job. It’s been really stressful. I don’t have time to spend with my family. We used to go on vacations twice a year and I don’t know when’s the next time I’ll even be able to go on vacation at this rate. I feel like I’m doing the work of 3 people. My boss is always assigning more work to me before I even finish earlier tasks. "
        if (gold1.includes(answerToCheck) || answerToCheck.includes("discouraged, lacking")) {
            setQuiz("Correct")
        }
        else if (gold2.includes(answerToCheck)) {
            setQuiz("Correct")
        }
        else {
            setQuiz("Incorrect")
            if (ex === 1) {
                setCorrect("Discouraged, Out of place")
            }
            else if (ex === 3) {
                setCorrect("Work life balance has really taken a toll. It's been really stressful, ")
            }
        }

        setAnswerToCheck("")
    }
    async function submitTranscript() {
        setAis([])
        setQuestion("")
        // everyone around me seems smarter than me it takes my co-workers half the time it takes me to get something done my manager also always gives me a disappointing look it's actually really discouraging and makes me feel out of place I just feel like I'm lacking the natural at ability everyone else has
        // const inArg = "I feel like my work life balance has really taken a toll since starting this job. It’s been really stressful. I don’t have time to spend with my family. We used to go on vacations twice a year and I don’t know when’s the next time I’ll even be able to go on vacation at this rate. I feel like I’m doing the work of 3 people. My boss is always assigning more work to me before I even finish earlier tasks. "

        // A:  Q: how do you feel about the way your manager looks at you? discouraging and makes me feel out of place
        // A: I feel like my work life balance has really taken a toll since starting this job Q: how do you feel about your WLB
        let modTranscript
        if (ex === 0) {
            modTranscript = "<answer> " + "<context>" + transcript
            setEx(1)
        }
        else if (ex === 1) {
            actionItem(1)
            setEx(2)
            return
        }
        else if (ex === 2) {
            modTranscript = "<answer> I feel like my work life balance has really taken a toll since starting this job " + "<context>" + transcript
            setEx(3)
        }
        else if (ex === 3) {
            actionItem(3)
            return
        }
        console.log(modTranscript)
        const body = {
            inputs: modTranscript
        }
        // const input = {
        //     inputs: "<answer> I don’t have time to spend with my family. <context> I feel like my work life balance has really taken a toll since starting this job. It’s been really stressful. I don’t have time to spend with my family. We used to go on vacations twice a year and I don’t know when’s the next time I’ll even be able to go on vacation at this rate. I feel like I’m doing the work of 3 people. Chris is always assigning more work to me before I even finish earlier tasks. "
        // }
        const response = await fetch(
            "https://api-inference.huggingface.co/models/iarfmoose/t5-base-question-generator",
            {
                headers: { Authorization: `Bearer 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` },
                method: "POST",
                body: JSON.stringify(body),
            }
        );
        console.log(body)
        const result = await response.json();
        console.log(result)
        let answer = result[0].generated_text;
        answer = answer.replace(/[?=]/g, '');
        answer = answer + "?"
        answer = answer.replace("you", "they")
        answer = answer.replace("your", "their")
        answer = answer.replace("you", "them")
        answer = answer.replace("I'm", "they're")
        answer = answer.replace("I", "they")
        answer = answer.replace("my", "their")
        console.log(answer);
        setQuestion(answer)
        return answer;
    }

    // For AssemblyAI
    // const recorder = useRef(null)
    //   const audioPlayer = useRef(null)
    //   const [blobURL, setBlobUrl] = useState(null)
    //   const [audioFile, setAudioFile] = useState(null)
    //   const [isRecording, setIsRecording] = useState(null)

    //   useEffect(() => {
    //     recorder.current = new MicRecorder({ bitRate: 128 })
    //   }, [])

    //   const startRecording = () => {
    //     recorder.current.start().then(() => {
    //       setIsRecording(true)
    //     })
    //   }

    //   const stopRecording = () => {
    //     recorder.current
    //       .stop()
    //       .getMp3()
    //       .then(([buffer, blob]) => {
    //         const file = new File(buffer, "audio.mp3", {
    //           type: blob.type,
    //           lastModified: Date.now(),
    //         })
    //         const newBlobUrl = URL.createObjectURL(blob)
    //         setBlobUrl(newBlobUrl)
    //         setIsRecording(false)
    //         setAudioFile(file)
    //       })
    //       .catch((e) => console.log(e))
    //   }

    //   const [uploadURL, setUploadURL] = useState("")
    //   const [transcriptID, setTranscriptID] = useState("")
    //   const [transcriptData, setTranscriptData] = useState("")
    //   const [transcript, setTranscript] = useState("")
    //   const [isLoading, setIsLoading] = useState(false)

    //   useEffect(() => {
    //     if (audioFile) {
    //       assemblyAI
    //         .post("/upload", audioFile)
    //         .then((res) => setUploadURL(res.data.upload_url))
    //         .catch((err) => console.error(err))
    //     }
    //   }, [audioFile])

    //   const submitTranscriptionHandler = () => {
    //     assemblyAI
    //       .post("/transcript", {
    //         audio_url: uploadURL,
    //       })
    //       .then((res) => {
    //         setTranscriptID(res.data.id)

    //         checkStatusHandler()
    //       })
    //       .catch((err) => console.error(err))
    //   }

    //   const checkStatusHandler = async () => {
    //     setIsLoading(true)
    //     try {
    //       await assemblyAI.get(`/transcript/${transcriptID}`).then((res) => {
    //         setTranscriptData(res.data)
    //       })
    //     } catch (err) {
    //       console.error(err)
    //     }
    //   }

    //   useEffect(() => {
    //     const interval = setInterval(() => {
    //       if (transcriptData.status !== "completed" && isLoading) {
    //         checkStatusHandler()
    //       } else {
    //         setIsLoading(false)
    //         setTranscript(transcriptData.text)

    //         clearInterval(interval)
    //       }
    //     }, 1000)
    //     return () => clearInterval(interval)
    //   })

    return (

        <div className='bg-gray-400 rounded-md p-4'>
            <div className='flex flex-row' >
                {stream && (
                    <Paper className={classes.paper}>
                        <div className="grid place-items-center" >
                            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                        </div>
                    </Paper>
                )}
                {callAccepted && !callEnded && (
                    <Paper className={classes.paper}>
                        <div className="grid place-items-center" >
                            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                            <video playsInline ref={userVideo} autoPlay className={classes.video} />
                        </div>
                    </Paper>
                )}

            </div>

            <div className='flex justify-center items-center flex-col'>

                {/* For AssemblyAI
            
            <div>
        <button
          className='btn btn-primary'
          onClick={startRecording}
          disabled={isRecording}
        >
          Record
        </button>
        <button
          className='btn btn-warning'
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop
        </button>
      </div>
      <audio ref={audioPlayer} src={blobURL} controls='controls' />
      <button
        className='btn btn-secondary'
        onClick={submitTranscriptionHandler}
      >
        Submit for Transcription
      </button>

      {isLoading ? (
        <div>
          <Oval
            ariaLabel='loading-indicator'
            height={100}
            width={100}
            strokeWidth={5}
            color='red'
            secondaryColor='yellow'
          />
          <p className='text-center'>Is loading....</p>
        </div>
      ) : (
        <div></div>
      )}
      {!isLoading && transcript && (
        <div className='w-2/3 lg:w-1/3 mockup-code'>
          <p className='p-6'>{transcript}</p>
        </div>
      )} */}
                {/* <div className='text-2xl'>
                    <p>Microphone: {listening ? 'on' : 'off'}</p>
                </div> */}
                <div className="flex flex-row space-x-3 my-2 text-gray-400">
                    <button className='px-3 py-2 rounded-md' onClick={() => { SpeechRecognition.startListening(); setQuestion(""); setAis([]) }}>Start</button>
                    <button className='px-3 py-2 rounded-md' onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className='px-3 py-2 rounded-md' onClick={resetTranscript}>Reset</button>
                </div>

                <p className='text-xl max-w-2xl'>{transcript}</p>

                <div>
                    <button className='my-2 px-4 py-2 text-gray-400 text-2xl rounded-2xl' onClick={() => { setShowModal(true); submitTranscript(); }}> Submit</button>

                    {/* <button className='my-2 px-4 py-2 bg-secondary text-white text-2xl rounded-2xl'
                        onClick={submitTranscript}
                    > Submit</button> */}
                </div>

                {showModal ? (
                    <div>
                        <div className="flex overflow-x-hidden mr-20 w-screen items-center justify-center h-screen overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative my-6 mx-auto w-128">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondary outline-none focus:outline-none pb-8">
                                    <div className="flex items-start justify-between p-5 border-solid rounded-t text-white">
                                        <div className="text-2xl font-base tracking-wide">
                                            PACT Time!
                                        </div>

                                        <button className="absolute right-6" onClick={() => setShowModal(false)} aria-hidden="false" aria-label="button">
                                            <HiX className="h-7 w-7" aria-hidden="false" />
                                        </button>
                                    </div>

                                    <div className="grid place-items-center text-white text-2xl tracking-wider">
                                        <p className='py-4 text-center'>{question} </p>
                                        <input className='py-4' value={answerToCheck} style={{ color: 'black' }} onChange={handleChange}></input>
                                        <p className='py-4'>Quiz result: {quiz} </p>
                                        {correct ? (
                                            <div>
                                                <p className='py-4'>Correct answer: {correct} </p>
                                            </div>
                                        ) : null}

                                        <button className='my-2 px-4 py-2 bg-primary text-white text-2xl rounded-2xl' onClick={checkAnswer}> Check Answer</button>

                                        {ais.map(ai => { return <div className='py-1 text-center'>-{ai}</div> })}

                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="opacity-25 fixed inset-0 z-40 h-screen bg-black"></div>
                    </div>
                ) : null}

            </div>

        </div>
    );
};

export default VideoPlayer;
