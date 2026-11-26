# Marine Traffic API Exploration

A Node.js/Express application for exploring and integrating with the **MarineTraffic API**. This project demonstrates how to interact with MarineTraffic's fleet management and vessel tracking endpoints.

## Project Overview

This exploration project provides HTTP endpoints that wrap the MarineTraffic APIs, allowing you to:
- Retrieve fleet information
- Add/update vessels in a fleet
- Track vessel positions and real-time data
- Access detailed vessel information (location, speed, destination, etc.)

## Prerequisites

- **Node.js** (v14 or higher)
- **Yarn** or NPM package manager
- **MarineTraffic API Keys** (4 different keys required for different operations)

## MarineTraffic API Keys Required

To use this application, you need to obtain 4 separate API keys from MarineTraffic:

1. **MARINE_TRAFFIC_FLEET_LIST_API_KEY** - For retrieving available fleets
2. **MARINE_TRAFFIC_UPDATE_FLEET_API_KEY** - For adding/updating vessels in a fleet
3. **MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY** - For retrieving vessels from a fleet
4. **MARINE_TRAFFIC_GREENVERSE_API_KEY** - For accessing vessel positions and tracking data

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd marine_traffic_exploration
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables:**
   - Copy `default.env` to `.env`
   - Add your MarineTraffic API keys to the `.env` file:
     ```env
     MARINE_TRAFFIC_FLEET_LIST_API_KEY="your_key_here"
     MARINE_TRAFFIC_UPDATE_FLEET_API_KEY="your_key_here"
     MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY="your_key_here"
     MARINE_TRAFFIC_GREENVERSE_API_KEY="your_key_here"
     ```

## Running the Application

Start the Express server:
```bash
npm start
# or
yarn start
```

The server will start on **http://localhost:3000**

## API Endpoints

### 1. Get Fleet List
**Endpoint:** `GET /fleet`

Retrieves all available fleets configured in your MarineTraffic account.

**Response:**
```json
[
  {
    "ID": "3521664",
    "NAME": "Demo Environment Fleet",
    "ACTIVE": 1,
    "CREATED": "2026-05-28 15:40:00",
    "DEFAULT": 1
  }
]
```

---

### 2. Add/Update Vessel to Fleet
**Endpoint:** `POST /setfleet`

Adds or updates a vessel in the fleet using its MMSI (Maritime Mobile Service Identity) number.

**Request Body:**
```json
{
  "mmsi": 538008212
}
```

**Response:** Fleet update confirmation from MarineTraffic API

---

### 3. Retrieve Fleet Vessels
**Endpoint:** `GET /getfleet`

Retrieves all vessels currently available in the configured fleet.

**Response:**
```json
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
```

---

### 4. Get Vessel Positions
**Endpoint:** `GET /positions`

Retrieves real-time positions and detailed vessel information for all vessels in the fleet.

**Response:**
```json
{
  "METADATA": {
    "CURSOR": "",
    "DATE_FROM": "2026-06-10 10:41:03",
    "DATE_TO": "2026-06-10 10:46:03"
  },
  "DATA": [
    {
      "MMSI": "230174300",
      "SHIP_ID": "311905",
      "LAT": "60.491055",
      "LON": "21.222521",
      "SPEED": "86",
      "HEADING": "225",
      "COURSE": "226",
      "SHIPNAME": "FEDJEFJORD",
      "DESTINATION": "OSNAS - AAVA - OSNAP",
      "ETA": "2026-06-10T12:33:00",
      "FLAG": "FI",
      "SHIP_COUNTRY": "FINLAND",
      "LAST_PORT": "VUOSNAINEN",
      "NEXT_PORT_NAME": "VUOSNAINEN"
    }
  ]
}
```

## Project Structure

```
marine_traffic_exploration/
├── index.js                  # Main Express server with API endpoints
├── MarineTrafficClient.js    # MarineTraffic API client class (reusable)
├── package.json              # Project dependencies and configuration
├── default.env               # Example environment variables
└── README.md                 # This file
```

## File Descriptions

### index.js
The main Express server that:
- Initializes an Express app with JSON middleware
- Loads MarineTraffic API keys from environment variables
- Implements 4 HTTP endpoints that interact with the MarineTraffic API
- Handles errors and sends appropriate HTTP responses

### MarineTrafficClient.js
A reusable client class for MarineTraffic API interactions:
- Provides a clean abstraction layer over Axios HTTP client
- Handles API URL building and parameter formatting
- Provides methods for common operations (getFleets, addVessel, getFleet, etc.)
- Centralizes error handling and logging

## Code Review Summary

### Strengths ✅
- **Clear endpoint organization** - Well-commented sections separate functionality
- **Reusable client class** - `MarineTrafficClient.js` provides a good foundation for decoupling API logic
- **Comprehensive error handling** - Errors are caught and returned to the client with status codes
- **Detailed response documentation** - Response examples are included for each endpoint
- **Environment variable management** - API keys are properly stored in environment variables

### Recommendations & Observations 🔍

1. **API Key Configuration Mismatch**
   - The `index.js` uses multiple specialized API keys (one per operation)
   - The `MarineTrafficClient.js` expects a single generic `MARINE_TRAFFIC_API_KEY`
   - Consider standardizing the key naming convention across both files

2. **Error Handling Enhancement**
   - Currently, errors return raw API response data
   - Consider wrapping errors in a consistent error format for better client-side handling

3. **Input Validation**
   - The `/setfleet` endpoint validates MMSI presence, but could benefit from format validation
   - Consider validating MMSI format (should be 9 digits)

4. **Code Organization**
   - Consider refactoring `index.js` to use the `MarineTrafficClient.js` class instead of direct axios calls
   - This would improve maintainability and reduce code duplication

5. **Rate Limiting**
   - No rate limiting is implemented
   - Consider adding rate limiting middleware for production use

6. **Logging**
   - Consider implementing structured logging instead of console.log for better debugging and monitoring

7. **Documentation**
   - API documentation is thorough in comments
   - Consider adding JSDoc comments for better IDE support

## Usage Example

### cURL Example - Get Fleet Vessels

```bash
curl http://localhost:3000/getfleet
```

### Node.js Example

```javascript
const axios = require('axios');

// Get vessel positions
const positions = await axios.get('http://localhost:3000/positions');
console.log(positions.data.DATA);

// Add a vessel to fleet
const addVessel = await axios.post('http://localhost:3000/setfleet', {
  mmsi: 538008212
});
console.log(addVessel.data);
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `MARINE_TRAFFIC_FLEET_LIST_API_KEY` | Get fleet list | Yes |
| `MARINE_TRAFFIC_UPDATE_FLEET_API_KEY` | Add/update vessels | Yes |
| `MARINE_TRAFFIC_RETRIEVE_FLEET_API_KEY` | Retrieve fleet vessels | Yes |
| `MARINE_TRAFFIC_GREENVERSE_API_KEY` | Get vessel positions | Yes |

## MarineTraffic API Base URL

All requests are sent to: `https://services.marinetraffic.com/api`

## Dependencies

- **express** (^5.1.0) - Web framework
- **axios** (^1.11.0) - HTTP client
- **nodemon** (^3.1.14) - Development tool for auto-restarting on file changes

## License

This is an exploration/demo project. Refer to MarineTraffic's terms of service for API usage.

## Resources

- [MarineTraffic API Documentation](https://www.marinetraffic.com/en/ais-api-services)
- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)

---

**Project Date:** June 2026  
**Status:** Active Exploration