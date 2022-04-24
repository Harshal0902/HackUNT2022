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

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    function actionItem(arg) {
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
    async function submitTranscript() {
        setAis([])
        // const inArg = "I feel like my work life balance has really taken a toll since starting this job. It’s been really stressful. I don’t have time to spend with my family. We used to go on vacations twice a year and I don’t know when’s the next time I’ll even be able to go on vacation at this rate. I feel like I’m doing the work of 3 people. My boss is always assigning more work to me before I even finish earlier tasks. "
        // everyone around me seems smarter than me it takes my co-workers half the time it takes me to get something done my manager also always gives me a disappointing look it's actually really discouraging and makes me feel out of place I just feel like I'm lacking the natural at ability everyone else has

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
        const answer = result[0].generated_text;
        console.log(answer);
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
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={SpeechRecognition.startListening}>Start</button>
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={SpeechRecognition.stopListening}>Stop</button>
                    <button className='bg-secondary px-3 py-2 rounded-md' onClick={resetTranscript}>Reset</button>
                </div>
                <p className='text-xl'>{transcript}</p>
                <button onClick={submitTranscript}> Submit</button>
                {ais.map(ai => {return <div>-{ai}</div>})}
            </div>

        </div>
    );
};

export default VideoPlayer;
