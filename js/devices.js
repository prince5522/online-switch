// =====================================================
// SMART SWITCH v1.8
// DEVICES + VISIBLE ON/OFF SWITCH
// =====================================================

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { app } from "./firebase.js";


const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);

let currentUser = null;


// =====================================================
// MESSAGE
// =====================================================

function showMessage(message, type = "success") {

    const box = $("deviceMessage");

    if (!box) {
        console.log(message);
        return;
    }

    box.textContent = message;

    box.classList.remove(
        "hidden",
        "error-message",
        "success-message"
    );

    box.classList.add(
        type === "error"
            ? "error-message"
            : "success-message"
    );
}


// =====================================================
// CONNECTION FIELDS
// =====================================================

function hideConnectionFields() {

    [
        "wifiFields",
        "bluetoothFields",
        "ipFields",
        "httpFields",
        "mqttFields"
    ].forEach(id => {

        $(id)?.classList.add("hidden");

    });
}


function updateConnectionFields() {

    hideConnectionFields();

    const method =
        $("connectionMethod")?.value;

    if (!method) return;

    const field =
        $(`${method}Fields`);

    field?.classList.remove("hidden");
}


$("connectionMethod")
    ?.addEventListener(
        "change",
        updateConnectionFields
    );


// =====================================================
// ADD DEVICE
// =====================================================

$("deviceForm")
    ?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            if (!currentUser) {

                showMessage(
                    "Please log in first.",
                    "error"
                );

                return;
            }


            const name =
                $("deviceName")
                    ?.value
                    .trim() || "";


            const type =
                $("deviceType")
                    ?.value || "";


            const method =
                $("connectionMethod")
                    ?.value || "";


            if (!name) {

                showMessage(
                    "Enter a device name.",
                    "error"
                );

                return;
            }


            if (!type) {

                showMessage(
                    "Select the device type.",
                    "error"
                );

                return;
            }


            if (!method) {

                showMessage(
                    "Select a connection method.",
                    "error"
                );

                return;
            }


            const deviceData = {

                userId:
                    currentUser.uid,

                name:
                    name,

                type:
                    type,

                connectionMethod:
                    method,

                power:
                    false,

                online:
                    false,

                createdAt:
                    serverTimestamp()

            };


            // -------------------------------------------------
            // WI-FI
            // -------------------------------------------------

            if (method === "wifi") {

                deviceData.wifiName =
                    $("wifiName")
                        ?.value
                        .trim() || "";

                deviceData.wifiPassword =
                    $("wifiPassword")
                        ?.value || "";

            }


            // -------------------------------------------------
            // BLUETOOTH
            // -------------------------------------------------

            if (method === "bluetooth") {

                deviceData.bluetoothName =
                    $("bluetoothName")
                        ?.value
                        .trim() || "";

            }


            // -------------------------------------------------
            // IP
            // -------------------------------------------------

            if (method === "ip") {

                deviceData.host =
                    $("deviceHost")
                        ?.value
                        .trim() || "";

                deviceData.port =
                    Number(
                        $("devicePort")
                            ?.value || 80
                    );

                if (!deviceData.host) {

                    showMessage(
                        "Enter the device IP address.",
                        "error"
                    );

                    return;
                }
            }


            // -------------------------------------------------
            // HTTP
            // -------------------------------------------------

            if (method === "http") {

                deviceData.httpUrl =
                    $("httpUrl")
                        ?.value
                        .trim() || "";

                deviceData.httpEndpoint =
                    $("httpEndpoint")
                        ?.value
                        .trim() || "";

            }


            // -------------------------------------------------
            // MQTT
            // -------------------------------------------------

            if (method === "mqtt") {

                deviceData.mqttHost =
                    $("mqttHost")
                        ?.value
                        .trim() || "";

                deviceData.mqttPort =
                    Number(
                        $("mqttPort")
                            ?.value || 1883
                    );

                deviceData.mqttTopic =
                    $("mqttTopic")
                        ?.value
                        .trim() || "";

            }


            const button =
                $("addDeviceButton");


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Adding Device...";

                }


                await addDoc(
                    collection(
                        db,
                        "devices"
                    ),
                    deviceData
                );


                showMessage(
                    "Device added successfully."
                );


                $("deviceForm")?.reset();

                hideConnectionFields();

                await loadDevices();


            } catch (error) {

                console.error(
                    "Add device error:",
                    error
                );


                showMessage(
                    "Device cannot be added.",
                    "error"
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "➕ Add Device";

                }

            }

        }
    );


// =====================================================
// LOAD DEVICES
// =====================================================

async function loadDevices() {

    if (!currentUser)
        return;


    const list =
        $("devicesList");


    if (!list)
        return;


    list.innerHTML = `
        <div class="loading">
            Loading your devices...
        </div>
    `;


    try {

        const devicesQuery =
            query(
                collection(
                    db,
                    "devices"
                ),
                where(
                    "userId",
                    "==",
                    currentUser.uid
                )
            );


        const snapshot =
            await getDocs(
                devicesQuery
            );


        if (snapshot.empty) {

            list.innerHTML = `
                <div class="card">
                    <h3>📭 No devices yet</h3>
                    <p>
                        Add a Smart Switch device above.
                    </p>
                </div>
            `;

            return;
        }


        list.innerHTML = "";


        snapshot.forEach(
            deviceSnapshot => {

                const data =
                    deviceSnapshot.data();


                createDeviceCard(
                    deviceSnapshot.id,
                    data
                );

            }
        );


    } catch (error) {

        console.error(
            "Load devices error:",
            error
        );


        list.innerHTML = `
            <div class="card">
                <h3>⚠️ Could not load devices</h3>
                <p>
                    Check your Firestore connection and rules.
                </p>
            </div>
        `;

    }

}


// =====================================================
// CREATE DEVICE CARD
// =====================================================

function createDeviceCard(
    deviceId,
    data
) {

    const list =
        $("devicesList");


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "device-card";


    const isOn =
        data.power === true;


    card.innerHTML = `

        <div class="device-card-header">

            <div>

                <h3>
                    💡 ${escapeHtml(
                        data.name ||
                        "Unnamed Device"
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        data.type ||
                        "Smart Switch"
                    )}
                </p>

            </div>

            <span class="online-status">
                ${data.online
                    ? "● Online"
                    : "● Offline"}
            </span>

        </div>


        <div class="device-power-panel">

            <div class="device-power-info">

                <strong>
                    Power
                </strong>

                <span
                    class="power-status"
                    data-status
                >
                    ${isOn ? "ON" : "OFF"}
                </span>

            </div>


            <button
                type="button"
                class="power-switch ${isOn ? "on" : ""}"
                data-power-switch
                aria-pressed="${isOn}"
                aria-label="Turn ${isOn ? "off" : "on"} ${escapeHtml(
                    data.name || "device"
                )}"
            >

                <span class="switch-track">

                    <span class="switch-knob"></span>

                </span>

            </button>

        </div>


        <div class="device-details">

            <p>
                🔌 Connection:
                <strong>
                    ${escapeHtml(
                        data.connectionMethod ||
                        "Unknown"
                    )}
                </strong>
            </p>


            ${
                data.wifiName
                    ? `
                        <p>
                            📶 Wi-Fi:
                            ${escapeHtml(
                                data.wifiName
                            )}
                        </p>
                    `
                    : ""
            }


            ${
                data.host
                    ? `
                        <p>
                            🌐 IP:
                            ${escapeHtml(
                                data.host
                            )}
                        </p>
                    `
                    : ""
            }


            ${
                data.port
                    ? `
                        <p>
                            🔢 Port:
                            ${data.port}
                        </p>
                    `
                    : ""
            }


            ${
                data.mqttTopic
                    ? `
                        <p>
                            📡 MQTT:
                            ${escapeHtml(
                                data.mqttTopic
                            )}
                        </p>
                    `
                    : ""
            }

        </div>


        <button
            type="button"
            class="delete-button small-button"
            data-delete
        >
            🗑️ Delete Device
        </button>

    `;


    const powerSwitch =
        card.querySelector(
            "[data-power-switch]"
        );


    powerSwitch?.addEventListener(
        "click",
        () => {

            toggleDevice(
                deviceId,
                data,
                card,
                powerSwitch
            );

        }
    );


    const deleteButton =
        card.querySelector(
            "[data-delete]"
        );


    deleteButton?.addEventListener(
        "click",
        () => {

            deleteDevice(
                deviceId
            );

        }
    );


    list.appendChild(
        card
    );

}


// =====================================================
// ON / OFF
// =====================================================

async function toggleDevice(
    deviceId,
    data,
    card,
    button
) {

    const newPower =
        data.power !== true;


    button.disabled = true;


    try {

        await updateDoc(
            doc(
                db,
                "devices",
                deviceId
            ),
            {
                power: newPower
            }
        );


        data.power =
            newPower;


        button.classList.toggle(
            "on",
            newPower
        );


        button.setAttribute(
            "aria-pressed",
            String(newPower)
        );


        const status =
            card.querySelector(
                "[data-status]"
            );


        if (status) {

            status.textContent =
                newPower
                    ? "ON"
                    : "OFF";

        }


        button.setAttribute(
            "aria-label",
            `Turn ${
                newPower ? "off" : "on"
            } ${
                data.name || "device"
            }`
        );


        showMessage(
            `${data.name || "Device"} turned ${
                newPower ? "ON" : "OFF"
            }.`
        );


    } catch (error) {

        console.error(
            "Power toggle error:",
            error
        );


        showMessage(
            "Could not change the device power state.",
            "error"
        );


    } finally {

        button.disabled = false;

    }

}


// =====================================================
// DELETE
// =====================================================

async function deleteDevice(
    deviceId
) {

    if (!confirm(
        "Delete this device?"
    ))
        return;


    try {

        await deleteDoc(
            doc(
                db,
                "devices",
                deviceId
            )
        );


        showMessage(
            "Device deleted."
        );


        await loadDevices();


    } catch (error) {

        console.error(
            "Delete device error:",
            error
        );


        showMessage(
            "Could not delete the device.",
            "error"
        );

    }

}


// =====================================================
// SIDEBAR
// =====================================================

$("menuButton")
    ?.addEventListener(
        "click",
        () => {

            $("sidebar")
                ?.classList.toggle(
                    "open"
                );

        }
    );


// =====================================================
// LOGOUT
// =====================================================

$("logoutButton")
    ?.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );


                window.location.replace(
                    "index.html"
                );


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );


// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        currentUser =
            user;


        await loadDevices();

    }
);


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =====================================================
// START
// =====================================================

hideConnectionFields();

console.log(
    "SMART SWITCH device controls loaded."
);