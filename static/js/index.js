(function () {
    const uploaderContainer = document.getElementById('uploaderContainer');
    const fileLabel = document.getElementById('fileLabel');
    const textLabel = document.getElementById('textLabel');
    const fileUploader = document.getElementById('fileUploader');
    const fileUploadButton = document.getElementById('fileUploadButton');
    const progressContainer = document.getElementById('progressContainer');
    const cancelButton = document.getElementById('cancelButton');
    const progressNumber = document.getElementById('progressNumber');
    const resultContainer = document.getElementById('resultContainer');

    fileLabel.addEventListener('click', () => {
        uploaderContainer.classList.remove('right');
    })

    textLabel.addEventListener('click', () => {
        uploaderContainer.classList.add('right');
    })

    fileUploader.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploaderContainer.classList.add('enlarge');
        event.dataTransfer.dropEffect = 'copy';
    })

    fileUploader.addEventListener('dragleave', (event) => {
        event.preventDefault();
        uploaderContainer.classList.remove('enlarge');
    })

    fileUploader.addEventListener('drop', (event) => {
        event.preventDefault();
        uploaderContainer.classList.remove('enlarge');
    })

    fileUploadButton.addEventListener('click', () => {
        animateStatus(uploaderContainer, progressContainer);
        updateProgress(0, 100, 2000);
        setTimeout(() => {
            animateStatus(progressContainer, resultContainer);
        }, 2000);
    })

    cancelButton.addEventListener('click', () => {
        animateStatus(progressContainer, uploaderContainer);
    })

    function animateStatus(from, to) {
        from.classList.remove('hide');
        from.classList.remove('rotateIn');
        from.classList.add('rotateOut')
        setTimeout(() => {
            from.classList.add('hide');
            from.classList.remove('rotateOut');
            to.classList.add('rotateIn');
            to.classList.remove('hide')
        }, 500)
    }

    function updateProgress(from, to, timeout) {
        let startTime = -1;

        function callback(timestamp) {
            if (startTime === -1) {
                startTime = timestamp;
            }
            let progress = timestamp - startTime;
            // let display = (from + (to - from) * ((Math.sin((progress) * Math.PI - Math.PI / 2) + 1) / 2)).toFixed(0);
            let display = (to - from) * (-Math.pow(2, -10 * progress / timeout) + 1) * 1024 / 1023 + from;
            display = display.toFixed(0);
            // console.log(display);
            progressNumber.textContent = display;
            if (progress < timeout) {
                requestAnimationFrame(callback);
            }
        }
        requestAnimationFrame(callback);
    }
})()