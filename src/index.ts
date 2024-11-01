import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Flight Status API");
});

app.get("/api/flight-status", async (req: Request, res: Response) => {
  const { schStTime, schEdTime, schLineType, schIOType, schAirCode, pageNo } =
    req.query;

  if (schAirCode !== "ICN") {
    try {
      const apiUrl = `http://openapi.airport.co.kr/service/rest/FlightStatusList/getFlightStatusList?ServiceKey=${process.env.API_KEY}&schStTime=${schStTime}&schEdTime=${schEdTime}&schLineType=${schLineType}&schIOType=${schIOType}&schAirCode=${schAirCode}&pageNo=${pageNo}`;

      const response = await axios.get(apiUrl);

      res.json(response.data);
    } catch (error) {
      console.error("Error fetching flight status:", error);
      res.status(500).send("Error fetching flight status");
    }
  } else if (schAirCode === "ICN") {
    if (schIOType === "O") {
      try {
        const apiUrl = `https://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp/getPassengerDeparturesOdp?serviceKey=${process.env.API_KEY}&from_time=${schStTime}&to_time=${schEdTime}&type=json`;

        const response = await axios.get(apiUrl);

        res.json(response.data);
      } catch (error) {
        console.error("Error fetching flight status:", error);
        res.status(500).send("Error fetching flight status");
      }
    } else {
      try {
        const apiUrl = `https://apis.data.go.kr/B551177/StatusOfPassengerFlightsOdp/getPassengerArrivalsOdp?serviceKey=${process.env.API_KEY}&from_time=${schStTime}&to_time=${schEdTime}&type=json`;

        const response = await axios.get(apiUrl);

        res.json(response.data);
      } catch (error) {
        console.error("Error fetching flight status:", error);
        res.status(500).send("Error fetching flight status");
      }
    }
  }
});

app.listen(8080, () => {
  console.log(`Server running on http://localhost:${8080}`);
});
