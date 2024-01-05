import {apiKey} from '../constants';
import axios from 'axios';

const forecastEndPoint = params =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${
    params.cityName || 'Istanbul'
  }&days=${params.days}&aqi=no&alerts=no`;

const locationEndPoint = params =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${
    params.cityName || 'Istanbul'
  }`;

const apiCall = async endpoint => {
  const options = {
    method: 'GET',
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log('error: ', error);
    return {};
  }
};

export const fetchWeatherForecast = params => {
  let forecastUrl = forecastEndPoint(params);
  return apiCall(forecastUrl);
};

export const fetchLocations = params => {
  let locationsUrl = locationEndPoint(params);
  return apiCall(locationsUrl);
};
