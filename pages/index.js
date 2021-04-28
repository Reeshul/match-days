import Head from "next/head";
import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import Location from "../components/Location";
import { apiKey } from "../app.config";

let teamIdArray = []
let upcomingFixturesHomeTeamIdArray = []


export default function Home() {

		async function fetchData() {
		let date = returnDate()
		fetch(`https://soccer.sportmonks.com/api/v2.0/fixtures/date/${date}?api_token=${apiKey}`)
			.then(response => response.json())
			.then(fixtures => {
				upcomingFixturesHomeTeamIdArray.push(fixtures)
				fetch("/api/teams")
					.then(res => res.json())
					.then(teams => {teamIdArray.push(teams)
					updateFixturesHtml(teamIdArray, fixtures) 
					})
					.catch((error) => {
						console.error('Error: Could not fetch from api/teams', error);
					});
				
			})
			.catch((error) => {
				console.error('Error: Could not fetch from sportmonks', error);
			});
		
	}

	function updateFixturesHtml(teams, fixtures) {
		console.log(fixtures);
		let homeTeams = []
		let teamZero = teams[0]
		
		for (let i in teamZero){
			for(let j in fixtures.data){
				if (teamZero[i].id === fixtures.data[j].localteam_id) {
					homeTeams.push(teamZero[i].name) 
				}
			}
		} console.log(homeTeams);
		setTeams(homeTeams)
	} 


	function returnDate() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		return yyyy + '-' + mm + '-' + 30;
	}

	const [teams, setTeams] = useState([]);


	useEffect(() => {
		fetchData();
	}, [])





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


		</div>
	);
}
