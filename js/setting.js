// =====================================================
// SMART SWITCH v1.8
// SETTINGS CONTROLLER
// =====================================================

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { app } from "./firebase.js";


const auth =
    getAuth(app);


// =====================================================
// SHORTCUT
// =====================================================

const $ = id =>
    document.getElementById(id);


// =====================================================
// LOCAL SETTINGS
// =====================================================

const notificationSetting =
    $("notificationSetting");

const confirmSetting =
    $("confirmSetting");


if (notificationSetting) {
    
    const saved =
        localStorage.getItem(
            "smartSwitchNotifications"
        );
    
    
    if (saved !== null) {
        
        notificationSetting.checked =
            saved === "true";
        
    }
    
    
    notificationSetting
        .addEventListener(
            "change",
            () => {
                
                localStorage.setItem(
                    "smartSwitchNotifications",
                    notificationSetting.checked
                );
                
            }
        );
    
}


if (confirmSetting) {
    
    const saved =
        localStorage.getItem(
            "smartSwitchConfirmActions"
        );
    
    
    if (saved !== null) {
        
        confirmSetting.checked =
            saved === "true";
        
    }
    
    
    confirmSetting
        .addEventListener(
            "change",
            () => {
                
                localStorage.setItem(
                    "smartSwitchConfirmActions",
                    confirmSetting.checked
                );
                
            }
        );
    
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
// AUTHENTICATION
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
        
    }
);


console.log(
    "SMART SWITCH settings loaded."
);