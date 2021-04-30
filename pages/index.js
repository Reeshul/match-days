import Head from "next/head";
import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import Location from "../components/Location";
import { apiKey } from "../app.config";

let teamIdArray = [];
let upcomingFixturesHomeTeamIdArray = [];

export default function Home() {
  async function fetchData() {
    let date = returnDate();
    fetch(
      `https://soccer.sportmonks.com/api/v2.0/fixtures/date/${date}?api_token=${apiKey}`
    )
      .then((response) => response.json())
      .then((fixtures) => {
        upcomingFixturesHomeTeamIdArray.push(fixtures);
        fetch("/api/teams")
          .then((res) => res.json())
          .then((teams) => {
            teamIdArray.push(teams);
            updateFixturesArrays(teamIdArray, fixtures);
            updateMarkersArray(fixtures)
          })
          .catch((error) => {
            console.error("Error: Could not fetch from api/teams", error);
          });
      })
      .catch((error) => {
        console.error("Error: Could not fetch from sportmonks", error);
      });
  }

  function updateMarkersArray(fixtures) {
    let fixtureVenues = []

    fetch("/api/venues")
    .then((res) => res.json())
    .then((venues) => {
      for (let i in fixtures.data){
        for(let j in venues) {
          if (fixtures.data[i].venue_id === venues[j].id){
            fixtureVenues.push(venues[j])
          }
         }
      } setVenuesArray(fixtureVenues)
    })
  }



  function updateFixturesArrays(teams, fixtures) {
    let homeTeams = [];
    let awayTeams = [];
    let teamZero = teams[0];

    for (let i in teamZero) {
      for (let j in fixtures.data) {
        if (teamZero[i].id === fixtures.data[j].localteam_id) {
          homeTeams.push(teamZero[i].name);
        }
      }
    }

    for (let i in teamZero) {
      for (let j in fixtures.data) {
        if (teamZero[i].id === fixtures.data[j].visitorteam_id) {
          awayTeams.push(teamZero[i].name);
        }
      }
    }
    console.log(awayTeams);
    updateFixturesHtml(homeTeams, awayTeams);
    setTeams(homeTeams);
  }

  function updateFixturesHtml(homeTeam, awayTeam) {
    const fixtures = document.getElementById("fixturesArea");
    let fixturesText = "";
    for (let i in homeTeam) {
      fixturesText += `${homeTeam[i]} vs ${awayTeam[i]} <br />`;
    }
    fixtures.innerHTML = fixturesText;
  }

  function returnDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  }

  const [teams, setTeams] = useState([]);
  const [venuesArray, setVenuesArray] = useState([])
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>Match Days</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Match Days</h1>
      <p id="fixturesArea"></p>
      <br />

      {/* <Location></Location> */}
      <Map fixtureVenues={venuesArray}/>
    </div>
  );
}
