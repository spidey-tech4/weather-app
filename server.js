const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Weather App');
});

app.post('/fetchWeather', (req, res) => {
    const location = req.body.location;
    const apiKey = '66ab58389dee507382af1ecb504c156e'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    axios.get(url)
        .then(response => {
            checkForExtremeWeather(response.data);
            res.send(response.data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            res.status(500).send('Error fetching weather data');
        });
});

function checkForExtremeWeather(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const tempThreshold = 42; 
    const humidityThreshold = 90;
    const windSpeedThreshold = 20; 

    if (temp > tempThreshold || humidity > humidityThreshold || windSpeed > windSpeedThreshold) {
        sendAlertEmail(data.name, temp, humidity, windSpeed);
    }
}

function sendAlertEmail(location, temp, humidity, windSpeed) {
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jesusgiri597@gmail.com',
            pass: 'Jesus@123'
        }
    });

    const mailOptions = {
        from: 'jesusgiri597@gmail.com',
        to: 'recipient-mrstark@gmail.com',
        subject: 'Extreme Weather Alert',
        text: `Extreme weather detected in ${location}:\nTemperature: ${temp}°C\nHumidity: ${humidity}%\nWind Speed: ${windSpeed} m/s`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.listen(3000, () => {
    console.log(`Server running on http://localhost:${port}`);
});
