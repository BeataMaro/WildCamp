// gsap.registerPlugin(ScrollTrigger);

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
