gsap.registerPlugin(ScrollTrigger);

const tlCampgrounds = gsap.timeline({
  defaults: {
    duration: 1,
  },
});

tlCampgrounds.fromTo(
  "#cluster-map",
  { opacity: 0, y: "-100vh", scale: 2 },
  { opacity: 1, y: 0, scale: 1 }
);

gsap.from(".card", {
  scrollTrigger: {
    trigger: ".pagination",
    start: "top center",
    toggleActions: "play pause pause pause",
    markers: {
      startColor: "blue",
    },
  },
  x: "90vw",
  stagger: 0.5,
  duration: 1,
  ease: "elastic",
});
