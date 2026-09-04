if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./service-worker.js').catch(function (error) {
            console.error('Personal Vault offline support could not start.', error);
        });
    });
}
