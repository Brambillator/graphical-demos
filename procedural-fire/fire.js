var firedemo = {

    width: 20,
    height: 20,

    canvasContext: null,
    canvasImage: null,

    fireColorsPalette: [
        { "r":   0, "g":  0, "b": 0, "a": 0 },  // 0
        { "r":  40, "g":  5, "b": 3, "a": 255 },
        { "r":  70, "g": 2, "b": 5, "a": 255 },
        { "r": 128, "g": 0, "b": 8, "a": 255 },
        { "r": 178, "g": 0, "b": 11, "a": 255 },
        { "r": 224, "g":   0, "b":  13, "a": 255 }, // 5
        { "r": 228, "g":  27, "b":  17, "a": 255 },
        { "r": 231, "g":  54, "b":  20, "a": 255 },
        { "r": 235, "g":  82, "b":  22, "a": 255 },
        { "r": 238, "g": 109, "b":  25, "a": 255 },
        { "r": 241, "g": 136, "b":  27, "a": 255 },  // 10
        { "r": 245, "g": 164, "b":  31, "a": 255 },
        { "r": 247, "g": 191, "b":  34, "a": 255 },
        { "r": 250, "g": 218, "b":  37, "a": 255 },
        { "r": 254, "g": 246, "b":  41, "a": 255 },
        { "r": 255, "g": 255, "b": 255, "a": 255 }], //15


    pixels: [],

    buildMatrix: function () {

        // Create fire matrix
        let pixelCount = this.width * this.height;

        for (let i = 0; i < pixelCount; i++) {
            this.pixels[i] = 0;
        }

        // Create Canvas Data
        this.canvasContext = canvas.getContext('2d');
        this.canvasContext.imageSmoothingEnabled = false;
        

        this.canvasImage = this.canvasContext.createImageData(this.width, this.height);
    },

    drawPixel: function (x, y, color) {
        
        var index = (y * canvas.width + x) * 4;
        
        this.canvasImage.data[index + 0] = color.r;
        this.canvasImage.data[index + 1] = color.g;
        this.canvasImage.data[index + 2] = color.b;
        this.canvasImage.data[index + 3] = color.a;

    },

    swapBuffer: function () {

        this.canvasContext.putImageData(this.canvasImage, 0, 0);

    },

    decay: 2,

    updateMatrix: function () {

        let pixelCount = this.width * this.height;
        let lastLineStart = pixelCount - this.width;

        for (let i = 0; i < lastLineStart; i++) {

            // Valor do pixel 
            let southEastPixelIndex = i + (this.width + 1);
            let bottomPixelValue = this.pixels[southEastPixelIndex];
            let max = this.decay;
            let min = 1;
            let value = bottomPixelValue - (Math.floor(Math.random() * (max - min + 1)) + min);
            this.pixels[i] = value > 0 ? value : 0;

        }

    },

    updateFireSource: function () {
        let pixelCount = this.width * this.height;
        let lastLineStart = pixelCount - this.width;
        for (let i = lastLineStart; i <= pixelCount; i++) {
            this.pixels[i] = 15;
        }
    },

    render: function () {

        this.canvasImage = this.canvasContext.createImageData(this.width, this.height);

        let arrayIndex = -1;
        for (let l = 0; l < this.height; l++) {

            for (let c = 0; c < this.width; c++) {
                arrayIndex++;

                let colorIndex = this.pixels[arrayIndex];
                if(colorIndex < 0) colorIndex = 0;
                if(colorIndex > 15) colorIndex = 15;
                let color = this.fireColorsPalette[colorIndex];
                this.drawPixel(c, l, color);

            }
        }

        this.swapBuffer();
    },

    renderDebugValues: function () {
        document.getElementById('debug-panel').innerHTML = 'frame:' + frame + ' decay:' + this.decay.toString();
    },

    interval: 0,

    startStop: function () {
        if (this.running) {
            clearInterval(this.interval);
            this.running = false;
        } else {
            this.interval = setInterval(() => {
                frame++;
                this.updateMatrix();
                this.render();
                this.renderDebugValues();
            }, 42);
            this.running = true;
        }
    },

    running: false

}

var canvas = document.getElementById('render-canvas');
firedemo.width = canvas.width;
firedemo.height = canvas.height;

var frame = 0;
firedemo.buildMatrix();
firedemo.updateFireSource(); // Set base on fire

firedemo.startStop();