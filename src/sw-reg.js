(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load',  () => {
      navigator.serviceWorker.register('/sw.js',
        {
          scope: '/'
        }
      )
        .then((reg) => {
          // регистрация сработала
          console.log('Registration succeeded. Scope is ' + reg.scope);
        }).catch((error) => {
        // регистрация прошла неудачно
        console.log('Registration failed with ' + error);
      });
    });
  }
})();
