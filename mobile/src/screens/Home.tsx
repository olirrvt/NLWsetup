import { View } from 'react-native';
import { Header } from './../../../web/src/components/Header';

export function Home() {
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>
        </View>
    )
}