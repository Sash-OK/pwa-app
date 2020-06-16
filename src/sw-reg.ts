export function initSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js',
        {
          scope: '/'
        })
        .then(
          (reg) => console.log('Registration success', reg),
          (error) => console.log('Registration failed with', error)
        );
    });
  }
}
