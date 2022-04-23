import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
import { SocketContext } from '../context/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
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
            </div>

        </div>
    );
};

export default VideoPlayer;
