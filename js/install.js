I // =====================================================
// SMART SWITCH v1.8
// PWA INSTALL CONTROLLER
// =====================================================

let deferredInstallPrompt = null;


// =====================================================
// WAIT FOR PAGE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  
  const installPopup =
    document.getElementById("installPopup");
  
  const installButton =
    document.getElementById("installAppButton");
  
  const laterButton =
    document.getElementById("installLaterButton");
  
  
  // If the page does not contain the popup,
  // there is nothing for this script to control.
  if (!installPopup) {
    console.log(
      "Smart Switch install popup not found on this page."
    );
  }
  
  
  // =================================================
  // BROWSER INSTALL EVENT
  // =================================================
  
  window.addEventListener(
    "beforeinstallprompt",
    event => {
      
      // Prevent the browser from showing
      // its own automatic prompt.
      event.preventDefault();
      
      deferredInstallPrompt =
        event;
      
      
      console.log(
        "Smart Switch can be installed."
      );
      
      
      if (installPopup) {
        
        installPopup.classList.remove(
          "hidden"
        );
        
      }
      
    }
  );
  
  
  // =================================================
  // INSTALL BUTTON
  // =================================================
  
  installButton?.addEventListener(
    "click",
    async () => {
      
      if (!deferredInstallPrompt) {
        
        showInstallMessage(
          "Smart Switch is already installed or your browser does not support installation here."
        );
        
        return;
      }
      
      
      try {
        
        deferredInstallPrompt.prompt();
        
        
        const result =
          await deferredInstallPrompt.userChoice;
        
        
        console.log(
          "Install choice:",
          result.outcome
        );
        
        
      } catch (error) {
        
        console.error(
          "PWA installation error:",
          error
        );
        
      }
      
      
      deferredInstallPrompt =
        null;
      
      
      hideInstallPopup();
      
    }
  );
  
  
  // =================================================
  // NOT NOW
  // =================================================
  
  laterButton?.addEventListener(
    "click",
    () => {
      
      hideInstallPopup();
      
    }
  );
  
  
  // =================================================
  // INSTALLED EVENT
  // =================================================
  
  window.addEventListener(
    "appinstalled",
    () => {
      
      console.log(
        "Smart Switch was installed."
      );
      
      
      hideInstallPopup();
      
      
      showInstallMessage(
        "Smart Switch has been installed."
      );
      
    }
  );
  
  
  // =================================================
  // IOS / MANUAL INSTALL MESSAGE
  // =================================================
  
  const isIOS =
    /iphone|ipad|ipod/i.test(
      navigator.userAgent
    );
  
  
  const isStandalone =
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    window.navigator.standalone === true;
  
  
  if (
    isIOS &&
    !isStandalone
  ) {
    
    if (installPopup) {
      
      installPopup.classList.remove(
        "hidden"
      );
      
    }
    
  }
  
  
});


// =====================================================
// HIDE POPUP
// =====================================================

function hideInstallPopup() {
  
  const popup =
    document.getElementById(
      "installPopup"
    );
  
  
  if (popup) {
    
    popup.classList.add(
      "hidden"
    );
    
  }
  
}


// =====================================================
// MESSAGE
// =====================================================

function showInstallMessage(message) {
  
  const toast =
    document.getElementById(
      "toast"
    );
  
  
  if (toast) {
    
    toast.textContent =
      message;
    
    toast.classList.remove(
      "hidden"
    );
    
    
    setTimeout(() => {
      
      toast.classList.add(
        "hidden"
      );
      
    }, 4000);
    
  } else {
    
    console.log(
      message
    );
    
  }
  
}