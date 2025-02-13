import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";

import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { useAppWrite } from "../../lib/useAppWrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const { user } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const { data: posts, refetch } = useAppWrite(getAllPosts);

  const { data: latestPosts } = useAppWrite(getLatestPosts);

  const onRefresh = async () => {
    setRefreshing(true);

    await refetch();

    setRefreshing(false);
  };

  return (
    <MenuProvider>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts}
          // data={[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="font-psemibold text-2xl text-white">
                    {user?.username}
                  </Text>
                </View>

                <View className="mt-1.5">
                  <Image
                    className="w-9 h-10"
                    resizeMode="contain"
                    source={images.logoSmall}
                  />
                </View>
              </View>

              <SearchInput />

              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-100 text-lg font-pregular mb-3">
                  Latest Videos
                </Text>
                <Trending posts={latestPosts ?? []} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Videos Found"
              subtitle="Be the first one to upload a video"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </MenuProvider>
  );
};

export default Home;
