// =====================================================
// SMART SWITCH v1.8
// AUTHENTICATION
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

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


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyCzLIELPJ2HoRnc55Nmf5gd2HjxGR5jWME",
    authDomain: "smart-switch-dc02c.firebaseapp.com",
    projectId: "smart-switch-dc02c",
    storageBucket: "smart-switch-dc02c.firebasestorage.app",
    messagingSenderId: "587667501040",
    appId: "1:587667501040:web:64b0ba8584ea1a28a6b735",
    measurementId: "G-7YTKGDG053"
};


// =====================================================
// FIREBASE START
// =====================================================

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);


// =====================================================
// ELEMENT
// =====================================================

const $ = id =>
    document.getElementById(id);


// =====================================================
// MESSAGE
// =====================================================

function showToast(message) {

    const toast = $("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.classList.remove("hidden");
}


// =====================================================
// FIREBASE ERRORS
// =====================================================

function firebaseErrorMessage(error) {

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
// SIGN UP
// =====================================================

$("signupForm")?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const fullName =
            $("signupFullName")?.value.trim() || "";

        const username =
            $("signupUsername")?.value.trim() || "";

        const phone =
            $("signupPhone")?.value.trim() || "";

        const email =
            $("signupEmail")?.value.trim().toLowerCase() || "";

        const password =
            $("signupPassword")?.value || "";

        const confirmPassword =
            $("signupConfirmPassword")?.value || "";


        if (!fullName)
            return showToast("Enter your full name.");

        if (!username)
            return showToast("Enter your username.");

        if (!phone)
            return showToast("Enter your phone number.");

        if (!email)
            return showToast("Enter your email.");

        if (password.length < 6)
            return showToast(
                "Password must be at least 6 characters."
            );

        if (password !== confirmPassword)
            return showToast(
                "Passwords do not match."
            );


        try {

            const result =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user = result.user;


            // FIRST ACCOUNT = ADMIN
            let role = "user";

            const usersRef =
                await getDoc(
                    doc(
                        db,
                        "settings",
                        "system"
                    )
                );


            if (!usersRef.exists()) {

                role = "admin";

                await setDoc(
                    doc(
                        db,
                        "settings",
                        "system"
                    ),
                    {
                        initialized: true,
                        initializedAt:
                            serverTimestamp()
                    }
                );
            }


            // CREATE PROFILE
            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {

                    uid: user.uid,

                    fullName: fullName,

                    username: username,

                    phone: phone,

                    email: email,

                    role: role,

                    active: true,

                    createdAt:
                        serverTimestamp()

                }
            );


            await signOut(auth);

            $("signupForm")?.reset();

            showToast(
                role === "admin"
                    ? "Administrator account created. You can now log in."
                    : "Account created successfully. You can now log in."
            );

        } catch (error) {

            console.error(
                "Signup error:",
                error
            );

            showToast(
                firebaseErrorMessage(error)
            );
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
            $("loginEmail")?.value.trim().toLowerCase() || "";

        const password =
            $("loginPassword")?.value || "";


        if (!email)
            return showToast(
                "Enter your email."
            );

        if (!password)
            return showToast(
                "Enter your password."
            );


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            showToast(
                "Login successful."
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            showToast(
                firebaseErrorMessage(error)
            );
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
            $("loginEmail")?.value.trim().toLowerCase() || "";


        if (!email) {

            showToast(
                "Enter your email first."
            );

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );

            showToast(
                "Password reset email sent."
            );

        } catch (error) {

            showToast(
                firebaseErrorMessage(error)
            );
        }
    }
);


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async user => {

        if (!user)
            return;


        try {

            const profileRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const profile =
                await getDoc(
                    profileRef
                );


            // =================================================
            // IMPORTANT:
            // IF PROFILE DOES NOT EXIST, CREATE IT
            // IN THE CURRENT FIREBASE PROJECT.
            // =================================================

            if (!profile.exists()) {

                await setDoc(
                    profileRef,
                    {

                        uid: user.uid,

                        fullName:
                            user.displayName || "Smart Switch User",

                        username:
                            user.email
                                ?.split("@")[0] ||
                            "user",

                        phone: "",

                        email:
                            user.email || "",

                        role: "admin",

                        active: true,

                        createdAt:
                            serverTimestamp()

                    }
                );
            }


            const updatedProfile =
                await getDoc(
                    profileRef
                );


            if (!updatedProfile.exists()) {

                showToast(
                    "Smart Switch profile could not be created."
                );

                return;
            }


            const data =
                updatedProfile.data();


            if (data.active === false) {

                showToast(
                    "Your Smart Switch account has been deactivated."
                );

                await signOut(auth);

                return;
            }


            // =================================================
            // LOGIN SUCCESS
            // =================================================

            if (
                location.pathname.endsWith("index.html") ||
                location.pathname === "/" ||
                location.pathname === ""
            ) {

                window.location.replace(
                    "home.html"
                );
            }


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

            showToast(
                "Could not load your Smart Switch profile."
            );
        }
    }
);


// =====================================================
// PASSWORD EYE BUTTON
// =====================================================

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    $(button.dataset.target);

                if (!target)
                    return;


                if (target.type === "password") {

                    target.type = "text";

                    button.textContent = "🙈";

                } else {

                    target.type = "password";

                    button.textContent = "👁️";
                }
            }
        );
    });


console.log(
    "SMART SWITCH v1.8 authentication loaded."
);