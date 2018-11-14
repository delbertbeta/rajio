(function () {
    const data = JSON.parse(document.getElementById('data').textContent)
    const uploaderContainer = document.getElementById('uploaderContainer')
    const fileLabel = document.getElementById('fileLabel')
    const textLabel = document.getElementById('textLabel')
    const fileUploader = document.getElementById('fileUploader')
    const fileUploadButton = document.getElementById('fileUploadButton')
    const progressContainer = document.getElementById('progressContainer')
    const fileName = document.getElementById('fileName')
    const finished = document.getElementById('finished')
    const total = document.getElementById('total')
    const cancelButton = document.getElementById('cancelButton')
    const progressNumber = document.getElementById('progressNumber')
    const resultContainer = document.getElementById('resultContainer')
    const qrcodeImg = document.getElementById('qrcode')
    const errorTip = document.getElementById('errorTip')
    const backButton = document.getElementById('backButton')
    const errorContainer = document.getElementById('errorContainer')
    const urlBox = document.getElementById('urlBox')
    const copyButton = document.getElementById('copyButton')
    const timesChoice = document.getElementById('timesChoice')
    const dayChoice = document.getElementById('dayChoice')
    const goBackButton = document.getElementById('goBackButton')
    const deleteButton = document.getElementById('deleteButton')
    const historyPanel = document.getElementById('historyPanel')
    const historyEntry = document.getElementById('historyEntry')

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
        if (event.dataTransfer.files.length > 0) {
            fileHandle(event.dataTransfer.files[0])
        }
    })

    fileUploadButton.addEventListener('click', (event) => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.click()
        fileInput.onchange = (e) => {
            if (fileInput.files.length > 0) {
                fileHandle(fileInput.files[0])
            }
            delete fileInput
        }
        // animateStatus(uploaderContainer, progressContainer);
        // updateProgress(0, 100, 2000);
        // setTimeout(() => {
        //     animateStatus(progressContainer, resultContainer);
        // }, 2000);
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

    backButton.addEventListener('click', () => {
        animateStatus(errorContainer, uploaderContainer);
    })

    deleteButton.addEventListener('click', () => {
        animateStatus(resultContainer, uploaderContainer);
    })

    historyEntry.addEventListener('click', () => {
        historyPanel.classList.add('fadeIn');
        historyPanel.classList.remove('hide');
        let optionMask = document.createElement('div');
        optionMask.classList.add('option-mask');
        document.body.appendChild(optionMask);
        let closeOption = () => {
            document.body.removeChild(optionMask);
            historyPanel.classList.add('fadeOut');
            historyPanel.classList.remove('fadeIn');
            setTimeout(() => {
                historyPanel.classList.remove('fadeOut');
                historyPanel.classList.add('hide');
            }, 500)
        };
        optionMask.addEventListener('click', closeOption)

    })

    function animateStatus(from, to) {
        from.classList.remove('hide')
        from.classList.remove('rotateIn')
        from.classList.add('rotateOut')
        const after = () => {
            from.classList.add('hide')
            from.classList.remove('rotateOut')
            to.classList.add('rotateIn')
            to.classList.remove('hide')
            from.removeEventListener('animationend', after)
        }
        from.addEventListener('animationend', after)
    }

    let animationFrame = 0

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
                animationFrame = requestAnimationFrame(callback);
            }
        }
        animationFrame = requestAnimationFrame(callback);
    }
    
    function cancelProgress() {
        cancelAnimationFrame(animationFrame)
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
            }, 500)
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

    function changeError(from, msg) {
        errorTip.textContent = msg
        animateStatus(from, errorContainer)
    }

    function fileHandle(file) {
        if (file.size > data.maxFileSize) {
            changeError(uploaderContainer, 'File is larger than limit (' + data.prettiedMaxFileSize + ').')
        } else {
            animateStatus(uploaderContainer, progressContainer)
            const formData = new FormData()
            formData.append('file', file)
            
            fileName.textContent = file.name
            total.textContent = filesize(file.size)

            let progress = 0
            let origin = 0
            let interval = setInterval(() => {
                let tempProgress = Math.round(progress / file.size)
                updateProgress(origin, tempProgress, 800)
                finished.textContent = filesize(progress)
                origin = tempProgress
            }, 1000)
            axios({
                url: '/api/upload',
                method: 'post',
                data: formData,
                onUploadProgress: (e) => {
                    progress = e.loaded
                }
            }).then(r => {
                clearInterval(interval)
                cancelProgress()
                finished.textContent = filesize(file.size)
                updateProgress(origin, 100, 800)
                showResult(r.data)
                setTimeout(() => {
                    animateStatus(progressContainer, resultContainer)
                }, 1000)
            }).catch(e => {
                setTimeout(() => {
                    changeError(progressContainer, 'Network Error.')
                }, 1000)
            })
        }
    }

    function showResult(res) {
        const url = `${data.domain}/s/${res.downloadCode}`
        urlBox.value = url
        const qr = qrcode(0, 'L')
        qr.addData(url)
        qr.make()
        qrcodeImg.src = qr.createDataURL(10, 20)
    }
})()