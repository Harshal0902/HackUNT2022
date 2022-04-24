import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import { SocketContext } from '../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import fetch from "node-fetch";
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    video: {
        width: '550px',
        [theme.breakpoints.down('xs')]: {
            width: '300px',
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
        setQuestion("")
        // if (arg === 1) {
            // }
            // if (arg === 3) {
                // inArg = "I think you should try to worry less about other people's opinions of you and I would encourage you to remind yourself of how you're a great asset to the team just think about how you got hired here over many other candidates for a reason."
                // inArg = "I think you should really start taking breaks for example I suggest that every hour go take a walk around the office also make sure to communicate with the team when you're feeling overloaded so we can share the work."
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
            actionItem()
            setEx(2)
            return
        }
        else if (ex === 2) {
            modTranscript = "<answer> I feel like my work life balance has really taken a toll since starting this job " + "<context>" + transcript 
            setEx(3)
        }
        else if (ex === 3) {
            actionItem()
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
        setQuestion(answer);
        resetTranscript()
        return answer;
    }

    return (
        <div>
            <Grid container className={classes.gridContainer}>
                {stream && (
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )}
                {callAccepted && !callEnded && (
                    <Paper className={classes.paper}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                            <video playsInline ref={userVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
                )}

            </Grid>

            <div className='flex justify-center items-center flex-col text-white'>
                <div className='text-2xl'>
                    <p>Microphone: {listening ? 'on' : 'off'}</p>
                </div>
                <div className="flex flex-row space-x-3 my-2">
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={() => {SpeechRecognition.startListening(); setQuestion(""); setAis([])}}>Start</button>
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={resetTranscript}>Reset</button>
                </div>
                <p className='text-xl'>{transcript}</p>
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
