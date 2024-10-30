// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const Home = () => {
    const [priceData, setPriceData] = useState([]);
    const [demandData, setDemandData] = useState([]);
    const [supplyData, setSupplyData] = useState([]);
    const [labels, setLabels] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pricing');
            const { price, demand, supply, timestamp } = response.data;

            // Set data for chart
            setPriceData(prevData => [...prevData, price]);
            setDemandData(prevData => [...prevData, demand]);
            setSupplyData(prevData => [...prevData, supply]);
            setLabels(prevLabels => [...prevLabels, new Date(timestamp).toLocaleTimeString()]);

            // Trigger alert if price is above or below thresholds
            if (price > 90) {
                alert('Price Alert: Energy price is very high!');
            } else if (price < 20) {
                alert('Price Alert: Energy price is very low!');
            }
        } catch (error) {
            console.error('Error fetching pricing data:', error);
        }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
}, []);


    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Energy Price ($)',
                data: priceData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Demand',
                data: demandData,
                borderColor: 'rgb(255, 99, 132)',
                borderDash: [5, 5],
                tension: 0.1,
            },
            {
                label: 'Supply',
                data: supplyData,
                borderColor: 'rgb(54, 162, 235)',
                borderDash: [5, 5],
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="App">
            <h1>Real-Time Energy Pricing Dashboard</h1>
            <Line data={chartData} />
        </div>
    );
};

export default Home;
