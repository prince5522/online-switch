import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";


const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


const app =
    express();


const PORT =
    process.env.PORT || 3000;


/*
 * Firebase Admin SDK
 *
 * For deployment, configure the Firebase service
 * account through your hosting provider.
 */

if (!admin.apps.length) {

    try {

        admin.initializeApp();

        console.log(
            "Firebase Admin initialized."
        );

    } catch (error) {

        console.error(
            "Firebase Admin initialization failed:",
            error.message
        );
    }
}


const db =
    admin.apps.length
        ? admin.firestore()
        : null;


app.use(
    express.json()
);


app.use(
    express.static(__dirname)
);


/*
 * Health check
 */

app.get(
    "/api/health",
    (req, res) => {

        res.json({
            online: true,
            app: "SMART SWITCH",
            version: "1.8"
        });
    }
);


/*
 * REMOTE DEVICE CONTROL
 *
 * This endpoint is intentionally a foundation.
 *
 * A production deployment should verify the Firebase
 * ID token before allowing device control.
 */

app.post(
    "/api/device/control",
    async (req, res) => {

        try {

            const {
                deviceId,
                state
            } = req.body;


            if (!deviceId) {

                return res.status(400).json({
                    error:
                        "Device ID is required."
                });
            }


            if (typeof state !== "boolean") {

                return res.status(400).json({
                    error:
                        "Device state must be true or false."
                });
            }


            /*
             * Remote device infrastructure will use
             * authenticated server-side communication.
             */

            return res.status(501).json({
                error:
                    "Remote device control requires the secure device gateway to be configured."
            });


        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error:
                    "Remote control failed."
            });
        }
    }
);


/*
 * SERVER ERROR HANDLER
 */

app.use(
    (error, req, res, next) => {

        console.error(error);

        res.status(500).json({
            error:
                "Server error."
        });
    }
);


app.listen(
    PORT,
    () => {

        console.log(
            `SMART SWITCH v1.8 running on port ${PORT}`
        );
    }
);