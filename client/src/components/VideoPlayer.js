import React, { useContext, useState } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import { SocketContext } from '../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import fetch from "node-fetch";
import { HiX } from "react-icons/hi";

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
        let inArg
        if (arg === 1) {
            inArg = "I think you should really start taking breaks for example I suggest that every hour go take a walk around the office also make sure to communicate with the team when you're feeling overloaded so we can share the work."
        }
        if (arg === 3) {
            inArg = "I think you should try to worry less about other people's opinions of you and I would encourage you to remind yourself of how you're a great asset to the team just think about how you got hired here over many other candidates for a reason."
        }

        // const x = "adfds+fsdf-sdf";
        const separators = ["I think you should really", "for example I suggest that", "also make sure to", "I think you should try to", "and I would encourage you to", "just"];
        const tokens = inArg.split(new RegExp(separators.join('|'), 'g'));
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
        answer = answer.replace("me", "them")
        answer = answer.replace("my", "their")
        console.log(answer);
        return answer;
    }

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
                <div className='text-2xl'>
                    <p>Microphone: {listening ? 'on' : 'off'}</p>
                </div>
                <div className="flex flex-row space-x-3 my-2">
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={() => {SpeechRecognition.startListening(); setQuestion(""); setAis([])}}>Start</button>
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={resetTranscript}>Reset</button>
                </div>
                <p className='text-xl'>{transcript}</p>

                <div>
                    <button className='my-2 px-4 py-2 bg-secondary text-white text-2xl rounded-2xl' onClick={() => setShowModal(true)}> Submit</button>

                    {/* <button className='my-2 px-4 py-2 bg-secondary text-white text-2xl rounded-2xl'
                        onClick={submitTranscript}
                    > Submit</button> */}
                </div>

                {showModal ? (
                    <div>
                        <div className="flex overflow-x-hidden mr-20 w-screen items-center justify-center h-screen overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative my-6 mx-auto w-256">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondary outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-solid rounded-t text-white">
                                        <div className="text-2xl font-base tracking-wide">
                                            Answer Quetions
                                        </div>

                                        <button className="absolute right-6" onClick={() => setShowModal(false)} aria-hidden="false" aria-label="button">
                                            <HiX className="h-7 w-7" aria-hidden="false" />
                                        </button>

                                    </div>

                                    <div className="grid justify-center">
                                        <div className="inline-flex w-64 h-1 bg-indigo-500 rounded-full"></div>
                                    </div>

                                    <div className="grid place-items-center text-xl py-2 gap-2 w-full mb-4">
                                        {ais.map(ai => { return <div>-{ai}</div> })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="opacity-25 fixed inset-0 z-40 h-screen bg-black"></div>
                    </div>
                ) : null}

                <p>{question} </p>
                <button onClick={submitTranscript}> Submit</button>
                <input value={answerToCheck} style={{ color: 'black'}} onChange={handleChange}></input>
                <p> Quiz result: {quiz} </p>
                <p> Correct answer: {correct} </p>
                <button onClick={checkAnswer}> Check Answer</button>
                {ais.map(ai => {return <div>-{ai}</div>})}
            </div>

        </div>
    );
};

export default VideoPlayer;
