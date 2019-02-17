# rajio

Rajio is an anonymous file/text sharing platform on web, focusing on lightweight and easy-deploy. :ghost:

## Introduction

Just similar to [Firefox Send](https://send.firefox.com/), Rajio gives you a space to upload file or text without login and your privacy. **Rajio will not encrypt your file on the server, which is different from Firefox Send**. After uploading, you can share it with your friends by urls or QRCode.

Rajio generate and storage your identifier token for your uploaded files locally. You can wipe your history and hide yourself by renew a indentifier token. We will not store any data about the relationship between specific people and identifier.

The original intention of rajio is only to find an easy way to transfer a file from my PC to my phones without any other software installed.
 
Just test it on [https://rajio.delbertbeta.cc](https://rajio.delbertbeta.cc)

## Features

* Adaptive UI for mobile and desktop
* Upload & download file
* Generate QRCode and link for share
* Restrict download count limit or time limit.
* Visualization for statistics data
* No login and privacy is needed
* One-key renew identifier and wipe history

[Change Log](https://github.com/delbertbeta/rajio/blob/master/ChangeLog.md)

## Screenshot

![rajio_1](https://rajio.delbertbeta.cc/d/bf031250b96360e9c213561066c3bd05/rajio_1.png)
![rajio_2](https://rajio.delbertbeta.cc/d/002fb90cff8132212dc221d9875cbfd6/rajio_2.png)
![rajio_3](https://rajio.delbertbeta.cc/d/b636346b8cb322832611795a3632fc0f/rajio_3.png)
![rajio_4](https://rajio.delbertbeta.cc/d/3ced93e38c696ee6efbf343a41b455d4/rajio_4.png)
![rajio_5](https://rajio.delbertbeta.cc/d/296db6ec148bbc50b532e8567ef2610b/rajio_5.png)

## Command-Line Tools

* local

`local` is a tool to share your exist file on server to others. This tool creates symbolic link of the file to the upload folder and creates item in database so rajio can serve it. 

**Delete file created by `local` will not delete your orginal file.** 

```
Usage: local [options]

Options:
  -v, --version                output the version number
  -l, --local-file <path>      Specific a local file to share
  -i, --identifier <string>    Specific a identifier (Optional)
  -t, --time-limit <datetime>  Limit the time (Optional)
  -d, --download-limit <n>     Limit the download count (Optional)
  -h, --help                   output usage information
```

Speicific your identifier to manage this file in your history panel on web. To get identifier of your session, run

```javascript
localStorage["identifier"]
``` 

in your browser's devtool with rajio open.

Example:

```bash
node ./cmd/local.js -l ~/rajio/config.js -i ec4627b7c2883ba0ee17a78087ff9e2e -d 10 -t "2018-11-21 00:00"
```

Return:

```javascript
{
  uploadTime: '2018-11-19T16:25:15.567Z',
  deleted: false,
  id: '3054632c0cf151d42e083072c6ae7c29',
  downloadCount: 0,
  downloadLimit: 10,
  timeLimit: '2018-11-20T16:00:00.000Z',
  downloadCode: '823ef3',
  fileSize: 106,
  fileName: 'config.js',
  identifier: 'ec4627b7c2883ba0ee17a78087ff9e2e',
  updatedAt: '2018-11-19T16:25:15.569Z',
  createdAt: '2018-11-19T16:25:15.569Z'
}
```

## Install

1. Install Node

Rajio are tested on `nodejs >= 8.9.0`, if you don't have node installed, visit https://nodejs.org for help.

2. Install yarn

Rajio uses `yarn` for package management, to install `yarn`:

```bash
npm install -g yarn
```

3. Clone the code

Choose a place to clone the code.

```bash
git clone https://github.com/delbertbeta/rajio.git
cd rajio
```

4. Install dependencies

Yarn will do everything for you:

```
yarn
```

5. Configure rajio

Edit `config.js` for domain, maxFileSize, etc.

6. Start app.js

You can use `pm2` or `forever` to monitor the process of node, or just simply type

```
node app.js
```

Now the application is running on port `4290`, to modify this, edit `app.js`

7. (Optional) Configure your http server for proxy

If you are running `nginx` or `apache`, you may want to configure reserve proxy for Rajio. Visit their documents for help.

Now you have finished the installation of Rajio. :tada::tada:

## License

MIT License

Copyright (c) 2018 delbertbeta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.