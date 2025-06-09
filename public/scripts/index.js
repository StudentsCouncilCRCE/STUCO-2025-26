function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("show");
}

function toggleFollow(button) {
  if (button.textContent.trim() === "Follow +") {
    button.textContent = "Following ✓";
    button.style.background = "#00C851";
    button.style.color = "white";
  } else {
    button.textContent = "Follow +";
    button.style.background = "#ffffff";
    button.style.color = "#000000";
  }
}

// Add subtle parallax effect on mouse move
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".profile-card");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  cards.forEach((card, index) => {
    const multiplier = index % 2 === 0 ? 1 : -1;
    const rotateX = (y - 0.5) * 5 * multiplier;
    const rotateY = (x - 0.5) * 5 * multiplier;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
});

// Reset transform on mouse leave
document.addEventListener("mouseleave", () => {
  const cards = document.querySelectorAll(".profile-card");
  cards.forEach((card) => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
});
