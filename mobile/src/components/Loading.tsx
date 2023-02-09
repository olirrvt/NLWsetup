import { View, ActivityIndicator } from "react-native";

export function Loading() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090A' }}>
            {/* Loading que o React Native disponibiliza */}
            <ActivityIndicator color="#8B5CF6" />
        </View>
    );
};