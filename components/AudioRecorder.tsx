import { Alert, View } from "react-native"
import { Icon, IconButton } from "react-native-paper"
import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets } from 'expo-audio';
import { useEffect } from "react";

const AudioRecorder: React.FC = () => {
    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert('Permission to access microphone was denied');
            }
        })();
    }, []);

    return (
        <View
            style={{
                flexDirection: 'row',
            }}
        >
            <View
                style={{
                    flex: 1
                }}
            >

            </View>
            <IconButton
                icon="microphone"
                size={50}
                onPress={() => console.log('Record')}
            />
        </View>
    )
}

export default AudioRecorder
