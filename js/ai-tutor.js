// =====================================================
// SMART SWITCH v1.8
// SWITCHY VOICE ASSISTANT
// =====================================================

(function () {

    const Switchy = {

        name: "Switchy",

        enabled: true,

        recognition: null,

        listening: false,


        // =================================================
        // SPEAK
        // =================================================

        speak(message) {

            if (!this.enabled) return;

            if (!("speechSynthesis" in window)) {
                return;
            }

            window.speechSynthesis.cancel();

            const speech =
                new SpeechSynthesisUtterance(message);

            speech.lang = "en-US";
            speech.rate = 1;
            speech.pitch = 1;

            window.speechSynthesis.speak(speech);
        },


        // =================================================
        // FRIENDLY MESSAGE
        // =================================================

        say(message) {

            this.speak(message);

            const box =
                document.getElementById("switchyMessage");

            if (box) {
                box.textContent = message;
                box.classList.remove("hidden");
            }
        },


        // =================================================
        // NAVIGATION
        // =================================================

        open(page, message) {

            if (message) {
                this.say(message);
            }

            setTimeout(() => {

                window.location.href = page;

            }, 500);

        },


        // =================================================
        // COMMAND PROCESSOR
        // =================================================

        command(command) {

            const text =
                command.toLowerCase().trim();


            // SETTINGS
            if (
                text.includes("open settings") ||
                text.includes("go to settings") ||
                text === "settings"
            ) {

                this.open(
                    "settings.html",
                    "Sure, opening Settings."
                );

                return;
            }


            // HOME
            if (
                text.includes("open home") ||
                text.includes("go home") ||
                text === "home"
            ) {

                this.open(
                    "home.html",
                    "Okay, opening Home."
                );

                return;
            }


            // DEVICES
            if (
                text.includes("open devices") ||
                text.includes("my devices") ||
                text.includes("show devices")
            ) {

                this.open(
                    "devices.html",
                    "Sure, opening your devices."
                );

                return;
            }


            // PROFILE
            if (
                text.includes("open profile") ||
                text.includes("my profile")
            ) {

                this.open(
                    "profile.html",
                    "Okay, opening your profile."
                );

                return;
            }


            // TUTORIAL
            if (
                text.includes("open tutorial") ||
                text.includes("open tutor") ||
                text.includes("smart switch tutor")
            ) {

                this.open(
                    "ai-tutor.html",
                    "Sure, opening the Smart Switch tutorial."
                );

                return;
            }


            // ADD DEVICE
            if (
                text.includes("add device") ||
                text.includes("add a device")
            ) {

                this.open(
                    "add-device.html",
                    "Okay, opening Add Device."
                );

                return;
            }


            // USER MANAGEMENT
            if (
                text.includes("user management") ||
                text.includes("manage users")
            ) {

                this.open(
                    "users.html",
                    "Opening User Management."
                );

                return;
            }


            // ABOUT
            if (
                text.includes("about smart switch") ||
                text.includes("about the app")
            ) {

                this.open(
                    "settings.html#about",
                    "Sure, opening the About section."
                );

                return;
            }


            // HELP
            if (
                text === "help" ||
                text.includes("what can you do")
            ) {

                this.say(
                    "You can ask me to open Settings, Home, Devices, your Profile, the Tutor, Add Device, or User Management."
                );

                return;
            }


            this.say(
                "I didn't catch that. Try saying open settings, open devices, or open tutorial."
            );

        },


        // =================================================
        // START VOICE RECOGNITION
        // =================================================

        startListening() {

            const SpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;


            if (!SpeechRecognition) {

                this.say(
                    "Voice commands are not supported by this browser."
                );

                return;
            }


            if (this.listening) {
                return;
            }


            this.recognition =
                new SpeechRecognition();


            this.recognition.lang =
                "en-US";

            this.recognition.continuous =
                false;

            this.recognition.interimResults =
                false;


            this.listening = true;


            const button =
                document.getElementById(
                    "switchyVoiceButton"
                );


            if (button) {
                button.textContent =
                    "🔴 Listening...";
            }


            this.say(
                "I'm listening."
            );


            this.recognition.onresult =
                event => {

                    const transcript =
                        event.results[0][0].transcript;


                    this.command(
                        transcript
                    );

                };


            this.recognition.onerror =
                () => {

                    this.say(
                        "Sorry, I couldn't hear that."
                    );

                };


            this.recognition.onend =
                () => {

                    this.listening =
                        false;


                    if (button) {

                        button.textContent =
                            "🎤 Talk to Switchy";

                    }

                };


            this.recognition.start();

        },


        // =================================================
        // SWITCH FEEDBACK
        // =================================================

        switchChanged(
            deviceName,
            isOn
        ) {

            const state =
                isOn ? "on" : "off";


            this.say(
                `${deviceName} is now ${state}.`
            );

        }

    };


    // =====================================================
    // GLOBAL ACCESS
    // =====================================================

    window.Switchy =
        Switchy;


})();