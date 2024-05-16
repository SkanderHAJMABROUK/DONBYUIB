document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('collecteDescription');
    const fullText = container.innerText;
    const sentences = fullText.match(/[^\.!\?]+[\.!\?]+/g);

    if (sentences && sentences.length > 4) {
        const visibleText = sentences.slice(0, 4).join(' ') + '...';
        container.innerText = visibleText;
        container.classList.add('collapsed');
        
        container.addEventListener('click', function() {
            if (container.classList.contains('collapsed')) {
                container.innerText = fullText;
                container.classList.remove('collapsed');
            } else {
                container.innerText = visibleText;
                container.classList.add('collapsed');
            }
        });
    }
});
