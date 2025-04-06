import { Alert, View } from "react-native"
import { Button, Icon, IconButton, useTheme, Text } from "react-native-paper"
import { useEffect, useMemo, useRef, useState } from "react";
import { Audio } from 'expo-av';

const AudioRecorder: React.FC = () => {
    const [RecordedURI, setRecordedURI] = useState<string>("");
    const [AudioPermission, setAudioPermission] = useState<boolean>(false);
    const [IsRecording, setIsRecording] = useState<boolean>(false);
    const [IsPLaying, setIsPLaying] = useState<boolean>(false);

    const AudioRecorder = useRef(new Audio.Recording());
    const AudioPlayer = useRef(new Audio.Sound());

    // Initial Load to get the audio permission
    useEffect(() => {
        GetPermission();
    }, []);

    // Function to get the audio permission
    const GetPermission = async () => {
        const getAudioPerm = await Audio.requestPermissionsAsync();
        setAudioPermission(getAudioPerm.granted);
    };


    const record = async () => {
        try {
            // Check if user has given the permission to record
            if (AudioPermission === true) {
                try {
                    // Prepare the Audio Recorder
                    await AudioRecorder.current.prepareToRecordAsync();

                    // Start recording
                    await AudioRecorder.current.startAsync();
                    setIsRecording(true);
                } catch (error) {
                    console.log(error);
                }
            } else {
                // If user has not given the permission to record, then ask for permission
                GetPermission();
            }
        } catch (error) { }

    };

    const stopRecording = async () => {
        try {
            // Stop recording
            await AudioRecorder.current.stopAndUnloadAsync();

            // Get the recorded URI here
            const result = AudioRecorder.current.getURI();
            if (result) setRecordedURI(result);

            // Reset the Audio Recorder
            AudioRecorder.current = new Audio.Recording();
            setIsRecording(false);
        } catch (error) { }

    };

    const play = async () => {
        try {
            // Load the Recorded URI
            await AudioPlayer.current.loadAsync({ uri: RecordedURI }, {}, true);

            // Get Player Status
            const playerStatus = await AudioPlayer.current.getStatusAsync();

            // Play if song is loaded successfully
            if (playerStatus.isLoaded) {
                if (playerStatus.isPlaying === false) {
                    AudioPlayer.current.playAsync();

                    setIsPLaying(true);
                }
            }
        } catch (error) { }
    };

    const StopPlaying = async () => {
        try {
            //Get Player Status
            const playerStatus = await AudioPlayer.current.getStatusAsync();

            // If song is playing then stop it
            if (playerStatus.isLoaded === true)
                await AudioPlayer.current.unloadAsync();

            setIsPLaying(false);
        } catch (error) { }
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
                icon={IsPLaying ? 'pause' : 'play'}
                onPress={IsPLaying ? StopPlaying : play}
            >
                {IsPLaying ? 'Pause' : 'Play sound'}
            </Button>
            <Button
                mode="contained"
                icon="microphone"
                onPress={
                    () => {
                        if (IsRecording) {
                            stopRecording();
                        } else {
                            record();
                        }
                    }
                }
            >
                {IsRecording
                    ? 'Recording...'
                    : 'Record sound'}
            </Button>
            <Text>{RecordedURI}</Text>
        </View>
    )
}

export default AudioRecorder
