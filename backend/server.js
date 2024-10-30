// server.js
const express = require('express');
const { KafkaClient, Consumer } = require('kafka-node');
const logger = require('./logger');

const app = express();
const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(client, [{ topic: 'energy-data', partition: 0 }], { autoCommit: true });

app.get('/real-time-data', (req, res) => {
    consumer.on('message', (message) => {
        logger.info(`Received Kafka message: ${message.value}`);
        res.send(JSON.parse(message.value));
    });

    consumer.on('error', (err) => logger.error(`Kafka Consumer Error: ${err}`));
});

app.listen(5000, () => logger.info('Express server with Kafka consumer running on port 5000'));
