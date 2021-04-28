import Head from "next/head";
import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import Location from "../components/Location";
import { apiKey } from "../app.config";

let teamIdArray = []
let upcomingFixturesHomeTeamIdArray = []


export default function Home() {

	// console.log(loadFixtures());

	async function loadFixtures() {
		console.log(teamIdArray[0]);
		await fetchData();
	}

	

	async function fetchData() {
		let date = returnDate()
		fetch(`https://soccer.sportmonks.com/api/v2.0/fixtures/date/${date}?api_token=${apiKey}`)
			.then(response => response.json())
			.then(fixtures => {
				fetch("/api/teams")
					.then(res => res.json())
					.then(teams => {teamIdArray.push(teams)
					updateFixturesHtml(teamIdArray) 
					})
					.catch((error) => {
						console.error('Error: Could not fetch from api/teams', error);
					});
				upcomingFixturesHomeTeamIdArray.push(fixtures)
			})
			.catch((error) => {
				console.error('Error: Could not fetch from sportmonks', error);
			});
		
	}

	function updateFixturesHtml(teams, fixtures) {
		console.log(teams)
	}


	for (let i in upcomingFixturesHomeTeamIdArray) {
		for(let j in teamIdArray){
			if(upcomingFixturesHomeTeamIdArray[0].data[i].localteam_id === teamIdArray[0].data[j].id){
				console.log(teamIdArray[j].name)
			}
		}
	}

	function returnDate() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		return yyyy + '-' + mm + '-' + 30;
	}

	const [count, setCount] = useState(0);
	const [teams, setTeams] = useState([]);


	useEffect(() => {
		loadFixtures();
	})





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
