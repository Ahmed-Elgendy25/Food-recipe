import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { CachedImage } from "../helpers/image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Loading from "../components/loading";

export default function RecipeDetailScreen(props) {
  let item = props.route.params;
  const [isFavourite, setIsFavourite] = useState(false);
  const navigation = useNavigation();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealData(item.idMeal);
  }, []);

  const getMealData = async (id) => {
    try {
      const response = await axios.get(
        `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      if (response && response.data) {
        setMeal(response.data.meals[0]);
        setLoading(false);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  function ingredientsIndexes(meal) {
    const indexes = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        indexes.push(i);
      }
    }
    return indexes;
  }

  return (
    <ScrollView
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar style={"light"} />
      {/* recipe image */}
      <View className="flex-row justify-center">
        <CachedImage
          uri={item.strMealThumb}
          style={{
            width: wp(98),
            height: hp(50),
            borderRadius: 53,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            marginTop: 4,
          }}
        />
      </View>
      {/* back button */}
      <View className="w-full absolute flex-row justify-between items-center pt-14">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-5 bg-white"
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFavourite(!isFavourite)}
          className="p-2 rounded-full mr-5 bg-white"
        >
          <HeartIcon
            size={hp(3.5)}
            strokeWidth={4.5}
            color={isFavourite ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>
      {/* meal description */}
      {loading ? (
        <Loading size="large" className="mt-16" />
      ) : (
        <View className="px-4 flex justify-between space-y-4 pt-8">
          {/* name and area */}
          <Text
            style={{ fontSize: hp(3) }}
            className="font-bold flex-1 text-neutral-700"
          >
            {meal?.strMeal}
          </Text>
          <Text
            style={{ fontSize: hp(2) }}
            className="font-medium flex-1 text-neutral-500"
          >
            {meal?.strArea}
          </Text>
          {/* misc */}

          {/* ingredients */}
          <Text
            style={{ fontSize: hp(2.5) }}
            className="font-bold flex-1 text-neutral-700"
          >
            Ingredients
          </Text>
          <View className="space-y-2 ml-3">
            {ingredientsIndexes(meal).map((i) => (
              <View key={i} className="flex-row space-x-4">
                <View
                  style={{ height: hp(1.5), width: hp(1.5) }}
                  className="bg-amber-300 rounded-full"
                />
                <View className="flex-row space-x-2">
                  <Text
                    style={{ fontSize: hp(1.7) }}
                    className="font-extrabold text-neutral-700"
                  >
                    {meal["strMeasure" + i]}
                  </Text>
                  <Text
                    style={{ fontSize: hp(1.7) }}
                    className="font-medium text-neutral-600"
                  >
                    {meal["strIngredient" + i]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          {/* instructions */}
          <Text
            style={{ fontSize: hp(2.5) }}
            className="font-bold flex-1 text-neutral-700"
          >
            Instructions
          </Text>
          <Text style={{ fontSize: hp(1.6) }} className="text-neutral-700">
            {meal?.strInstructions}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
