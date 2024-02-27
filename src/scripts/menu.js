document.addEventListener('astro:page-load', () => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#menu');

  // Perform null checks before adding event listener
  if (button && menu) {
      button.addEventListener('click', () => {
          menu.classList.toggle('hidden');
      });
  }
});
