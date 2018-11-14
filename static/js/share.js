(function () {
  const urlBox = document.getElementById('urlBox')
  const copyButton = document.getElementById('copyButton')
  urlBox.addEventListener('focus', (event) => {
    event.target.select();
  })
  let copiedTimeout = -1;
  copyButton.addEventListener('click', (event) => {
    event.target.textContent = 'Copied!';
    urlBox.focus();
    document.execCommand('copy');
    if (copiedTimeout !== -1) {
      clearTimeout(copiedTimeout);
    }
    copiedTimeout = setTimeout(() => {
      event.target.textContent = 'Copy';
      copiedTimeout = -1;
    }, 5000);
  })
})()