var tlUser = gsap.timeline({
  defaults: { duration: 1, ease: "back.inOut(1.2)" },
});

tlUser.fromTo(".card", { x: "90vw", rotation: 180 }, { x: 0, rotation: 0 });
