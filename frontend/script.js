document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const isTrackerPage = !!document.getElementById('orbitCanvas');

    if (isTrackerPage) {
        initTrackerPage();
    }
});

function initTrackerPage() {
    initOrbitSimulation();
    initNASAFeed();
    initVideoUpload();
    checkBackendConnection();
}

/**
 * 1. ORBIT SIMULATION (Canvas)
 * Draws a simple top-down orbital view with random asteroids
 */
function initOrbitSimulation() {
    const canvas = document.getElementById('orbitCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        createStars(); // Regenerate stars on resize
    }
    window.addEventListener('resize', resize);
    
    // ================= CONSTANTS =================
    const GRAVITY_SCALE = 0.15;
    const DANGER_RADIUS = 100; // Zone close to Earth
    const MAX_TRAIL_LENGTH = 20;
    const EARTH = { radius: 15, color: '#3b82f6' }; // Blue Earth
    
    // ================= START BACKGROUND =================
    const stars = [];
    const STAR_COUNT = 200;

    function createStars() {
        stars.length = 0;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.5,
                alpha: 0.2 + Math.random() * 0.5
            });
        }
    }

    function drawStars() {
        stars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
            ctx.fill();
        });
    }

    // ================= ASTEROIDS =================
    const asteroids = [];
    const COUNT = 35; // Number of asteroids

    // Initialize Asteroids with elliptical orbits
    for (let i = 0; i < COUNT; i++) {
        let a, b;
        
        // Create some close ones and some far ones
        if (i < 5) {
            a = 60 + Math.random() * 40; // Semi-major axis
            b = a * (0.8 + Math.random() * 0.2); // Semi-minor axis
        } else {
            a = 150 + Math.random() * 200;
            b = a * (0.6 + Math.random() * 0.4);
        }

        asteroids.push({
            a, b,
            angle: Math.random() * Math.PI * 2,
            size: 2 + Math.random() * 2,
            trail: [],
            x: 0, y: 0, r: 0,
            vx: 0, vy: 0,
            state: "normal", // normal, near, hit, predict
            speedMultiplier: 1.0 // Base speed
        });
    }

    // ================= UPDATE LOGIC =================
    function updateAsteroid(a, cx, cy) {
        // Calculate Position on Ellipse
        // Using simplified Kepler approximation for visuals:
        // Speed is faster when closer (r is smaller)
        
        const x = cx + a.a * Math.cos(a.angle);
        const y = cy + a.b * Math.sin(a.angle);

        const dx = x - cx;
        const dy = y - cy;
        const r = Math.sqrt(dx * dx + dy * dy);

        // Speed varies by distance to simulate gravity
        const speed = (GRAVITY_SCALE / Math.sqrt(r)) * a.speedMultiplier;

        // Velocity approximation (tangent) - for prediction logic if needed
        a.vx = -Math.sin(a.angle) * speed * a.a;
        a.vy =  Math.cos(a.angle) * speed * a.b;

        a.angle += speed;
        a.x = x;
        a.y = y;
        a.r = r;

        // Trail Logic
        if (showTrails) { 
            a.trail.push({ x, y });
            if (a.trail.length > MAX_TRAIL_LENGTH) {
                a.trail.shift();
            }
        } else {
            a.trail = [];
        }
    }

    function checkCollision(a) {
        a.state = "normal";

        if (a.r < DANGER_RADIUS) {
            a.state = "near";
            if (a.r <= EARTH.radius + a.size + 5) {
                a.state = "hit"; // Very close
            }
        }
    }

    // ================= DRAW LOGIC =================
    function drawEarth(cx, cy) {
        // Glow
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#3b82f6';
        ctx.beginPath();
        ctx.arc(cx, cy, EARTH.radius, 0, Math.PI * 2);
        ctx.fillStyle = EARTH.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Atmosphere ring
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, DANGER_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawTrails(a) {
        if (a.trail.length < 2) return;
        
        ctx.beginPath();
        for (let i = 0; i < a.trail.length - 1; i++) {
            const p1 = a.trail[i];
            const p2 = a.trail[i+1];
            
            // Fade out trail
            const alpha = (i / a.trail.length) * 0.5;
            ctx.strokeStyle = (a.state === 'near' || a.state === 'hit') 
                ? `rgba(249, 115, 22, ${alpha})` // Orange trace for danger
                : `rgba(255, 255, 255, ${alpha})`; // White trace for normal
            
            ctx.lineWidth = i * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }

    function drawAsteroid(a) {
        drawTrails(a);

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);

        if (a.state === "hit") {
            ctx.fillStyle = "#ef4444"; // Red
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#ef4444";
        } else if (a.state === "near") {
            ctx.fillStyle = "#f97316"; // Orange
            ctx.shadowBlur = 5;
            ctx.shadowColor = "#f97316";
        } else {
            ctx.fillStyle = "#94a3b8"; // Slate / Grey
            ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ================= LOOP =================
    resize(); // Initial resize

    // State Variables for Controls
    let showTrails = true;
    let isPaused = false;
    let speedMultiplier = 1;

    // Attach Event Listeners to UI Controls
    const trailBtn = document.getElementById("trailToggle");
    const playPauseBtn = document.getElementById("playPause");
    const speedSlider = document.getElementById("speedSlider");

    if (trailBtn) {
        trailBtn.onclick = () => {
            showTrails = !showTrails;
            trailBtn.innerText = showTrails ? "Hide Trails" : "Show Trails";
        };
    }

    if (playPauseBtn) {
        playPauseBtn.onclick = () => {
            isPaused = !isPaused;
            playPauseBtn.innerText = isPaused ? "Play" : "Pause";
        };
    }

    if (speedSlider) {
        speedSlider.oninput = () => {
            // Map 1-100 slider to 0.1-3.0 multiplier
            speedMultiplier = speedSlider.value / 40; 
        };
    }
    
    function animate() {
        if (isPaused) {
            requestAnimationFrame(animate);
            return;
        }

        const cx = width / 2;
        const cy = height / 2;

        ctx.clearRect(0, 0, width, height); // Clear canvas

        drawStars();
        drawEarth(cx, cy);

        let activeHazards = 0;

        asteroids.forEach(a => {
            // Update Speed multiplier
            a.speedMultiplier = speedMultiplier;

            updateAsteroid(a, cx, cy);
            checkCollision(a);
            drawAsteroid(a);
            
            if (a.state !== 'normal') activeHazards++;
        });

        // Update DOM stats
        const trackedEl = document.getElementById('trackedCount');
        const hazardousEl = document.getElementById('hazardousCount');
        
        if(trackedEl) trackedEl.innerText = asteroids.length;
        if(hazardousEl) hazardousEl.innerText = activeHazards;

        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * 2. NASA FEED INTEGRATION
 * Fastapi Endpoint: GET http://localhost:8000/nasa-feed (Assumed)
 */
async function initNASAFeed() {
    const listContainer = document.getElementById('asteroidList');
    
    // Sample Data (Fallback)
    const fallbackData = [
        { "id": "54339214", "name": "(2023 BG)", "hazardous": false, "absolute_magnitude": 23.29, "estimated_diameter_km": 0.1306, "distance_km": 58897674, "velocity_km_s": 22.51, "approach_date": "2026-01-19" },
        { "id": "54337572", "name": "(2022 YT6)", "hazardous": false, "absolute_magnitude": 26.15, "estimated_diameter_km": 0.0350, "distance_km": 63686680, "velocity_km_s": 21.00, "approach_date": "2026-01-19" },
        { "id": "54476945", "name": "(2024 RO43)", "hazardous": true, "absolute_magnitude": 24.76, "estimated_diameter_km": 0.0664, "distance_km": 37226343, "velocity_km_s": 6.75, "approach_date": "2026-01-19" },
        { "id": "54520800", "name": "(2025 DB7)", "hazardous": false, "absolute_magnitude": 27.28, "estimated_diameter_km": 0.0208, "distance_km": 14315379, "velocity_km_s": 2.61, "approach_date": "2026-01-19" }
    ];

    try {
        // Try fetching from local backend
        // Assuming the endpoint provided by user logic: "nasa ki api... usko bhi maine fastapi pe daal rakha h"
        // Let's try to hit a common endpoint or use fallback if it fails
        const response = await fetch('http://localhost:8000/asteroids'); 
        if (!response.ok) throw new Error("API not reachable");
        
        const data = await response.json();
        renderAsteroidList(data, listContainer);
        document.querySelector('.hint').textContent = 'Live Data from NASA API';

    } catch (err) {
        console.warn('Backend API not found, using sample data:', err);
        renderAsteroidList(fallbackData, listContainer);
        document.querySelector('.hint').textContent = 'Displaying Cached Data (Backend Offline)';
    }
}

function renderAsteroidList(data, container) {
    container.innerHTML = '';
    data.forEach(asteroid => {
        const item = document.createElement('div');
        item.className = 'asteroid-item';
        // Add red border if hazardous
        if (asteroid.hazardous) {
            item.style.borderLeftColor = 'var(--accent-orange)';
        }

        item.innerHTML = `
            <div class="asteroid-name">${asteroid.name}</div>
            <div class="asteroid-meta">
                Dia: ${parseFloat(asteroid.estimated_diameter_km).toFixed(4)} km • 
                Vel: ${parseFloat(asteroid.velocity_km_s).toFixed(1)} km/s
            </div>
            <div class="asteroid-meta" style="margin-top: 2px;">
                Dist: ${(parseInt(asteroid.distance_km) / 1000000).toFixed(2)}M km
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * 3. ASTER DETECTION VIDEO UPLOAD
 * Fastapi Endpoint: POST http://localhost:8000/asteroids
 */
function initVideoUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const statusText = document.getElementById('uploadStatus'); // NOTE: We will use this container for results
    const videoContainer = document.getElementById('videoResultContainer');
    const processedVideo = document.getElementById('processedVideo');
    
    let selectedFile = null;

    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3b82f6';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    function handleFile(file) {
        if (!file.type.startsWith('video/')) {
            alert('Please upload a video file.');
            return;
        }
        selectedFile = file;
        dropZone.querySelector('p').innerText = `Selected: ${file.name}`;
    }

    uploadBtn.addEventListener('click', async () => {
        const uploadStatus = document.getElementById('uploadStatus');
        
        if (!selectedFile) {
            alert('Please select a video file first.');
            return;
        }

        uploadStatus.innerText = 'Uploading and processing... This may take a moment.';
        uploadStatus.classList.remove('error');
        uploadBtn.disabled = true;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Hit the FastAPI endpoint designated for video processing
            const response = await fetch('http://localhost:8000/detect/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Processing failed');

            // Handle response: The backend now returns the PROCESSED VIDEO FILE (Blob)
            // with annotations and stats burnt into the frames.
            const blob = await response.blob();
            const videoUrl = URL.createObjectURL(blob);
            
            // Show result
            uploadStatus.innerHTML = '<span style="color:#4ade80">Analysis Complete! Stats overlaid on video.</span>';
            statusText.classList.remove('error');
            
            // Play the processed video from server
            processedVideo.src = videoUrl;
            videoContainer.style.display = 'block';
            processedVideo.play();

        } catch (error) {
            console.error(error);
            statusText.innerText = 'Error: Could not connect to backend processor.';
            statusText.classList.add('error');
        } finally {
            uploadBtn.disabled = false;
        }
    });
}

/**
 * Utility: connection check
 */
async function checkBackendConnection() {
    const statusEl = document.getElementById('connectionStatus');
    try {
        await fetch('http://localhost:8000/');
        statusEl.innerText = 'Online (Low Latency)';
        statusEl.style.color = '#4ade80';
    } catch (e) {
        statusEl.innerText = 'Offline / Local Mode';
        statusEl.style.color = '#fcd34d';
    }
}