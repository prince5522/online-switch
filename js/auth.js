// =====================================================
// SMART SWITCH v1.8
// AUTHENTICATION
// Firebase project: online-switch-a5e69
// =====================================================

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { app } from "./firebase.js";


// =====================================================
// FIREBASE
// =====================================================

const auth = getAuth(app);
const db = getFirestore(app);


// =====================================================
// SHORTCUT
// =====================================================

const $ = id => document.getElementById(id);


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, success = false) {

    const box =
        $("authMessage") ||
        $("toast");

    if (!box) {

        console.log(text);

        return;

    }

    box.textContent = text;

    box.classList.remove(
        "hidden",
        "error-message",
        "success-message"
    );

    box.classList.add(
        success
            ? "success-message"
            : "error-message"
    );

}


// =====================================================
// FIREBASE ERROR
// =====================================================

function firebaseErrorMessage(error) {

    console.error(error);

    switch (error?.code) {

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Incorrect email or password.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/email-already-in-use":
            return "That email is already registered.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/network-request-failed":
            return "Internet connection problem. Check your connection.";

        case "auth/too-many-requests":
            return "Too many attempts. Please wait and try again.";

        default:
            return error?.message ||
                "Something went wrong. Please try again.";

    }

}


// =====================================================
// CREATE / REPAIR SMART SWITCH PROFILE
// =====================================================

async function ensureProfile(user, signupData = {}) {

    const profileRef =
        doc(
            db,
            "users",
            user.uid
        );


    const profile =
        await getDoc(profileRef);


    if (profile.exists()) {

        return profile.data();

    }


    // Create missing profile

    const profileData = {

        uid:
            user.uid,

        email:
            user.email || "",

        fullName:
            signupData.fullName ||
            user.displayName ||
            "",

        username:
            signupData.username ||
            "",

        phone:
            signupData.phone ||
            "",

        role:
            "user",

        active:
            true,

        createdAt:
            serverTimestamp()

    };


    await setDoc(
        profileRef,
        profileData
    );


    return profileData;

}


// =====================================================
// SIGN UP
// =====================================================

$("signupForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const fullName =
            (
                $("signupFullName")?.value ||
                $("signupName")?.value ||
                ""
            ).trim();


        const username =
            (
                $("signupUsername")?.value ||
                ""
            ).trim();


        const phone =
            (
                $("signupPhone")?.value ||
                ""
            ).trim();


        const email =
            (
                $("signupEmail")?.value ||
                ""
            ).trim().toLowerCase();


        const password =
            $("signupPassword")?.value ||
            "";


        const confirmPassword =
            (
                $("signupConfirmPassword")?.value ||
                $("signupConfirm")?.value ||
                ""
            );


        if (!fullName) {

            showMessage(
                "Enter your full name."
            );

            return;

        }


        if (!username) {

            showMessage(
                "Enter your username."
            );

            return;

        }


        if (!phone) {

            showMessage(
                "Enter your phone number."
            );

            return;

        }


        if (!email) {

            showMessage(
                "Enter your email."
            );

            return;

        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match."
            );

            return;

        }


        const button =
            $("signupForm")
                ?.querySelector(
                    "button[type='submit']"
                );


        if (button) {

            button.disabled = true;
            button.textContent =
                "Creating...";

        }


        try {

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            await ensureProfile(
                result.user,
                {
                    fullName,
                    username,
                    phone
                }
            );


            await signOut(auth);


            $("signupForm")?.reset();


            showMessage(
                "Account created successfully. You can now log in.",
                true
            );


            $("loginForm")
                ?.classList.remove(
                    "hidden"
                );


            $("signupForm")
                ?.classList.add(
                    "hidden"
                );


        } catch (error) {

            showMessage(
                firebaseErrorMessage(error)
            );

        } finally {

            if (button) {

                button.disabled = false;
                button.textContent =
                    "Create Account";

            }

        }

    }
);


// =====================================================
// LOGIN
// =====================================================

$("loginForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            (
                $("loginEmail")?.value ||
                ""
            ).trim().toLowerCase();


        const password =
            $("loginPassword")?.value ||
            "";


        if (!email) {

            showMessage(
                "Enter your email."
            );

            return;

        }


        if (!password) {

            showMessage(
                "Enter your password."
            );

            return;

        }


        const button =
            $("loginForm")
                ?.querySelector(
                    "button[type='submit']"
                );


        if (button) {

            button.disabled = true;
            button.textContent =
                "Logging in...";

        }


        try {

            // Firebase Authentication

            const result =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            // Repair/create missing Smart Switch profile

            await ensureProfile(
                result.user
            );


            showMessage(
                "Login successful.",
                true
            );


            // Go directly to dashboard

            window.location.replace(
                "home.html"
            );


        } catch (error) {

            showMessage(
                firebaseErrorMessage(error)
            );


            if (button) {

                button.disabled = false;
                button.textContent =
                    "Log In";

            }

        }

    }
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

$("forgotPassword")?.addEventListener(
    "click",
    async () => {

        const email =
            (
                $("loginEmail")?.value ||
                ""
            ).trim().toLowerCase();


        if (!email) {

            showMessage(
                "Enter your email first."
            );

            return;

        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            showMessage(
                "Password reset email sent. Check your inbox.",
                true
            );


        } catch (error) {

            showMessage(
                firebaseErrorMessage(error)
            );

        }

    }
);


// =====================================================
// PASSWORD EYE BUTTON
// =====================================================

document
    .querySelectorAll(
        ".password-toggle"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    $(button.dataset.target);

                if (!target) return;


                if (
                    target.type ===
                    "password"
                ) {

                    target.type =
                        "text";

                    button.textContent =
                        "🙈";

                } else {

                    target.type =
                        "password";

                    button.textContent =
                        "👁️";

                }

            }
        );

    });


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user) return;


        // If already logged in on index.html,
        // go to dashboard.

        const path =
            window.location.pathname;


        const isLoginPage =
            path.endsWith(
                "index.html"
            ) ||
            path === "/" ||
            path.endsWith("/");


        if (isLoginPage) {

            try {

                await ensureProfile(user);

                window.location.replace(
                    "home.html"
                );

            } catch (error) {

                console.error(
                    "Profile creation error:",
                    error
                );

            }

        }

    }
);


console.log(
    "SMART SWITCH AUTH READY"
);