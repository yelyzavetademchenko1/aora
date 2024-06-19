import { Text, Image, View } from "react-native";
import React from "react";
import { MenuOption } from "react-native-popup-menu";

import { icons } from "../constants";

const VideoCardMenuItem = ({ text }) => {
  return (
    <MenuOption onSelect={() => alert(`Save`)}>
      <View className="flex-row items-center gap-3">
        <Image
          source={text === "Save" ? icons.bookmark : icons.deleteIcon}
          resizeMode="contain"
          className="w-5 h-5"
        />
        <Text className="text-xs text-gray-100 font-psemibold">{text}</Text>
      </View>
    </MenuOption>
  );
};

export default VideoCardMenuItem;
