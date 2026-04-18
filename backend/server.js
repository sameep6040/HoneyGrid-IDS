const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const geoip = require('geoip-lite'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());


app.post('/api/report', (req, res) => {
    const { ip, type, payload, risk_score } = req.body;
    
   
    const geo = geoip.lookup(ip) || { ll: [40.7128, -74.0060], city: "Threat Origin" };

   
    const alertData = {
        ip: ip,
        type: type,
        payload: payload || "No payload data",
        risk: risk_score || 50,
        reputation: risk_score > 70 ? "KNOWN_BAD" : "SUSPICIOUS",
        city: geo.city,
        coords: geo.ll, 
        time: new Date().toLocaleTimeString(),
        id: Math.random().toString(36).substr(2, 9)
    };

    console.log(`🚨 ALERT: ${type} from ${geo.city} (${ip})`);
    
    
    io.emit('new-attack', alertData);
    res.status(200).send("Analyzed and Logged");
});

server.listen(8080, () => console.log("🚀 Unified IDS Brain Live on Port 8080"));
