import Head from "next/head";
import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import { apiKey } from "../app.config";
import Layout from "../components/Layout";
import styled from "styled-components"; 
import { returnDate } from "../helpers/helpers";

const FixturesArea = styled.p`
  font-family: sans-serif;
`;

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
            updateMarkersArray(fixtures);
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
    let fixtureVenues = [];

    fetch("/api/venues")
      .then((res) => res.json())
      .then((venues) => {
        for (let i in fixtures.data) {
          for (let j in venues) {
            if (fixtures.data[i].venue_id === venues[j].id) {
              fixtureVenues.push(venues[j]);
            }
          }
        }
        setVenuesArray(fixtureVenues);
      });
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

  const [teams, setTeams] = useState([]);
  const [venuesArray, setVenuesArray] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap"
            rel="stylesheet"
          ></link>
          <title>Match Days</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 style={{ fontFamily: "Bungee Shade" }}>Match Days</h1>
        <FixturesArea id="fixturesArea"></FixturesArea>
        <br />
        {/* <Location></Location> */}
        {venuesArray.length > 0 && <Map fixtureVenues={venuesArray} />}
      </div>
    </Layout>
  );
}
