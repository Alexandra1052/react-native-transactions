import { View, Text } from "react-native";
import React, { use } from "react";
import { Colors } from "@/app-example/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
        backgroundColor: Colors.backgroundColor,
      }}
    >

        {children}
    </View>
  );
}
