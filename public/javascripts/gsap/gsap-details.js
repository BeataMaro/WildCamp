var tlDetails = gsap.timeline({
  defaults: { duration: 1, ease: "back.inOut(1.2)" },
});

tlDetails
  .from("#campgroundCarousel", {
    y: "100%",
  })
  .from(".card", { x: "90vw", stagger: 0.5 }, "<.3");
