// Importação da tag View do React Native
import { View, TouchableOpacity, Text } from "react-native";
// Dependecias Icones e SVG
import { Feather } from "@expo/vector-icons";
// Importação da logo
import Logo from "../svg/logo.svg";
// Importação de Cor do Tailwind CSS
import colors from "tailwindcss/colors";

export function Header() {
  return (
    <View className="w-full flex-row items-center justify-between">
        <Logo />
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
        >
            <Feather 
            name="plus" 
            color={colors.violet[500]} 
            size={20} 
            />
        </TouchableOpacity>

        <Text className="text-white ml-3 font-semibold text-base">
            Novo
        </Text>
    </View>
  );
}
