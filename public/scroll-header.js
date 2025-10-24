document.addEventListener("DOMContentLoaded", function() {
  console.log("Scroll script loaded");
  
  window.addEventListener("scroll", function() {
    const scrollY = window.scrollY;
    const hasScrolled = scrollY > 120;
    
    console.log("Scroll position:", scrollY, "Should add scrolled class:", hasScrolled);
    
    if (hasScrolled) {
      document.body.classList.add("scrolled");
      console.log("Added scrolled class to body");
    } else {
      document.body.classList.remove("scrolled");
      console.log("Removed scrolled class from body");
    }
    
    // Vérifier si la classe est bien appliquée
    console.log("Body classes:", document.body.className);
  });
});