import { Alert, View } from "react-native"
import { Button, Icon, IconButton, useTheme } from "react-native-paper"
import { useEffect, useMemo, useState } from "react";

const AudioRecorder: React.FC = () => {

    const [isRecording, setIsRecording] = useState<boolean>(false);


    const record = (): void => {


    };

    const stopRecording = async () => {


    };

    const play = () => {

    };

    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: 10,
            }}
        >
            <Button
                mode="contained"
                icon="play"
                onPress={play}
            >
                Play
            </Button>
            <Button
                mode="contained"
                icon="microphone"
                onPress={
                    () => {
                        if (isRecording) {
                            stopRecording();
                        } else {
                            record();
                        }
                    }
                }
            >
                {isRecording
                    ? 'Recording...'
                    : 'Record sound'}
            </Button>
        </View>
    )
}

export default AudioRecorder
