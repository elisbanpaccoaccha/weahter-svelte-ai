import type { RequestHandler } from "@sveltejs/kit";
import { API_KEY } from '$env/static/private';
const API_key = API_KEY;
async function getWeatherCurrent(cityName: string) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&lang=es`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error buscando la ciudad");

	const data = await res.json();
	// console.log(data);

	// const { latitude, longitude, name, country } = data;
	// const { latitude, longitude, name, country } = data.coord.lon, data.coord.lat, data.name, data.sys.country;
	const { lon, lat } = data.coord;
	const { name } = data;
	const { timezone } = data;
	const { country } = data.sys;
	const {temp, temp_min, temp_max, humidity, feels_like} = data.main;
	const {description, icon} = data.weather[0];
	const {speed} = data.wind;


	return { latitude: lat, longitude: lon, name, country, timezone, temp, temp_min, temp_max, humidity, feels_like, description, icon, speed };
}

export const GET: RequestHandler = async ({ url }) => {
    const cityName = url.searchParams.get("city");
    if (!cityName) throw new Error("No se proporcionó el nombre de la ciudad");
    const data = await getWeatherCurrent(cityName);
    return Response.json(data);
};