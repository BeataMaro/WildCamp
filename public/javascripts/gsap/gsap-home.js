var tlHome = gsap.timeline({
  //   defaults: { duration: 1, ease: "back.inOut(1.2)" },
  defaults: { duration: 0.7, ease: "elastic" },
});
tlHome
  .fromTo(
    ".homePage",
    { opacity: 0, y: "10vh", scale: 1.5 },
    { opacity: 1, y: 0, scale: 1 },
    1
  )
  .from(".nav-link", { y: "-100vh", stagger: 0.2 })
  .fromTo(".home-btn", { opacity: 0 }, { opacity: 1, ease: "bounce" });
