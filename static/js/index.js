function hat(bits, base) {
    if (!base) base = 16;
    if (bits === undefined) bits = 128;
    if (bits <= 0) return '0';

    var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
    for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
    }

    var rem = digits - Math.floor(digits);

    var res = '';

    for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
    }

    if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
    }

    var parsed = parseInt(res, base);
    if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base)
    }
    else return res;
}

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
    const historyEmpty = document.getElementById('historyEmpty')
    const historyTable = document.getElementById('historyTable')
    const renewButton = document.getElementById('renewButton')

    const downloadLimit = [
        1, 5, 10, 20, 50, 100, 1000, null
    ]

    const timeLimit = [
        [1, 'hour'],
        [12, 'hour'],
        [1, 'day'],
        [7, 'day'],
        [1, 'month'],
        [6, 'month'],
        [1, 'year'],
        null
    ]

    let targetUpload = {}

    // Read localStorage
    let uploads = []

    let identifier = localStorage['identifier']
    if (!identifier) {
        identifier = hat()
        localStorage['identifier'] = identifier
    }

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

    dayChoice.addEventListener('click', function (event) {
        const options = timeLis(targetUpload.uploadTime)
        showSelection(event, options, (option) => {
            axios.put(`/api/${identifier}/${targetUpload.id}`, {
                timeLimit: parseInt(option.value)
            }).then(r => {
                uploads[0] = r.data
                refreshHistory()
                let resultStr = ''
                if (r.data.timeLimit === null) {
                    resultStr = 'unlimited'
                } else {
                    resultStr = moment(r.data.timeLimit).format('YYYY-MM-DD HH:mm')
                }
                dayChoice.children[0].textContent = resultStr
            }).catch(e => {
                alert(e.response ? e.response.data : e)
            })
        })
    })

    timesChoice.addEventListener('click', function (event) {
        const options = countLis(targetUpload.downloadCount)
        showSelection(event, options, (option) => {
            axios.put(`/api/${identifier}/${targetUpload.id}`, {
                downloadLimit: parseInt(option.value)
            }).then(r => {
                uploads[0] = r.data
                refreshHistory()
                let resultStr = ''
                if (r.data.downloadLimit === null) {
                    resultStr = 'unlimited'
                } else {
                    resultStr = r.data.downloadLimit
                }
                timesChoice.children[0].textContent = resultStr
            }).catch(e => {
                alert(e.response ? e.response.data : e)
            })
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
        optionMask.classList.add('lower-option-mask');
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

    renewButton.addEventListener('click', () => {
        identifier = hat()
        localStorage['identifier'] = identifier
        uploads = []
        refreshHistory()
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

    function countLis(count) {
        let res = ''
        downloadLimit.forEach((v, i) => {
            if (v !== null && v > count) {
                res += `<li data-index="${i}">${v}</li>`
            } else if (v === null) {
                res += `<li data-index="${i}">unlimited</li>`
            }
        })
        return res
    }

    function timeLis(date) {
        const now = moment()
        const boundary = moment(date)
        let res = ''
        timeLimit.forEach((v, i) => {
            if (v !== null && now.isBefore(boundary.add(...v))) {
                res += `<li data-index="${i}">${v.join(' ')}</li>`
            } else if (v === null) {
                res += `<li data-index="${i}">unlimited</li>`
            }
        })
        return res
    }

    function showSelection(event, option, callback) {
        let optionDom = document.createElement('ul');
        optionDom.style.overflowY = 'auto'
        optionDom.style.maxHeight = '100vh'
        optionDom.classList.add('options');
        optionDom.classList.add('fadeIn');
        optionDom.innerHTML = option;
        optionDom.style.left = event.clientX - 75 + 'px';
        optionDom.style.top = event.clientY / 4 + 'px';
        let optionMask = document.createElement('div');
        optionMask.classList.add('higher-option-mask');
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
                value: event.target.attributes['data-index'].value,
                index: Array.prototype.indexOf.call(optionDom.children, event.target)
            });
            closeOption();
        })
    }

    function changeError(from, msg) {
        errorTip.textContent = msg
        animateStatus(from, errorContainer)
    }

    function findTargetIndex(node) {
        while(!node.hasAttribute('data-index')) {
            node = node.parentNode
        }
        return parseInt(node.attributes['data-index'].value)
    }

    function listDayChange(event) {
        const index = findTargetIndex(event.target)
        const target = uploads[index]
        const options = timeLis(target.uploadTime)
        showSelection(event, options, (option) => {
            axios.put(`/api/${identifier}/${target.id}`, {
                timeLimit: parseInt(option.value)
            }).then(r => {
                uploads[index] = r.data
                refreshHistory()
            }).catch(e => {
                alert(e.response ? e.response.data : e)
            })
        })
    }

    function listTimesChange(event) {
        const index = findTargetIndex(event.target)
        const target = uploads[index]
        const options = countLis(target.downloadCount)
        showSelection(event, options, (option) => {
            axios.put(`/api/${identifier}/${target.id}`, {
                downloadLimit: parseInt(option.value)
            }).then(r => {
                uploads[index] = r.data
                refreshHistory()
            }).catch(e => {
                alert(e.response ? e.response.data : e)
            })
        })
    }

    function fileHandle(file) {
        if (file.size > data.maxFileSize) {
            changeError(uploaderContainer, 'File is larger than limit (' + data.prettiedMaxFileSize + ').')
        } else {
            animateStatus(uploaderContainer, progressContainer)
            const formData = new FormData()
            formData.append('file', file)
            formData.append('identifier', identifier)

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
                uploads.splice(0, 0, r.data)
                targetUpload = r.data
                refreshHistory()
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

    function refreshHistory() {
        if (uploads.length === 0) {
            historyEmpty.classList.remove('hide')
            renewButton.classList.add('hide')
        } else {
            historyEmpty.classList.add('hide')
            renewButton.classList.remove('hide')
        }
        // const arrow = document.createElement('svg')
        // arrow.setAttribute('height', '16')
        // arrow.setAttribute('width', '16')
        // arrow.innerHTML = '<polygon points="4 9 8.5 14 13 9" fill="#0080db"></polygon>'

        while (historyTable.children.length > 1) {
            // debugger;
            historyTable.removeChild(historyTable.lastChild)
        }

        const trs = []

        uploads.forEach((v, i) => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td>${v.fileName}</td>
            <td><span>${v.downloadCount}</span>/<span class="choices" data-index="${i}"><span>${v.downloadLimit === null ? 'unlimited' : v.downloadLimit}</span><span><svg width="16" height="16"><polygon points="4 9 8.5 14 13 9" fill="#0080db"></polygon></svg></span></span></td>
            <td><span>${moment(v.uploadTime).format('YYYY-MM-DD HH:mm')}</span>/<span class="choices" data-index="${i}"><span>${v.timeLimit === null ? 'unlimited' : moment(v.timeLimit).format('YYYY-MM-DD HH:mm')}</span><span><svg width="16" height="16"><polygon points="4 9 8.5 14 13 9" fill="#0080db"></polygon></svg></span></span></td></td>
            <td><i class="material-icons" style="color: #e05b62">close</i></td>
            `
            let choices = tr.getElementsByClassName('choices')
            choices[0].addEventListener('click', listTimesChange)
            choices[1].addEventListener('click', listDayChange)
            trs.push(tr)
        })

        historyTable.append(...trs)
    }

    axios.get(`/api/${identifier}`).then(res => {
        uploads = res.data
        refreshHistory()
    })
})()