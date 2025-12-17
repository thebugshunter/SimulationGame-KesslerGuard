# **App Name**: OrbitalSync

## Core Features:

- High-Fidelity 3D Rendering: Visually accurate representation of Earth, space debris, rocket/spaceship launches, real satellites, asteroids, comets and Janitor Pod using WebGL (Babylon.js, Three.js) and realistic mock data for object positioning and physics, including lighting/shadowing effects based on the sun and moon positions. Space and sci-fi effects will enhance the visual experience. Includes outerspace with milkyway views and asteroid belts, the maximum distance for the pod can go further then the moon, it can fly to it and land there as the station is there too.
- First-Person Pod View: Default camera perspective from inside the 'Garbageman' Pod, with simulated movement (thrust, rotation) affecting the entire 3D scene to give an immersive feel. Allow the user to look around in 360 degrees inside the pod. Inside the pod, cool futuristic tools for dark mode lighting up, as its dark arounds us but inside pod it can look different as the lights from the sun affect but also surrounding stuff, so we can get a realistic vibe.
- Object Data Filtering and Views: Allow the player to use multiple filters. Also allow the player to zoom and change view- to filter, inspect target objects (satellites, debris) by object properties for prioritization and avoidance, aiding decision-making, displaying relevant components of space junk, working vs defunct status, comets/asteroids/ natural and man made space borne objects etc.
- Adaptive Input System: Support WASD/mouse input for desktop and mobile tilt controls (device orientation/touch joystick) for steering, alongside on-screen buttons for core actions.
- Collapsible Terminal UI: Implement a toggleable 'DATA/MENU' button to hide/show the full Terminal UI (chat, alarms, resource indicators), maximizing screen space for the 3D view.
- Learning Module: A dynamic walkthrough to welcome first time players and explain mission goals and controls, also present how to utilize scan and change view, and introduces cool tools to take care of objects like a magnet, plasma burner, robot hands, and a vacuum sucker.
- Kessler Event Prediction: Uses object trajectory, velocity, and estimated mass as tool to provide the predicted debris spread and a 'Kessler Event Likelihood Score'. Uses a simple bot for now to generate realistic mock data. The fake AI in the game helps, but isn't always right, requiring the gamer to experiment with tools.
- Multiplayer Mode: Allows two players to play the game cooperatively on the same computer or online.
- Object Scanning and Analysis: Players use a scan tool for realistic mockup data scans, providing different data depending on the spectrum used. The pod terminal displays information to determine appropriate actions. Scans give the most data to understand the object, but using too many tools or intervening incorrectly can lead to problems, like damaging satellites or causing the pod to break down.

## Style Guidelines:

- Primary color: Deep space blue (#003049) to evoke the vastness and mystery of space.
- Background color: Near-black, desaturated dark gray (#111315) to provide high contrast and let the scene and UI elements stand out.
- Accent color: Electric blue (#40E0D0) to highlight interactive elements and important information within the UI.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a modern, machined, objective, neutral look suitable for both headlines and body text.
- Use vector icons with a consistent line weight, styled with the electric blue accent color (#40E0D0), to represent UI actions and data points.
- Implement a modular UI layout that is adaptable to different screen sizes, ensuring key information remains accessible on both desktop and mobile devices.
- Subtle, realistic animations for pod thrusters, UI transitions, and object interactions to enhance the sense of immersion and responsiveness.