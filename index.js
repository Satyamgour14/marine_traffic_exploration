require('dotenv').config()
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// =================================
// MARINE TRAFFIC REQUIRED API KEYS
// =================================

const MARINE_TRAFFIC_FLEET_LIST_API_KEY = process.env.MARINE_TRAFFIC_FLEET_LIST_API_KEY;
const MARINE_TRAFFIC_UPDATE_FLEET_API_KEY = process.env.MARINE_TRAFFIC_UPDATE_FLEET_API_KEY;
const MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY = process.env.MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY;
const MARINE_TRAFFIC_GREENVERSE_API_KEY = process.env.MARINE_TRAFFIC_GREENVERSE_API_KEY;

const BASE_URL = "https://services.marinetraffic.com/api";


// ============================================================
// 1. Get Fleet ID
// ============================================================

/**
 * Retrive fleet list
 * API:
 * GET - /fleet/{MARINE_TRAFFIC_FLEET_LIST_API_KEY}
 * "MARINE_TRAFFIC_FLEET_LIST_API_KEY" is required in URL to access fleet list
 */

app.get("/fleet", async (req, res) => {
    try {
        const url =
            `${BASE_URL}/getfleets/${MARINE_TRAFFIC_FLEET_LIST_API_KEY}?protocol=jsono`;

        const response = await axios.get(url);

        res.json(response.data);
    } catch (err) {
        res.status(500).json(
            err.response?.data || err.message
        );
    }
});




// ============================================================
// 2. Add/Update Vessel To Fleet
// ============================================================

/**
 * Add or Update vessels in the fleet
 * 
 * API:
 * POST - /setfleet/{MARINE_TRAFFIC_UPDATE_FLEET_API_KEY}
 * MARINE_TRAFFIC_UPDATE_FLEET_API_KEY is required to set vessel in the fleet
 * Required Parameter in body - { mmsi: 538008212 }
 */

app.post("/setfleet", async (req, res) => {
    try {
        const { mmsi } = req.body;

        if (!mmsi) {
            return res.status(400).json({ message: "mmsi is required" });
        }

        const url = `${BASE_URL}/setfleet/${MARINE_TRAFFIC_UPDATE_FLEET_API_KEY}`;
        const params = {
            mmsi: mmsi,
            active: 1
        }

        const response = await axios.get(url, { params });

        res.send(response.data);
    } catch (err) {
        console.log("Error adding vessel to fleet:", err);
        res.status(500).json(err.response?.data || err.message);
    }
});



// ============================================================
// 3. Retrieve all vessels currently available in the configured fleet
// ============================================================

/**
 * Retrieve all vessels currently available in the configured fleet.
 * 
 * API:
 * GET - /getfleet/{MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY}
 * MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY is required to get vessel from the fleet
 */

app.get("/getfleet", async (req, res) => {
    try {

        const url = `${BASE_URL}/getfleet/${MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY}`;

        const response = await axios.get(url, {
            params: {
                protocol: "jsono",
                v: 2
            }
        });

        res.send(response.data);
    } catch (err) {
        console.log("Error retrieving fleet:", err);
        res.status(500).json(
            err.response?.data || err.message
        );
    }
});




// ============================================================
// 4. Get Vessel Positions
// ============================================================

/**
 * Retrieve Vessel Positions which is available in fleet.
 * 
 * API:
 * GET - /exportvessels/{MARINE_TRAFFIC_GREENVERSE_API_KEY}
 * MARINE_TRAFFIC_GREENVERSE_API_KEY is required to get vessel from the fleet
 */

app.get("/positions", async (req, res) => {
    try {
        const url = `${BASE_URL}/exportvessels/${MARINE_TRAFFIC_GREENVERSE_API_KEY}`;

        const response = await axios.get(url, {
            params: {
                v: 9,
                protocol: "jsono"
            }
        });

        res.json(response.data);
    } catch (err) {
        console.log("Error adding vessel to fleet:", err);
        res.status(500).json(err.response?.data || err.message);
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});