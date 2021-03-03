var tlHome = gsap.timeline({
  //   defaults: { duration: 1, ease: "back.inOut(1.2)" },
  defaults: { duration: 1, ease: "back" },
});
tlHome
  .fromTo("h1", { scale: 1.5, transformOrigin: "50% 50%" }, { scale: 1 })
  .from(".nav-link", { y: "-100vh", stagger: 0.3 });
// .fromTo(".home-btn", { opacity: 0 }, { opacity: 1, ease: "bounce" });
