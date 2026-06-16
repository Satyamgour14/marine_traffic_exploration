const axios = require("axios");

class MarineTrafficClient {
    /**
     * MarineTraffic API Client
     *
     * Handles all communication with MarineTraffic APIs.
     * This class should only be responsible for:
     * - Building API URLs
     * - Sending HTTP requests
     * - Handling API-level errors
     */
    constructor() {
        this.baseUrl = process.env.MARINE_TRAFFIC_BASE_URL || "https://services.marinetraffic.com/api";

        this.apiKey = process.env.MARINE_TRAFFIC_API_KEY;

        if (!this.apiKey) {
            throw new Error("MARINE_TRAFFIC_API_KEY is missing.");
        }

        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            timeout: 30000
        });
    }

    /**
     * Common request handler
     *
     * @param {String} endpoint
     * @param {Object} params
     * @returns {Promise<Object>}
     */
    async makeRequest(endpoint, params = {}) {
        try {
            const response = await this.httpClient.get(endpoint, {
                params
            });

            return response.data;
        } catch (error) {
            console.error("MarineTraffic API Error:", {
                endpoint,
                params,
                message: error.message,
                response: error.response?.data
            });

            throw error;
        }
    }

    /**
     * Fetch all available fleets.
     *
     * @returns {Promise<Array>}
     */
    async getFleets() {
        const endpoint = `/exportvessel/v:8/${this.apiKey}`;

        return this.makeRequest(endpoint);
    }

    /**
     * Add vessel into fleet.
     *
     * Called when a user adds a vessel from UI.
     *
     * @param {String|Number} mmsi
     * @returns {Promise<Object>}
     */
    async addVessel(mmsi) {
        const endpoint = `/fleet/addvessel/${this.apiKey}`;

        return this.makeRequest(endpoint, {
            mmsi,
            active: 1
        });
    }

    /**
     * Get fleet details.
     *
     * @returns {Promise<Object>}
     */
    async getFleet() {
        const endpoint = `/fleet/getfleet/${this.apiKey}`;

        return this.makeRequest(endpoint, {
            protocol: "jsono",
            v: 2
        });
    }

    /**
     * Fetch latest vessel positions
     * for all vessels available in fleet.
     *
     * Used by background sync job.
     *
     * @returns {Promise<Array>}
     */
    async getFleetPositions() {
        const endpoint = `/fleet/getfleetpositions/${this.apiKey}`;

        return this.makeRequest(endpoint, {
            protocol: "jsono",
            v: 9
        });
    }

    /**
     * Fetch vessel details by MMSI.
     *
     * Optional helper for future requirements.
     *
     * @param {String|Number} mmsi
     * @returns {Promise<Object>}
     */
    async getVesselDetails(mmsi) {
        const endpoint = `/exportvessel/v:8/${this.apiKey}`;

        return this.makeRequest(endpoint, {
            mmsi,
            protocol: "jsono"
        });
    }
}

module.exports = MarineTrafficClient;