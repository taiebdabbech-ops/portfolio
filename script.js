// Quand on clique sur "Explorer", on défile vers la section suivante
document.getElementById("exploreBtn").addEventListener("click", function () {
  document.getElementById("about").scrollIntoView({ behavior: "smooth" });
});
