import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {theme} from '../theme';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {weatherImages} from '../constants';

const HomeScreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});
  //=================
  useEffect(() => {
    startUp();
  }, []);
  //=================
  const startUp = () => {
    fetchWeatherForecast({
      cityName: 'Istanbul',
      days: '7',
    }).then(data => setWeather(data));
  };
  //=================
  const handleLocation = loc => {
    console.log('location', loc);
    setLocation([]);
    setShowSearch(false);
    fetchWeatherForecast({cityName: loc.name, days: '7'}).then(data =>
      setWeather(data),
    );
  };
  //================
  const handleSearch = value => {
    console.log(value);
    //fetch Location
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => setLocation(data));
    }
  };
  //================
  //!debounce-TextInput verisini 700ms geciktiriyor
  const handleTextDebounce = useCallback(debounce(handleSearch, 700), []);
  const {current, location} = weather;

  return (
    <View className="flex-1 relative">
      {/* BACKGROUND */}
      <StatusBar styles="light" />
      <Image
        blurRadius={75}
        className="absolute w-full h-full"
        source={require('../assets/images/bg.png')}
      />
      {/* ======================== */}
      {/* SEARCH INPUT */}
      <SafeAreaView style={{height: '7%'}} className="mx-4 mb-10 relative z-50">
        <View>
          <View
            style={{
              backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
            }}
            className="flex-row h-14  justify-end items-center rounded-full">
            {showSearch && (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={'lightgray'}
                className="pl-6 pb-1 flex-1 text-base text-white"
              />
            )}
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              style={{backgroundColor: theme.bgWhite(0.3)}}
              className="rounded-full p-3 m-1">
              <MagnifyingGlassIcon size={'25'} color={'white'} />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch && (
            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? 'border-b-2 border-b-gray-400'
                  : '';
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={`flex-row items-center border-0 p-3 px-4 mb-1  ${borderClass}`}>
                    <MapPinIcon size={'20'} color={'gray'} />
                    <Text className="text-black text-base ml-2">
                      {loc?.name},{loc?.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </SafeAreaView>
      {/* ======================== */}
      {/* FORECAST SECTION */}
      <View className="mx-4 flex justify-around flex-1 mb-2">
        {/* LOCATION */}
        <Text className="text-white text-center text-2xl font-bold">
          {location?.name},
          <Text className="text-lg font-semibold text-gray-300">
            {location?.country}
          </Text>
        </Text>
        {/* WEATHER-IMAGE */}
        <View className="flex-row justify-center">
          <Image
            source={weatherImages[current?.condition?.text]}
            //source={require('../assets/images/partlycloudy.png')}
            className="w-52 h-52"
          />
        </View>
        {/* DERECE */}
        <View className="space-y-2">
          <Text className="text-center font-bold text-white text-6xl ml-5">
            {current?.temp_c}&#176;
          </Text>
          <Text className="text-center  text-white text-xl tracking-widest">
            {current?.condition?.text}
          </Text>
        </View>
        {/* OTHER STATS */}
        <View className="flex-row justify-between mx-4">
          {/* WIND */}
          <View className="flex-row space-x-2 items-center">
            <Image
              source={require('../assets/icons/wind.png')}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">
              {current?.wind_kph}km
            </Text>
          </View>
          {/* HUMIDITY */}
          <View className="flex-row space-x-2 items-center">
            <Image
              source={require('../assets/icons/drop.png')}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">
              {current?.humidity}%
            </Text>
          </View>
          {/* SUNRISE */}
          <View className="flex-row space-x-2 items-center">
            <Image
              source={require('../assets/icons/sun.png')}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">
              {weather?.forecast?.forecastday[0]?.astro?.sunrise}
            </Text>
          </View>
        </View>
      </View>
      {/* NEXTDAY-FORECAST */}
      <View className="mb-2 space-y-3">
        <View className="flex-row items-center mx-5 space-x-2">
          <CalendarDaysIcon size={22} color={'white'} />
          <Text className="text-white text-base">Daily Forecast </Text>
        </View>
        <ScrollView
          className="mb-3"
          horizontal
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}
          showsHorizontalScrollIndicator={false}>
          {weather?.forecast?.forecastday?.map((item, index) => {
            let date = new Date(item.date);
            let options = {weekday: 'long'};
            let dayName = date
              .toLocaleDateString('en-US', options)
              .split(',')[0];
            return (
              // FORECAST-DAYS
              <View
                key={index}
                className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                style={{backgroundColor: theme.bgWhite(0.15)}}>
                <Image
                  source={weatherImages[item?.day?.condition?.text]}
                  className="w-11 h-11"
                />
                <Text className="text-white">{dayName}</Text>
                <Text className="text-white text-lg font-semibold">
                  {item?.day?.avgtemp_c}&#176;
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
