const CACHE_NAME =
  "smart-switch-v1-8";


const APP_FILES = [
  
  "./",
  
  "./index.html",
  "./home.html",
  "./devices.html",
  "./profile.html",
  "./users.html",
  "./settings.html",
  "./ai-tutor.html",
  
  "./css/style.css",
  
  "./js/firebase.js",
  "./js/auth.js",
  "./js/home.js",
  "./js/devices.js",
  "./js/profile.js",
  "./js/users.js",
  "./js/settings.js",
  "./js/ai-tutor.js",
  
  "./manifest.json"
  
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener(
  "install",
  event => {
    
    event.waitUntil(
      
      caches
      .open(CACHE_NAME)
      .then(cache =>
        cache.addAll(APP_FILES)
      )
      
    );
    
    self.skipWaiting();
    
  }
);


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener(
  "activate",
  event => {
    
    event.waitUntil(
      
      caches
      .keys()
      .then(keys =>
        Promise.all(
          
          keys
          .filter(
            key =>
            key !== CACHE_NAME
          )
          .map(
            key =>
            caches.delete(key)
          )
          
        )
      )
      
    );
    
    self.clients.claim();
    
  }
);


// =====================================================
// FETCH
// =====================================================

self.addEventListener(
  "fetch",
  event => {
    
    if (
      event.request.method !==
      "GET"
    ) {
      return;
    }
    
    
    event.respondWith(
      
      fetch(event.request)
      .then(response => {
        
        const copy =
          response.clone();
        
        
        caches
          .open(CACHE_NAME)
          .then(cache => {
            
            cache.put(
              event.request,
              copy
            );
            
          });
        
        
        return response;
        
      })
      .catch(
        () =>
        caches
        .match(
          event.request
        )
      )
      
    );
    
  }
);