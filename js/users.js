import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { app } from "./firebase.js";


const auth = getAuth(app);
const db = getFirestore(app);

const $ = id =>
    document.getElementById(id);


let currentUser = null;


// =====================================================
// SIDEBAR
// =====================================================

$("menuButton")?.addEventListener(
    "click",
    () => {

        $("sidebar")?.classList.toggle(
            "open"
        );

    }
);


// =====================================================
// LOGOUT
// =====================================================

$("logoutButton")?.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        window.location.replace(
            "index.html"
        );

    }
);


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, error = false) {

    const box =
        $("usersMessage");

    if (!box) return;

    box.textContent =
        text;

    box.classList.remove(
        "hidden",
        "error-message",
        "success-message"
    );

    box.classList.add(
        error
            ? "error-message"
            : "success-message"
    );

}


// =====================================================
// LOAD USERS
// =====================================================

async function loadUsers() {

    const table =
        $("usersTable");


    if (!table) return;


    table.innerHTML =
        `<tr>
            <td colspan="5">
                Loading users...
            </td>
        </tr>`;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        table.innerHTML = "";


        if (snapshot.empty) {

            table.innerHTML =
                `<tr>
                    <td colspan="5">
                        No users found.
                    </td>
                </tr>`;

            return;

        }


        snapshot.forEach(
            userSnapshot => {

                const data =
                    userSnapshot.data();


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHTML(
                            data.fullName || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            data.username || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            data.email || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            data.role || "user"
                        )}
                    </td>

                    <td>
                        ${data.active === false
                            ? "Inactive"
                            : "Active"}
                    </td>

                `;


                table.appendChild(row);

            }
        );


    } catch (error) {

        console.error(
            "Users loading error:",
            error
        );


        table.innerHTML =
            `<tr>
                <td colspan="5">
                    Could not load users.
                </td>
            </tr>`;

    }

}


// =====================================================
// ESCAPE
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =====================================================
// AUTH + ADMIN CHECK
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


        currentUser = user;


        try {

            const profile =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );


            if (!profile.exists()) {

                window.location.replace(
                    "home.html"
                );

                return;

            }


            const data =
                profile.data();


            if (data.role !== "admin") {

                window.location.replace(
                    "home.html"
                );

                return;

            }


            await loadUsers();


        } catch (error) {

            console.error(
                "Admin verification error:",
                error
            );


            showMessage(
                "Could not verify administrator access.",
                true
            );

        }

    }
);