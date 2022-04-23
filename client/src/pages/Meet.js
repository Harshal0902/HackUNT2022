import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import { useVocal } from '@untemps/react-vocal'
import Icon from '../components/Icon'

const useStyles = makeStyles((theme) => ({
    image: {
        marginLeft: '15px',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
}));

const App = () => {
    const classes = useStyles();

    const [isListening, setIsListening] = useState(false)
    const [result, setResult] = useState('')

    const [, { start, subscribe }] = useVocal('fr_FR')

    const _onButtonClick = () => {
        setIsListening(true)

        subscribe('speechstart', _onVocalStart)
        subscribe('result', _onVocalResult)
        subscribe('error', _onVocalError)
        start()
    }

    const _onVocalStart = () => {
        setResult('')
    }

    const _onVocalResult = (result) => {
        setIsListening(false)

        setResult(result)
    }

    const _onVocalError = (e) => {
        console.error(e)
    }

    return (
        <div className={classes.wrapper}>

            <VideoPlayer />

            <Sidebar>
                <Notifications />
            </Sidebar>
        </div>
    );
};

export default App;
