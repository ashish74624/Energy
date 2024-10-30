import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

const App = () => {
    const [priceData, setPriceData] = useState([]);
    const [demandData, setDemandData] = useState([]);
    const [supplyData, setSupplyData] = useState([]);
    const [labels, setLabels] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/pricing');
                const { price, demand, supply, timestamp } = response.data;

                // Update data for chart
                setPriceData(prevData => [...prevData, price]);
                setDemandData(prevData => [...prevData, demand]);
                setSupplyData(prevData => [...prevData, supply]);
                setLabels(prevLabels => [...prevLabels, new Date(timestamp).toLocaleTimeString()]);

                // Trigger alerts based on price threshold
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

    useEffect(() => {
    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });

    // Force the chart to update with new data
    chartInstance.current.update();

    return () => {
        if (chartInstance.current) chartInstance.current.destroy();
    };
}, [priceData, demandData, supplyData, labels]);


    return (
        <div className="App">
            <h1>Real-Time Energy Pricing Dashboard</h1>
            <canvas ref={chartRef} width="600" height="400" />
        </div>
    );
};

export default App;
