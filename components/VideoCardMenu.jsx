import { View, Image } from "react-native";
import React from "react";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { icons } from "../constants";

const VideoCardMenu = ({ children }) => {
  return (
    <Menu>
      <MenuTrigger>
        <View className="pt-4">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: "#232533",
            marginTop: 45,
            padding: 10,
            borderRadius: 10,
            width: 120,
          },
        }}
      >
        {children}
      </MenuOptions>
    </Menu>
  );
};

export default VideoCardMenu;
