const { Kafka } = require('kafkajs');
const express = require('express');
const app = express();
const port = 5000; // Port for the Express server

// In-memory storage for latest data
let latestData = {
  price: null,
  demand: null,
  supply: null,
  timestamp: null,
};

// Kafka setup
const kafka = new Kafka({
  clientId: 'energy-pricing-app',
  brokers: ['localhost:9092']  // Adjust to your Kafka broker address
});
const consumer = kafka.consumer({ groupId: 'energy-pricing-group' });

// Function to run the Kafka consumer
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'energy-pricing-topic', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        // Update latestData with new values from Kafka
        latestData = {
          price: data.price,
          demand: data.demand,
          supply: data.supply,
          timestamp: data.timestamp,
        };

        console.log("Received new data:", latestData);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
  });
};

// API endpoint for the frontend to fetch the latest data
app.get('/api/real-time-data', (req, res) => {
  res.json(latestData);
});

// Start Express server and run Kafka consumer
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  runConsumer().catch(error => console.error("Error running consumer:", error));
});
