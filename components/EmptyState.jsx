import { View, Text, Image } from "react-native";
import React from "react";

import { images } from "../constants";
import CustomBtn from "./CustomBtn";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[216px]"
        resizeMode="contain"
      />
      <Text className="font-psemibold text-xl text-center text-white">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100 mt-2">
        {subtitle}
      </Text>
      <CustomBtn
        title="Create video"
        handlePress={() => router.push("/create")}
        containerStyles={"w-full my-5"}
      />
    </View>
  );
};

export default EmptyState;
