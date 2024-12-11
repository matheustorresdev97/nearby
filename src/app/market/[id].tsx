import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Market() {

    const params = useLocalSearchParams<{ id: string }>()

    console.log(params)

    return (
        <View style={{ flex: 1 }}>
            <Text style={{flex:1, justifyContent: "center"}}>
                {params.id}
            </Text>
        </View>
    )
}