# ⚡ SMART SWITCH

### Smart control. Simple living.

Smart Switch is a web-based smart-device control application designed to allow users to manage connected electrical devices from a simple interface.

## 🚀 Features

- 🔐 Firebase Authentication
- 👤 User profiles
- 📱 Username, full name and phone number
- 👑 Administrator and normal-user roles
- 💡 Smart-device management
- 🔌 Device ON/OFF controls
- 📡 Wi-Fi connectivity
- 📶 Bluetooth connectivity
- 🌐 IP-address devices
- ⚙️ HTTP communication
- 📩 MQTT communication
- 🤖 Switchy AI Tutorial
- 🔊 Voice interaction
- ⚙️ Application settings
- 📲 Progressive Web App (PWA)
- 📥 App installation support
- 🌐 Firebase online database

## 🔧 Supported Devices

Smart Switch is designed to work with different controller and communication systems, including:

- ESP8266
- ESP-01
- ESP32
- Arduino Uno
- Arduino Nano
- Other compatible devices

## 📡 Communication Methods

Depending on the connected hardware, Smart Switch can use:

- Wi-Fi
- Bluetooth
- IP Address
- HTTP
- MQTT

## 🔐 Backend

Smart Switch uses Firebase for online services.

### Firebase Project

`online-switch-a5e69`

Firebase services used by the application include:

- Firebase Authentication
- Cloud Firestore

## 🤖 Switchy

Switchy is the friendly assistant inside Smart Switch.

Switchy helps users learn:

- How Smart Switch works
- How to add devices
- How to connect devices
- How to diagnose connection problems
- How to use the application
- How to navigate the application
- How to use Smart Switch settings

## 📱 Progressive Web App

Smart Switch is designed as a Progressive Web App.

The application can be accessed through a web browser and, where supported, installed on a device for an app-like experience.

## 🛠️ Project Structure

```text
smart-switch/
│
├── index.html
├── home.html
├── devices.html
├── add-device.html
├── profile.html
├── settings.html
├── ai-tutor.html
├── users.html
│
├── manifest.json
├── sw.js
│
├── css/
│   ├── style.css
│   └── app.css
│
└── js/
    ├── firebase.js
    ├── auth.js
    ├── home.js
    ├── devices.js
    ├── profile.js
    ├── settings.js
    ├── switchy.js
    └── install.js
