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

/* Response:
[
    {
        "ID": "3521664",
        "NAME": "Demo Environment Fleet",
        "ACTIVE": 1,
        "CREATED": "2026-05-28 15:40:00",
        "DEFAULT": 1
    }
] 
*/



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

/**
 * Response:
    {
        "METADATA": {
            "INACTIVE": 0,
            "TERRESTRIAL": 1,
            "SATELLITE": 0,
            "TOTAL_RESULTS": 1,
            "TOTAL_PAGES": 1,
            "CURRENT_PAGE": 1
        },
        "DATA": [
            {
                "SHIP_ID": "311905",
                "MMSI": "230174300",
                "IMO": "9236767",
                "SHIPNAME": "FEDJEFJORD",
                "ACTIVE": "1"
            }
        ]
    }
 */



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

/**
 * Response:
    {
        "METADATA": {
            "CURSOR": "",
            "DATE_FROM": "2026-06-10 10:41:03",
            "DATE_TO": "2026-06-10 10:46:03"
        },
        "DATA": [
            {
                "MMSI": "230174300",
                "IMO": "9236767",
                "SHIP_ID": "311905",
                "LAT": "60.491055",
                "LON": "21.222521",
                "SPEED": "86",
                "HEADING": "225",
                "COURSE": "226",
                "STATUS": "0",
                "TIMESTAMP": "2026-06-10T10:43:58",
                "DSRC": "TER",
                "UTC_SECONDS": "18",
                "MARKET": "PASSENGER SHIPS",
                "SHIPNAME": "FEDJEFJORD",
                "SHIPTYPE": "60",
                "CALLSIGN": "OJUI",
                "FLAG": "FI",
                "LENGTH": "63.549999",
                "WIDTH": "13.2",
                "GRT": "2232",
                "DWT": "300",
                "DRAUGHT": "43",
                "YEAR_BUILT": "2001",
                "SHIP_COUNTRY": "FINLAND",
                "SHIP_CLASS": null,
                "ROT": "0",
                "TYPE_NAME": "Ro-Ro/Passenger Ship",
                "AIS_TYPE_SUMMARY": "Passenger",
                "DESTINATION": "OSNAS - AAVA - OSNAP",
                "ETA": "2026-06-10T12:33:00",
                "L_FORE": "34",
                "W_LEFT": "7",
                "LAST_PORT": "VUOSNAINEN",
                "LAST_PORT_TIME": "2026-06-10T10:38:00",
                "LAST_PORT_ID": "4917",
                "LAST_PORT_UNLOCODE": "FIVSN",
                "LAST_PORT_COUNTRY": "FI",
                "CURRENT_PORT": null,
                "CURRENT_PORT_ID": null,
                "CURRENT_PORT_UNLOCODE": null,
                "CURRENT_PORT_COUNTRY": null,
                "NEXT_PORT_ID": "4917",
                "NEXT_PORT_UNLOCODE": "FIVSN",
                "NEXT_PORT_NAME": "VUOSNAINEN",
                "NEXT_PORT_COUNTRY": "FI",
                "ETA_CALC": null,
                "ETA_UPDATED": null,
                "DISTANCE_TO_GO": "0",
                "DISTANCE_TRAVELLED": "1",
                "AVG_SPEED": "9.6999998",
                "MAX_SPEED": "10.5"
            }
        ]
    }
 */

app.listen(3000, () => {
    console.log("Server running on port 3000");
});