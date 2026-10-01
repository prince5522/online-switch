// =====================================================
// SMART SWITCH v1.8
// MAIN DASHBOARD
// =====================================================

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { app } from "./firebase.js";


const auth = getAuth(app);
const db = getFirestore(app);


// =====================================================
// SHORTCUT
// =====================================================

const $ = id =>
  document.getElementById(id);


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile(user) {
  
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
    
    
    if (!profile.exists()) {
      
      if ($("userName")) {
        
        $("userName").textContent =
          user.displayName ||
          user.email ||
          "User";
        
      }
      
      
      if ($("userRole")) {
        
        $("userRole").textContent =
          "Firebase account connected.";
        
      }
      
      
      if ($("accountStatus")) {
        
        $("accountStatus").textContent =
          "● Firebase connected";
        
      }
      
      
      return;
      
    }
    
    
    const data =
      profile.data();
    
    
    const name =
      data.fullName ||
      data.username ||
      user.displayName ||
      user.email ||
      "User";
    
    
    const role =
      String(
        data.role || "user"
      ).toLowerCase();
    
    
    // =================================================
    // NAME
    // =================================================
    
    if ($("userName")) {
      
      $("userName").textContent =
        name;
      
    }
    
    
    // =================================================
    // ROLE
    // =================================================
    
    if ($("userRole")) {
      
      $("userRole").textContent =
        role === "admin" ?
        "Administrator account" :
        "Smart Switch user";
      
    }
    
    
    // =================================================
    // ACCOUNT STATUS
    // =================================================
    
    if ($("accountStatus")) {
      
      $("accountStatus").textContent =
        data.active === false ?
        "● Deactivated" :
        "● Active";
      
    }
    
    
    // =================================================
    // ADMIN
    // =================================================
    
    if (role === "admin") {
      
      $("adminMenu")
        ?.classList.remove(
          "hidden"
        );
      
      
      $("adminCard")
        ?.classList.remove(
          "hidden"
        );
      
    } else {
      
      $("adminMenu")
        ?.classList.add(
          "hidden"
        );
      
      
      $("adminCard")
        ?.classList.add(
          "hidden"
        );
      
    }
    
    
  } catch (error) {
    
    console.error(
      "Dashboard profile error:",
      error
    );
    
    
    if ($("userRole")) {
      
      $("userRole").textContent =
        "Your account is signed in.";
      
    }
    
    
    if ($("accountStatus")) {
      
      $("accountStatus").textContent =
        "● Signed in";
      
    }
    
  }
  
}


// =====================================================
// MENU
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
// AUTH STATE
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
    
    
    await loadProfile(
      user
    );
    
  }
);


console.log(
  "SMART SWITCH dashboard loaded."
);