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

const $ = id =>
  document.getElementById(id);


$("menuButton")?.addEventListener(
  "click",
  () => {
    
    $("sidebar")?.classList.toggle(
      "open"
    );
    
  }
);


$("logoutButton")?.addEventListener(
  "click",
  async () => {
    
    await signOut(auth);
    
    window.location.replace(
      "index.html"
    );
    
  }
);


async function loadProfile(user) {
  
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
      
      if ($("profileMessage")) {
        
        $("profileMessage").textContent =
          "Smart Switch profile not found.";
        
        $("profileMessage")
          .classList.remove(
            "hidden"
          );
        
        $("profileMessage")
          .classList.add(
            "error-message"
          );
        
      }
      
      return;
      
    }
    
    
    const data =
      profile.data();
    
    
    $("profileFullName").value =
      data.fullName || "Not provided";
    
    
    $("profileUsername").value =
      data.username || "Not provided";
    
    
    $("profilePhone").value =
      data.phone || "Not provided";
    
    
    $("profileEmail").value =
      data.email || user.email || "Not provided";
    
    
    $("profileRole").value =
      data.role || "user";
    
    
    $("profileStatus").value =
      data.active === false ?
      "Inactive" :
      "Active";
    
    
    if (data.role === "admin") {
      
      $("adminMenu")
        ?.classList.remove(
          "hidden"
        );
      
    }
    
    
  } catch (error) {
    
    console.error(
      "Profile error:",
      error
    );
    
    
    if ($("profileMessage")) {
      
      $("profileMessage").textContent =
        "Could not load your profile.";
      
      $("profileMessage")
        .classList.remove(
          "hidden"
        );
      
      $("profileMessage")
        .classList.add(
          "error-message"
        );
      
    }
    
  }
  
}


onAuthStateChanged(
  auth,
  user => {
    
    if (!user) {
      
      window.location.replace(
        "index.html"
      );
      
      return;
      
    }
    
    
    loadProfile(user);
    
  }
);