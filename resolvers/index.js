import 'dotenv/config'
import axios from "axios";
import geolib from "geolib";
import moment from 'moment';

export const resolvers = {
    Query: {
        getNearbyStations: async (_, { latitude, longitude, maxDistanceFromOrigin }, context, info) => {

            // if maxDistanceFromOrigin is not passed use 5 miles in meters (8048)
            maxDistanceFromOrigin =
                maxDistanceFromOrigin === undefined ? 8048 : maxDistanceFromOrigin;

            try {
                const response = await axios.get(process.env.NOAA_STATIONS_URL);
                if (response.status === 200) {
                    const { data } = response;
                    const { stations } = data;
                    const nearbyStations = stations.filter((station) => {
                        const stationLat = parseFloat(station.lat);
                        const stationLng = parseFloat(station.lng);
                        const distance = geolib.getDistance({ latitude, longitude }, { lat: stationLat, lng: stationLng });
                        station.distance = distance / 1000; // miles
                        return distance <= maxDistanceFromOrigin;
                    });
                    //sort by distance from position
                    nearbyStations.sort((a, b) => a.distance - b.distance);
                    return nearbyStations;
                }
                else {
                    throw new Error(`Failed to fetch NOAA tide stations: ${response.status}`);
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch NOAA tide stations: ${error.message}`);
            }
        },
        getStationsByName: async (_, { name }, context, info) => {
            try {
                const response = await axios.get(process.env.NOAA_STATIONS_URL);
                if (response.status === 200) {
                    const { data } = response;
                    const { stations } = data;
                    const nearbyStations = stations.filter(x => x.name.toLowerCase().includes(name.toLowerCase()));
                    return nearbyStations;
                }
                else {
                    throw new Error(`Failed to fetch NOAA tide stations: ${response.status}`);
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch NOAA tide stations: ${error.message}`);
            }
        },
        getTidePredictionsByStationId: async (_, { stationId, config }, context, info) => {
            try {
                const beginDate = moment().format('L');
                const endDate = moment().add(20, 'days').format('L');

                const TIDE_URL = `${process.env.NOAA_TIDE_BASE_URL + process.env.NOAA_TIDE_UNITS + config.units + process.env.NOAA_TIDE_STATION + stationId + process.env.NOAA_TIDE_BEGIN_DATE + beginDate + process.env.NOAA_TIDE_END_DATE + endDate}`

                const response = await axios.get(TIDE_URL);
                if (response.status === 200) {
                    const { data } = response;
                    return data["predictions"] || null;
                }
                else {
                    throw new Error(`Failed to fetch NOAA tide stations: ${response.status}`);
                }
            }
            catch (error) {
                throw new Error(`Failed to fetch NOAA tide stations: ${error.message}`);
            }
        },

    },
};