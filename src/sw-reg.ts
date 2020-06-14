export function initSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js',
        {
          scope: '/'
        })
        .then(
          (reg) => console.log('Registration succeeded. Scope is', reg.scope),
          (error) => console.log('Registration failed with', error)
        );
    });
  }
}
