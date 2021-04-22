import Head from "next/head";
import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import Location from "../components/Location";
import { apiKey } from "../app.config";

let teamIdArray = []
let upcomingFixturesHomeTeamIdArray = []

export default function Home() {
	async function fetchData() {
		console.log("3")
		let date = returnDate()
		fetch(`https://soccer.sportmonks.com/api/v2.0/fixtures/date/${date}?api_token=${apiKey}`)
			.then(response => response.json())
			.then(data => upcomingFixturesHomeTeamIdArray.push(data));
	}

	function fetchTeams() {
		console.log("4")
		fetch("/api/teams").then(res => res.json()).then(data => teamIdArray.push(data))
	}

	function returnDate() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		return yyyy + '-' + mm + '-' + dd;
	}

	const [count, setCount] = useState(0);
	const [teams, setTeams] = useState([]);


	useEffect(() => {
		console.log("1")
		loadFixtures();


	})


	async function loadFixtures() {
		console.log("2")
		await fetchData();
		await fetchTeams();
		console.log("5")
		
		console.log(upcomingFixturesHomeTeamIdArray.length);
	}

	// function renderFixtures() {
	// 	if (upcomingFixturesHomeTeamIdArray.length === 0)
	// }







	// console.log(upcomingFixturesHomeTeamIdArray)
	return (
		<div>
			<Head>
				<title>Match Days</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1>Match Days</h1>
			<p>{teams}</p>
			<br />

			<Location></Location>
			<Map />

			<button title="increment" onClick={() => setCount(count + 1)}>
				{count}
			</button>
		</div>
	);
}
