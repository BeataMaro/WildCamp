// gsap.registerPlugin(ScrollTrigger);

// const tlCampgrounds = gsap.timeline({
//   defaults: {
//     duration: 1,
//   },
// });

// const tlDetails = gsap.timeline({
//   defaults: { duration: 1, ease: "back.inOut(1.2)" },
// });

// const tlHome = gsap.timeline({
//   defaults: { duration: 1, ease: "back.inOut(1)" },
// });
// tlHome
//   .fromTo(
//     ".homePage",
//     { opacity: 0, y: "10vh", scale: 1.6 },
//     { opacity: 1, y: 0, scale: 1 },
//     1
//   )
//   .from(".nav-link", { y: "-100vh", stagger: 0.4 }, "<0.5")
//   .fromTo(
//     ".home-btn",
//     { y: innerHeight * 1, rotation: 40 },
//     { y: 0, rotation: 0 }
//   ),
//   "<.9";

// tlDetails
//   .from("#campgroundCarousel", {
//     y: "100%",
//   })
//   .from(".card", { x: "90vw", stagger: 0.5 }, "<.3");

// tlCampgrounds.fromTo(
//   "#cluster-map",
//   { opacity: 0, y: "-100vh", scale: 2 },
//   { opacity: 1, y: 0, scale: 1 }
// );
