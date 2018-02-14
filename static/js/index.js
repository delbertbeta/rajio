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
    const urlBox = document.getElementById('urlBox');
    const copyButton = document.getElementById('copyButton');
    const timesChoice = document.getElementById('timesChoice');
    const dayChoice = document.getElementById('dayChoice');
    const goBackButton = document.getElementById('goBackButton');
    const deleteButton = document.getElementById('deleteButton');

    timesOptions = `<li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>10</li>
                    <li>20</li>
                    <li>50</li>
                    <li>unlimited</li>`;

    dayOptions = `<li>1 hour</li>
                    <li>12 hours</li>
                    <li>1 day</li>
                    <li>7 days</li>
                    <li>1 month</li>
                    <li>0.5 years</li>
                    <li>1 year</li>
                    <li>unlimited days</li>`;
    
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

    timesChoice.addEventListener('click', function (event) {
        showSelection(event, timesOptions, (option) => {
            timesChoice.children[0].textContent = option.value;
            console.log(option.index);
        })
    })

    dayChoice.addEventListener('click', function(event) {
        showSelection(event, dayOptions, (option) => {
            dayChoice.children[0].textContent = option.value;
            console.log(option.index);
        })
    })

    goBackButton.addEventListener('click', () => {
        animateStatus(resultContainer, uploaderContainer);
    })

    deleteButton.addEventListener('click', () => {
        animateStatus(resultContainer, uploaderContainer);
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

    function showSelection(event, option, callback) {
        let optionDom = document.createElement('ul');
        optionDom.classList.add('options');
        optionDom.classList.add('fadeIn');
        optionDom.innerHTML = option;
        optionDom.style.left = event.clientX - 75 + 'px';
        optionDom.style.top = event.clientY / 4 + 'px';
        let optionMask = document.createElement('div');
        optionMask.classList.add('option-mask');
        document.body.appendChild(optionMask);
        let closeOption = () => {
            document.body.removeChild(optionMask);
            optionDom.classList.add('fadeOut');
            setTimeout(() => {
                document.body.removeChild(optionDom);
            }, 200)
        };
        optionMask.addEventListener('click', closeOption)
        document.body.appendChild(optionDom);
        optionDom.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            callback({
                value: event.target.textContent,
                index: Array.prototype.indexOf.call(optionDom.children, event.target)
            });
            closeOption();
        })
    }
})()