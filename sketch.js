var snapShotTaken = false;
let snapShot;
var printimg = false;
let captureStarted = true;
let selectedImage = null;

//Row 1 and 2: webcam image, grayscale and channels
let capture;
let redChannel, greenChannel, blueChannel;
let grayscaleImage;
let brightnessFactor = 0.2;
let imgReso = 160;
let imgResoHeight = (imgReso * 3) / 4;
var brightnessSlider;

//Row 3: segmented image
var segImg;
var redSlider;
var greenSlider;
var blueSlider;
var segImgLoaded = false;

//Row 4: Face detection
var ColourSpace1;
var ColourSpace2;

//Row 5:
var faceImg;
var detector;
var classifier = objectdetect.frontalface;
var faces;
var InvertSlider;
var HDTVSlider;

//Face recognition
var faceInput = 0;

//For segmented image in row 3
function preload() {
  segImg = loadImage("assets/beansbag.jpeg", segImgLoadedCallback);
}

function setup() {
  createCanvas(1000, 1000);

  capture = createCapture(VIDEO);
  capture.willReadFrequently = true;
  capture.size(imgReso, imgResoHeight);
  capture.hide();

  //Download button
  let downloadButton = createButton("Download");
  downloadButton.position(imgReso * 4, imgResoHeight* 4.7)
  downloadButton.mousePressed(downloadImage);

  //Button to take screenshot and to refresh page to make it live again 
  var stopButton = createButton("Take Picture");
  stopButton.position(imgReso * 2.4, imgResoHeight/2)
  // stopButton.mousePressed(stopCapture);
  stopButton.mousePressed(toggleCapture);


  //Gray: Brightness control
  brightnessSlider = createSlider(0.2, 1, 0.2, 0.01);

  //segmented image
  redSlider = createSlider(0, 256, 125);
  redSlider.parent("redSlider");
  greenSlider = createSlider(0, 256, 125);
  greenSlider.parent("greenSlider");
  blueSlider = createSlider(0, 256, 125);
  blueSlider.parent("blueSlider");
  InvertSlider = createSlider(0, 256, 125);
  InvertSlider.parent("InvertSlider");
  HDTVSlider = createSlider(0, 256, 125);
  HDTVSlider.parent("HDTVSlider");

  //Face detection image
  var scaleFactor = 1.2;
  detector = new objectdetect.detector(imgReso, imgResoHeight, scaleFactor, classifier);
  faceImg = createImage(imgReso, imgResoHeight);
  faceImg.willReadFrequently = true;

  background(255);
}

function draw() {
  //Row 1
  // Draw the webcam image

    // If mouse is not over capture
  if (!isMouseOver(snapShot, capture, 0, 0, false)) {
    if (!snapShot) {
      // And 'snapShot' does not exist, then call image() using 'capture'
      image(capture, 0, 0, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = capture;
    image(capture,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);

  }

  // Apply grayscale and increase brightness
  brightnessSlider.position(imgReso + 30, imgResoHeight + 25);
  grayscaleImage = makeGrayscale(capture, brightnessSlider.value());
  if (!isMouseOver(snapShot, grayscaleImage, imgReso + 10, 0, false)) {
    if (!snapShot) {
      image(grayscaleImage, imgReso + 10, 0, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = snapShot;
    image(grayscaleImage,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }

  //Row 2
  // Extract and display RGB channels
  redChannel = extractChannel(capture, "red");
  if (!isMouseOver(snapShot, redChannel, 0, imgResoHeight + 40, false)) {
    if (!snapShot) {
      image(redChannel, 0, imgResoHeight + 40, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = redChannel;
    image(redChannel,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  greenChannel = extractChannel(capture, "green");
  if (!isMouseOver(snapShot, redChannel, imgReso + 10, imgResoHeight + 40, false)) {
    if (!snapShot) {
      image(greenChannel, imgReso + 10, imgResoHeight + 40, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = greenChannel;
    image(greenChannel,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  blueChannel = extractChannel(capture, "blue");
  if (!isMouseOver(snapShot, redChannel, imgReso * 2 + 20, imgResoHeight + 40, false)) {
    if (!snapShot) {
      image(blueChannel, imgReso * 2 + 20, imgResoHeight + 40, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = blueChannel;
    image(blueChannel,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //Row 3
  //Segmented images
  redSlider.position(-25, 20);
  greenSlider.position(-25, 20);
  blueSlider.position(-25, 20);

  let seg = drawSegImg(capture);
  if (!isMouseOver(snapShot, redChannel, 0, 2 * imgResoHeight + 80, false)) {
    if (!snapShot) {
      image(seg[0], 0, 2 * imgResoHeight + 80, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = seg[0];
    image(seg[0],imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }

  
  if (!isMouseOver(snapShot, redChannel, imgReso + 10, 2 * imgResoHeight + 80, false)) {
    if (!snapShot) {
      image(seg[1], imgReso + 10, 2 * imgResoHeight + 80, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = seg[1];
    image(seg[1],imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  if (!isMouseOver(snapShot, redChannel, imgReso * 2 + 20, 2 * imgResoHeight + 80, false)) {
    if (!snapShot) {
      image(seg[2], imgReso * 2 + 20, 2 * imgResoHeight + 80, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = seg[2];
    image(seg[2],imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //Row 4
  //Draw the webcam image
  let webcam = createImage(imgReso, imgResoHeight);
  webcam.copy(capture, 0, 0, imgReso, imgResoHeight, 0, 0, imgReso, imgResoHeight);
  if (!isMouseOver(snapShot, redChannel, 0, 3 * imgResoHeight + 120, false)) {
    if (!snapShot) {
      image(webcam, 0, 3 * imgResoHeight + 120, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = webcam;
    image(webcam,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //color Space 1 (Invert)
  ColourSpace1 = makeColSpace1(capture);
  if (!isMouseOver(snapShot, redChannel, imgReso + 10, 3 * imgResoHeight + 120, false)) {
    if (!snapShot) {
      image(ColourSpace1, imgReso + 10, 3 * imgResoHeight + 120, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = ColourSpace1;
    image(ColourSpace1,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //color Space 2 (HDTV)
  ColourSpace2 = makeColSpace2(capture);
  if (!isMouseOver(snapShot, redChannel, imgReso * 2 + 20, 3 * imgResoHeight + 120, false)) {
    if (!snapShot) {
      image(ColourSpace2, imgReso * 2 + 20, 3 * imgResoHeight + 120, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = ColourSpace2;
    image(ColourSpace2,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //Row 5
  // Face detection and replaced face image
  faceDraw(faceInput);

  //segmented image from color space 1
  InvertSlider.position(-25, 20);
  let CS1seg = drawSegImg2(ColourSpace1);
  if (!isMouseOver(snapShot, redChannel, imgReso + 10, 4 * imgResoHeight + 160, false)) {
    if (!snapShot) {
      image(CS1seg, imgReso + 10, 4 * imgResoHeight + 160, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = CS1seg;
    image(CS1seg,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //segmented image from color space 2
  HDTVSlider.position(-25, 20);
  let CS2seg = drawSegImg3(ColourSpace2);
  if (!isMouseOver(snapShot, redChannel, 2 * imgReso + 20, 4 * imgResoHeight + 160, false)) {
    if (!snapShot) {
      image(CS2seg, 2 * imgReso + 20, 4 * imgResoHeight + 160, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = CS2seg;
    image(CS2seg,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }

}

// Grayscale
function makeGrayscale(source, brightnessFactor) {
  let img = createImage(source.width, source.height);
  img.loadPixels();
  source.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = source.pixels[i];
    let g = source.pixels[i + 1];
    let b = source.pixels[i + 2];

    let avg = ((r + g + b) / 3) * (1 + brightnessFactor);
    //Helps to prevent grayscale effect from going beyond 255
    avg = min(255, avg);
    img.pixels[i] = avg;
    img.pixels[i + 1] = avg;
    img.pixels[i + 2] = avg;
    img.pixels[i + 3] = 255;
  }
  img.updatePixels();
  return img;
}

// Color Channels: Meant for extraction /////////////////////////
function extractChannel(source, channel) {
  let img = createImage(source.width, source.height);
  img.loadPixels();
  source.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
    let value = 0;

    switch (channel) {
      case "red":
        value = source.pixels[i];
        break;
      case "green":
        value = source.pixels[i + 1];
        break;
      case "blue":
        value = source.pixels[i + 2];
        break;
    }

    img.pixels[i] = channel == "red" ? value : 0;
    img.pixels[i + 1] = channel == "green" ? value : 0;
    img.pixels[i + 2] = channel == "blue" ? value : 0;
    img.pixels[i + 3] = 255;
  }

  img.updatePixels();
  return img;
}

//Segmented images ////////////////////////////////////////////
function segImgLoadedCallback() {
  segImgLoaded = true;
  segImg.loadPixels();
}

function drawSegImg(img) {
  if (!segImgLoaded) return;

  var redImg = createImage(img.width, img.height);
  redImg.loadPixels();
  var greenImg = createImage(img.width, img.height);
  greenImg.loadPixels();
  var blueImg = createImage(img.width, img.height);
  blueImg.loadPixels();

  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var pixelIndex = (img.width * y + x) * 4;
      var pixelRed = img.pixels[pixelIndex + 0];
      var pixelGreen = img.pixels[pixelIndex + 1];
      var pixelBlue = img.pixels[pixelIndex + 2];

      //red channel
      if (redSlider.value() > pixelRed) {
        pixelRed = 0;
      }
      redImg.pixels[pixelIndex + 0] = pixelRed;
      redImg.pixels[pixelIndex + 1] = 0;
      redImg.pixels[pixelIndex + 2] = 0;
      redImg.pixels[pixelIndex + 3] = 255;

      //green channel
      if (greenSlider.value() > pixelGreen) {
        pixelGreen = 0;
      }
      greenImg.pixels[pixelIndex + 0] = 0;
      greenImg.pixels[pixelIndex + 1] = pixelGreen;
      greenImg.pixels[pixelIndex + 2] = 0;
      greenImg.pixels[pixelIndex + 3] = 255;

      //blue channel
      if (blueSlider.value() > pixelBlue) {
        pixelBlue = 0;
      }
      blueImg.pixels[pixelIndex + 0] = 0;
      blueImg.pixels[pixelIndex + 1] = 0;
      blueImg.pixels[pixelIndex + 2] = pixelBlue;
      blueImg.pixels[pixelIndex + 3] = 255;
    }
  }
  redImg.updatePixels();
  greenImg.updatePixels();
  blueImg.updatePixels();

  return [redImg, greenImg, blueImg];
}

//Colour spaces 1 and 2  //////////////////////////////////////////////////////
//Inverted image
function makeColSpace1(source) {
  let img = createImage(source.width, source.height);
  img.loadPixels();
  source.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = source.pixels[i];
    let g = source.pixels[i + 1];
    let b = source.pixels[i + 2];

    // Convert RGB to Invert
    let red = Math.min(255, 255 - r);
    let green = Math.min(255, 255 - g);
    let blue = Math.min(255, 255 - b);

    img.pixels[i] = red;
    img.pixels[i + 1] = green;
    img.pixels[i + 2] = blue;
    img.pixels[i + 3] = 255;
  }

  img.updatePixels();
  return img;
}
//Colour converted image
// 10.5 ITU.BT-709 HDTV studio production in Y’CbCr
function makeColSpace2(source) {
  //Math behind the conversion
  // Y' = 0.2125 * R + 0.7154 * G + 0.0721 * B
  // Cb = -0.1145 * R - 0.3855 * G + 0.5000 * B
  // Cr = 0.5016 * R - 0.4556 * G - 0.0459 * B

  // R' = Y' + 0.0000 * Cb + 1.5701 * Cr
  // G' = Y' - 0.1870 * Cb - 0.4664 * Cr
  // B' = Y' - 1.8556 * Cb + 0.0000 * Cr

  let img = createImage(source.width, source.height);
  img.loadPixels();
  source.loadPixels();

  for (let i = 0; i < source.pixels.length; i += 4) {
    let r = source.pixels[i];
    let g = source.pixels[i + 1];
    let b = source.pixels[i + 2];

    // Convert RGB to Y'CbCr according to ITU-R BT.709
    let yPrime = 0.2125 * r + 0.7154 * g + 0.0721 * b;
    let cb = -0.1145 * r - 0.3855 * g + 0.5 * b;
    let cr = 0.5016 * r - 0.4556 * g - 0.0459 * b;

    // Convert Y'CbCr back to RGB
    let newR = yPrime + 0.0 * cb + 1.5701 * cr;
    let newG = yPrime - 0.187 * cb - 0.4664 * cr;
    let newB = yPrime - 1.8556 * cb + 0.0 * cr;

    // Ensure RGB values are within the 0-255 range
    newR = Math.min(Math.max(0, newR), 255);
    newG = Math.min(Math.max(0, newG), 255);
    newB = Math.min(Math.max(0, newB), 255);

    img.pixels[i] = newR;
    img.pixels[i + 1] = newG;
    img.pixels[i + 2] = newB;
    img.pixels[i + 3] = 255; // Alpha channel
  }

  img.updatePixels();
  return img;
}

//function to draw inverted image with a threshold slider
function drawSegImg2(img) {
  var InvertImg = createImage(img.width, img.height);
  InvertImg.loadPixels();
  InvertImg = thresholdFilter(img, InvertSlider.value());
  InvertImg.updatePixels();
  return InvertImg;
}

//function to draw HDTV image with a threshold slider
function drawSegImg3(img) {
  var HDTVImg = createImage(img.width, img.height);
  HDTVImg.loadPixels();
  HDTVImg = thresholdFilter(img, HDTVSlider.value());
  HDTVImg.updatePixels();
  return HDTVImg;
}
//Threshold filter //////////////////////////////////////////////////
function thresholdFilter(img, threshold) {
  var imgOut = createImage(img.width, img.height);
  imgOut.loadPixels();
  img.loadPixels();
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      var index = (x + y * img.width) * 4;

      var r = img.pixels[index + 0];
      var g = img.pixels[index + 1];
      var b = img.pixels[index + 2];

      var gray = (r + g + b) / 3;
      if (gray > threshold) {
        // If gray is above the threshold, keep the original color
        imgOut.pixels[index + 0] = r;
        imgOut.pixels[index + 1] = g;
        imgOut.pixels[index + 2] = b;
      } else {
        // If gray is below the threshold, set the color to black or another color
        imgOut.pixels[index + 0] = 0; // Red channel
        imgOut.pixels[index + 1] = 0; // Green channel
        imgOut.pixels[index + 2] = 0; // Blue channel
      }
      imgOut.pixels[index + 3] = 255; // Alpha channel
    }
  }

  imgOut.updatePixels();
  return imgOut;
}
//////////////////////////////////////////////////////////////////////////////////////////////////

//Face recognition//////////////////////////////////////////////////
function faceDraw(input) {  
  if (!isMouseOver(snapShot, capture, 0, imgResoHeight * 4 + 160, false)) {
    if (!snapShot) {
      image(capture, 0, imgResoHeight * 4 + 160, imgReso, imgResoHeight);
    } 
  }
  else{
    selectedImage = capture;
    image(capture,imgReso * 3.5, imgResoHeight * 3, imgReso*1.5, imgResoHeight*1.5);
  }


  //This works by copying the face image from the first webcam.
  faceImg.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
  faces =[];
  faces = detector.detect(faceImg.canvas);

  strokeWeight(2);
  stroke(255);
  noFill();

  //the rectangles are made to be physically drawn in the 4th row
  for (var i = 0; i < faces.length; i++) {
    var face = faces[i];
    if (face[4] > 4) {
      rect(face[0], face[1] + imgResoHeight * 4 + 160, face[2], face[3]);
      let croppedFace = faceImg.get(face[0], face[1], face[2], face[3]);

      // Replace the detected face with a grayscale image

      // Add similar conditions for other options (blurred, color converted, pixelated)
      if (faceInput == 1) {
        let grayFace = makeGrayscale(croppedFace, brightnessFactor);
        image(grayFace, face[0], face[1] + imgResoHeight * 4 + 160, face[2], face[3]);
      }
      if (faceInput == 2) {
        let blurFace = blurImage(croppedFace, 8);
        image(blurFace, face[0], face[1] + imgResoHeight * 4 + 160, face[2], face[3]);
      }
      if (faceInput == 3) {
        let InvertFace = makeColSpace1(croppedFace);
        image(InvertFace, face[0], face[1] + imgResoHeight * 4 + 160, face[2], face[3]);
      }
      if (faceInput == 4) {
        let HDTVface = makeColSpace2(croppedFace);
        image(HDTVface, face[0], face[1] + imgResoHeight * 4 + 160, face[2], face[3]);
      }
      if (faceInput == 5) {
        let pixelatedFace = pixelated(croppedFace, 10);
        image(pixelatedFace, face[0], face[1] + imgResoHeight * 4 + 160, face[2], face[3]);
      }
    }
  }
  //Text for instructions
  textAlign(LEFT, TOP);
  textSize(16);
  fill(0);
  text("Press the keys for:", 0, 770);
  text("[1]: Grayscale", 0, 800);
  text("[2]: Blur", 0, 820);
  text("[3]: Invert", 0, 840);
  text("[4]: HDTV", 0, 860);
  text("[5]: Pixelated", 0, 880);  
}

//Face recognition: Pixelated image
function pixelated(source) {
  let pixelSize = 5;
  // Use the grayscale function without a brightness factor
  let grayscale = makeGrayscale(source, 1); 
  let img = createImage(source.width, source.height);
  img.loadPixels();
  grayscale.loadPixels();

  // Iterate over each block of 5x5 pixels
  for (let x = 0; x < source.width; x += pixelSize) {
    for (let y = 0; y < source.height; y += pixelSize) {
      let total = 0;
      let count = 0;

      // Sum up the brightness of each pixel in the block
      for (let dx = 0; dx < pixelSize; dx++) {
        for (let dy = 0; dy < pixelSize; dy++) {
          let nx = x + dx;
          let ny = y + dy;

          // Check if the pixel is within the bounds of the image
          if (nx < source.width && ny < source.height) {
            let index = (ny * source.width + nx) * 4;
            // For grayscale intensity
            total += grayscale.pixels[index]; 
            count++;
          }
        }
      }
      // Calculate the average pixel intensity for the block
      let avePixInt = total / count;

      // Paint the entire block with the average pixel intensity
      for (let dx = 0; dx < pixelSize; dx++) {
        for (let dy = 0; dy < pixelSize; dy++) {
          let nx = x + dx;
          let ny = y + dy;

          if (nx < source.width && ny < source.height) {
            let index = (ny * source.width + nx) * 4;
            img.pixels[index] = avePixInt;
            img.pixels[index + 1] = avePixInt;
            img.pixels[index + 2] = avePixInt;
            img.pixels[index + 3] = 255; // Alpha channel should be fully opaque
          }
        }
      }
    }
  }

  img.updatePixels();
  return img;
}

function blurImage(source, blurSize) {
  let img = createImage(source.width, source.height);
  img.loadPixels();
  source.loadPixels();

  const w = source.width;
  const h = source.height;

  // Kernel size for the blur effect, must be an odd number
  const kernelSize = blurSize % 2 !== 0 ? blurSize : blurSize + 1;
  const edge = Math.floor(kernelSize / 2);

  // Iterate over each pixel in the image
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      // Iterate over the kernel
      for (let ky = -edge; ky <= edge; ky++) {
        for (let kx = -edge; kx <= edge; kx++) {
          let nx = x + kx;
          let ny = y + ky;

          // Check if the neighbor is within the bounds of the image
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            let index = (ny * w + nx) * 4;
            r += source.pixels[index];
            g += source.pixels[index + 1];
            b += source.pixels[index + 2];
            count++;
          }
        }
      }
      // Calculate the average color
      let newIndex = (y * w + x) * 4;
      img.pixels[newIndex] = r / count;
      img.pixels[newIndex + 1] = g / count;
      img.pixels[newIndex + 2] = b / count;
      img.pixels[newIndex + 3] = 255;
    }
  }

  img.updatePixels();
  return img;
}
////////////////////////////////////////////////////////////////////////////////////////

function keyPressed() {
  //Keypressed functions 
  if (keyCode == 49) {
    faceInput = 1;
  } else if (keyCode == 50) {
    faceInput = 2;
  } else if (keyCode == 51) {
    faceInput = 3;
  } else if (keyCode == 52) {
    faceInput = 4;
  } else if (keyCode == 53) {
    faceInput = 5;
  } else {
    console.log("Invalid input");
  }
}

//function that determines if a mouse is over the image.
function isMouseOver(outputSnapShot, inputCapture, captureX, captureY, snapShotIsTaken) {
  let withinBounds = mouseX >= captureX && mouseX <= captureX + inputCapture.width && mouseY >= captureY && mouseY <= captureY + inputCapture.height;

  // If mouse is within bounds
  if (withinBounds) {
    if (!snapShotIsTaken) {
      // And if snapshot is not taken, then snapshot becomes taken, and get a frame of inputCapture
      // Change this to true, this code block executes once only; thus, getting a frame of inputCapture
      snapShotIsTaken = true; 
      outputSnapShot = inputCapture.get();
    }

    // Else if mouse is out of bounds, then snapshot is not taken again
  } 
  else snapShotIsTaken = false;

  return snapShotIsTaken;
}

//function that toggles the capture. reloads the page to make it live again
function toggleCapture(){
  if(captureStarted){
    capture.stop();
    captureStarted = false;
  }
  else{
    window.location.reload();
    captureStarted = true;
  }
}

//function to download image
function downloadImage() {
  if(selectedImage){
    save(selectedImage, 'GP_image.png');
  }
  else if (selectedImage == null){
    console.log("Image not chosen");
  }
}

//////////COMMENTARY//////////////////////////////////////////////////////////////////////////////
// In this project, I was able to implement various Image processing techniques on a webcam feed using the p5.js library. 

// During the image segmentation, I was able to create a single function that takes in an image and a colour channel,
// and return a new image with an extracted color channel, leaving the other channels as 0 for a grayscale effect. 
// The image segmentation function works for other channels as it takes in a value which is adjusted externally(threshold slider or just a set value). It does not make it noisy. 

// The threshold filter function takes an image and a threshold value, calculates the grayscale intensity for each pixel and then compares it to the threshold. 
// It keeps the bright pixels above the threshold and sets the dark pixels as black. 
// With the thresholdFilter function, I was able to utilise it for other functions such as drawSegImg2 and drawSegImg3, for the segmented images from colour space 1 and 2. 

// In the colour space 1 and 2, I had used an inverted filter and a "10.5 ITU.BT-709 HDTV studio production in Y’CbCr" filter. This was a filter commonly used in American TV's.
// For the inverted filter, each pixel was converted to its inverse, resulting in an inverted grayscale image.
// The makeColSpace2 function converts an RGB image to the Y'CbCr color space based on the ITU-R BT.709 standard for HDTV studio production, then back to RGB. 
// This process separates the brightness and color channels, allowing for color balance adjustments.

// In the Face drawn function, I used the objectdetect.js library to detect faces in the input video stream and apply the image processing techniques to the detected faces based on faceInputs.
// By clicking on to the key values ranging from 1-5, it chooses a specific face to draw.

// In my extension, I added 3 functions to the project. One to stop a particular video stream, one to take a picture, and one to download an image.
// The isMouseOver function checks if a mouse is over a given image, if so, takes a snapshot of it. It then returns a boolean value indicating if the mouse is over the input image.
// The code block then displays the snapshot over the original video, making it look paused.

// Meanwhile, the code saves the last saved frame on the right side of the code, an expanded view for users.
// Utilising the 'save' parameter, the code saves the last saved frame as an image file when the download button is clicked.

// Lastly, the take picture function is used to take a picture of all video streams. It works by stopping the capture when the button is clicked.
// When the button is clicked again, it refreshes the screen so that the video stream will move smoothly. This is because, if captured is played after it stopped, it makes the video look choppy.