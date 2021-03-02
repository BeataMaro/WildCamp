var tlHome = gsap.timeline({
  //   defaults: { duration: 1, ease: "back.inOut(1.2)" },
  defaults: { duration: 0.7, ease: "back" },
});
tlHome
  .from(".homePage", { scale: 0, transformOrigin: "50% 50%" })
  .from(".nav-link", { y: "-100vh", stagger: 0.2 })
  .fromTo(".home-btn", { opacity: 0 }, { opacity: 1, ease: "bounce" });
