// Declare global variables
let video, videoAudio, fft, gain;
let staticNoise;
let staticEnv;
let dubAudios = []; // Array to hold dub sound clips
let isDubbing = false; // Flag to check if a dub is currently playing
let currentDub = null; // Reference to the currently playing dub
let lastDub = null; // Reference to the previously played dub (to prevent repeats)
let midsensitivity = 90; // Threshold for mid-frcequency energy triggering a dub

//cooldowns to prevent spamming
// let dubCooldown = 1000;             //to prevent rapid antenna spinning that would trigger multiple dubs
let channelCooldown = 1000;         //to prevent rapid channel switching that would loose video files or crashing the website
let volumeCooldown = 500;          //to prevent rapid volume changes.

// audioBucket that holds call, response and random audio clips
let audioBucket = [
  {
    call: [], response: [], random: []
  },
  {
    call: [], response: [], random: []
  },
  {
    call: [], response: [], random: []
  },
  {
    call: [], response: [], random: []
  }
];

let currentBucket = 0;
let callBucket, responseBucket, dubBucket;

let dubVideo = []; // Array to hold dub video clips
let dubVideoAudio = []; // Array to hold the videos original audio
let currentChannel = -1; // For the channel to change when first interaction

let callSounds = []; // Raw call audio
let responseSounds = []; // Raw response audio
let callfrequency = 0.3; // 30% chance to use call/response instead of dub
let awaitingResponse = false; // Flag to wait for next spike
let queuedResponse = null; // Reference to the response dub to be played

//testing to create a cooldown when switching knob
//let lastSwitchTime = 0;
//let cooldownTime = 10;

let friction = 0.25

let x,y;
let bg;

let mainAudioVolume = 1; // A way to adjust the original volume
let minDubbedAudioVolume = 0.6; // A way to adjust the dubbed volume
let maxDubbedAudioVolume = 0.7; // A way to adjust the dubbed volume

let powerButtonIcon;
let tvOn;         // Flag to check if the telly is on

//Complicated Knob by icm
//https://editor.p5js.org/icm/sketches/HkfFHcp2
var dragging = false; // Is the slider being dragged?
var rollover = false; // Is the mouse over the slider?
// Circle variables for knob
var knobOffsetX = 310;
var knobOffsetY = 70;
var r = 20;
// Knob angle
var angle = 0;
var count = 0;

// Offset angle for turning knob
var offsetAngle = 0;

let antennaBaseX, antennaBaseY;
let antennaAngle1 = -90;
let antennaAngle2 = 0;
let antennaLength = 80;
let antennaDiameter = 15;
//if we are going to use more, we would need to change this
let antennaBuckets = 4;         // Number of "audio buckets"

let antenna1, antenna2;

function preload() {

  applyAntennaBucket(0);

  //hardwood background image
  bg = loadImage("assets/hardwoodBackground.jpg");
  bg = loadImage("assets/hardwoodBackground-1.jpg");

  //tv button icons
  powerButtonIcon = loadImage("assets/powerButtonIcon.jpg");

  // Load the main video file (muted) and its original audio track
  //video = createVideo(['video.mp4']);
  //videoAudio = loadSound('video_audio.mp3');
  //video = createVideo(['volcano_video.mp4']);
  //videoAudio = loadSound('volcano_audio.mp3');
  //video = createVideo(['bobRoss_video.mp4']);
  //videoAudio = loadSound('bobRoss_audio.mp3');


  // Western Bucket
  audioBucket[0].call.push(
    loadSound("Call-amigo.mp3"),
    loadSound("Call-finished.mp3"),
    loadSound("Call-going.mp3"),
    loadSound("Call-how.mp3"),
    loadSound("Call-looking.mp3"),
    loadSound("Call-thoseguys.mp3"),
    loadSound("Call-who.mp3"),
    loadSound("Call-lost.mp3"),
    loadSound("Call-music.mp3"),
    loadSound("Call-wait.mp3"),
    loadSound("Call-sober.mp3"),
    loadSound("Call-use.mp3"),
    loadSound("Call-interesting.mp3"),
    loadSound("Call-drunk.mp3"),
    loadSound("Call-voice.mp3"),
    loadSound("Call-reasonable.mp3"),
    loadSound("Call-temper.mp3"),
    loadSound("Call-worried.mp3"),
    loadSound("Call-prophet.mp3"),
    loadSound("Call-indio.mp3"),
    loadSound("Call-caught.mp3"),
    loadSound("Call-worth.mp3"),
    loadSound("Call-friends.mp3"),
    loadSound("Call-blondie.mp3"),
    loadSound("Call-work.mp3"),
    loadSound("Call-two.mp3"),
    loadSound("Call-coming.mp3"),
    loadSound("Call-list.mp3"),
    loadSound("Call-shake.mp3")

  );
  audioBucket[0].response.push(
    loadSound("Response-24hours.mp3"),
    loadSound("Response-26.mp3"),
    loadSound("Response-affairs.mp3"),
    loadSound("Response-beauty.mp3"),
    loadSound("Response-best.mp3"),
    loadSound("Response-direction.mp3"),
    loadSound("Response-Go.mp3"),
    loadSound("Response-hang.mp3"),
    loadSound("Response-laughing.mp3"),
    loadSound("Response-life.mp3"),
    loadSound("Response-loser.mp3"),
    loadSound("Response-mad.mp3"),
    loadSound("Response-mind.mp3"),
    loadSound("Response-morons.mp3"),
    loadSound("Response-pessimist.mp3"),
    loadSound("Response-picky.mp3"),
    loadSound("Response-scarecrow.mp3"),
    loadSound("Response-sherriff.mp3"),
    loadSound("Response-shoot.mp3"),
    loadSound("Response-Shot.mp3"),
    loadSound("Response-travel.mp3"),
    loadSound("Response-not.mp3"),
    loadSound("Response-us.mp3"),
    loadSound("Response-talk.mp3")
  );
  audioBucket[0].random.push(
    loadSound("Random-bank.mp3"),
    loadSound("Random-compliment.mp3"),
    loadSound("Random-dead.mp3"),
    loadSound("Random-doyouknow.mp3"),
    loadSound("Random-fight.mp3"),
    loadSound("Random-flesh.mp3"),
    loadSound("Random-life.mp3"),
    loadSound("Random-money.mp3"),
    loadSound("Random-nowhere.mp3"),
    loadSound("Random-present.mp3"),
    loadSound("Random-proverb.mp3"),
    loadSound("Random-rant.mp3"),
    loadSound("Random-robbing.mp3"),
    loadSound("Random-see.mp3"),
    loadSound("Random-showtime.mp3"),
    loadSound("Random-vision.mp3"),
    loadSound("Random-voodoo.mp3")
  );

  // Action/Thriller Bucket
  audioBucket[1].call.push(
    loadSound("call-clockwork.mp3"),
    loadSound("call-clue.mp3"),
    loadSound("call-goldfinger.mp3"),
    loadSound("call-harry.mp3"),
    loadSound("call-luke.mp3"),
    loadSound("call-ocean.mp3"),
    loadSound("call-present-danger.mp3"),
    loadSound("call-rambo.mp3"),
    loadSound("call-silence.mp3"),
    loadSound("call-vendetta.mp3")
  );
  audioBucket[1].response.push(
    loadSound("response-conan.mp3"),
    loadSound("response-bullitt.mp3"),
    loadSound("response-darko.mp3"),
    loadSound("response-deliverance.mp3"),
    loadSound("response-fargo.mp3"),
    loadSound("response-luke.mp3"),
    loadSound("response-madmax.mp3"),
    loadSound("response-sudden-impact.mp3"),
    loadSound("response-taken.mp3"),
    loadSound("response-topgun.mp3")
  );
  audioBucket[1].random.push(
    loadSound("random-john-cena.mp3"),
    loadSound("random-make-my-day.mp3"),
    loadSound("random-friends-close.mp3"),
    loadSound("random-wilhelm.mp3"),
  )

  // Cartoon/Humour Bucket
  audioBucket[2].call.push(
    loadSound("call-sued.mp3"),
    loadSound("call-over21.mp3"),
    loadSound("call-funny.wav"),
    loadSound("call-doc.wav"),
    loadSound("call-know-the-word.mp3"),
    loadSound("call-jobs.mp3"),
    loadSound("call-talladega.mp3"),
    loadSound("call-lifeofbrian.mp3"),
    loadSound("call-homealone.mp3"),
    loadSound("call-airplane.mp3"),
  );
  audioBucket[2].response.push(
    loadSound("response-rocks.mp3"),
    loadSound("response-insults.mp3"),
    loadSound("response-grief.mp3"),
    loadSound("response-beetlejuice.mp3"),
    loadSound("response-beethoven.mp3"),
    loadSound("response-frog.mp3"),
    loadSound("response-cableguy.mp3"),
    loadSound("response-office.mp3"),
    loadSound("response-pineapple.mp3"),
    loadSound("response-ventura.mp3"),

  );
  audioBucket[2].random.push(
    loadSound("random-goofy.mp3"),
    loadSound("random-finn.mp3"),
    loadSound("random-bugs-bunny.mp3"),
    loadSound("random-rat.mp3"),
  );

  // Horror Bucket
  audioBucket[3].call.push(
    loadSound("call-anyone-here.mp3"),
    loadSound("call-whoever-you-are.mp3"),
    loadSound("call-get-away.mp3"),
    loadSound("call-cabin.wav"),
    loadSound("call-moral.mp3"),
    loadSound("call-saturday.mp3"),
    loadSound("call-snatchers.mp3"),
    loadSound("call-saw.mp3"),
    loadSound("call-frankenstein.mp3"),
    loadSound("call-exorcist.mp3"),
  );
  audioBucket[3].response.push(
    loadSound("response-dracula.mp3"),
    loadSound("response-johnny.mp3"),
    loadSound("response-survival.mp3"),
    loadSound("response-beetlejuice.mp3"),
    loadSound("response-death-room.mp3"),
    loadSound("response-evildead.mp3"),
    loadSound("response-hellraiser.mp3"),
    loadSound("response-wicker.mp3"),
  );
  audioBucket[3].random.push(
    loadSound("random-fnaf.mp3"),
    loadSound("random-error.mp3"),
    loadSound("random-dead-people.mp3"),
    loadSound("random-horror-sfx.mp3"),
  );

  //Load the video and the original audio into the array
  dubVideo.push(createVideo("video.mp4"));
  dubVideoAudio.push(loadSound("video_audio.mp3"));
  dubVideo.push(createVideo("video.mp4"));
  dubVideoAudio.push(loadSound("video_audio.mp3"));
  dubVideo.push(createVideo("EngineSentai.mp4"));
  dubVideoAudio.push(loadSound("EngineSentai.mp3"));
  dubVideo.push(createVideo("Sentai_Cowboy.mp4"));
  dubVideoAudio.push(loadSound("Sentai_Cowboy.mp3"));
  dubVideo.push(createVideo("volcano_video.mp4"));
  dubVideoAudio.push(loadSound("volcano_audio.mp3"));
  dubVideo.push(createVideo("bobRoss_video.mp4"));
  dubVideoAudio.push(loadSound("bobRoss_audio.mp3"));
  dubVideo.push(createVideo("shantyBoat_video.mp4"));
  dubVideoAudio.push(loadSound("shantyBoat_audio.mp3"));
  dubVideo.push(createVideo("theShining_video.mp4"));
  dubVideoAudio.push(loadSound("theShining_audio.mp3"));
  dubVideo.push(createVideo("spaceOdyssey_video.mp4"));
  dubVideoAudio.push(loadSound("spaceOdyssey_audio.mp4"));


  video = dubVideo[1];
  videoAudio = dubVideoAudio[1];
  //to check how many videos are currently in the array
  let allVideos = dubVideo.length;
  console.log("There are", allVideos, "channels");
  for (i = 1; i < dubVideo.length; i++) {
    dubVideo[i].hide();
  }

  /*
  // Load alternative dub audio clips into the array
  dubAudios.push(loadSound("random-be-back.mp3"));
  dubAudios.push(loadSound("random-boat.mp3"));
  dubAudios.push(loadSound("random-chicken.mp3"));
  dubAudios.push(loadSound("random-dead-people.mp3"));
  dubAudios.push(loadSound("random-emotional.mp3"));
  dubAudios.push(loadSound("random-error.mp3"));
  dubAudios.push(loadSound("random-finn.mp3"));
  dubAudios.push(loadSound("random-fnaf.mp3"));
  dubAudios.push(loadSound("random-force.mp3"));
  dubAudios.push(loadSound("random-frankly.mp3"));
  dubAudios.push(loadSound("random-friends-close.mp3"));
  dubAudios.push(loadSound("random-goofy.mp3"));
  dubAudios.push(loadSound("random-john-cena.mp3"));
  dubAudios.push(loadSound("random-make-my-day.mp3"));
  dubAudios.push(loadSound("random-mike.mp3"));
  dubAudios.push(loadSound("random-offer.mp3"));
  dubAudios.push(loadSound("random-pipe.mp3"));
  dubAudios.push(loadSound("random-talking-to.mp3"));
  dubAudios.push(loadSound("random-view.mp3"));
  dubAudios.push(loadSound("random-what-about-us.mp3"));
  dubAudios.push(loadSound("random-wilhelm.mp3"));
  
  // Load the call and response audios into the arrays
  // From Action/Thriller Folder
  /*
  callSounds.push(loadSound("call-clockwork.mp3"));
  callSounds.push(loadSound("call-clue.mp3"));
  callSounds.push(loadSound("call-goldfinger.mp3"));
  callSounds.push(loadSound("call-harry.mp3"));
  callSounds.push(loadSound("call-luke.mp3"));
  callSounds.push(loadSound("call-ocean.mp3"));
  callSounds.push(loadSound("call-present-danger.mp3"));
  callSounds.push(loadSound("call-rambo.mp3"));
  callSounds.push(loadSound("call-silence.mp3"));
  callSounds.push(loadSound("call-vendetta.mp3"));
  

  responseSounds.push(loadSound("response-conan.mp3"));
  responseSounds.push(loadSound("response-bullitt.mp3"));
  responseSounds.push(loadSound("response-darko.mp3"));
  responseSounds.push(loadSound("response-deliverance.mp3"));
  responseSounds.push(loadSound("response-fargo.mp3"));
  responseSounds.push(loadSound("response-luke.mp3"));
  responseSounds.push(loadSound("response-madmax.mp3"));
  responseSounds.push(loadSound("response-sudden-impact.mp3"));
  responseSounds.push(loadSound("response-taken.mp3"));
  responseSounds.push(loadSound("response-topgun.mp3"));

  // From Cartoon/Humour Folder
  callSounds.push(loadSound("call-sued.mp3"));
  callSounds.push(loadSound("call-over21.mp3"));
  callSounds.push(loadSound("call-funny.wav"));

  responseSounds.push(loadSound("response-rocks.mp3"));
  responseSounds.push(loadSound("response-insults.mp3"));
  responseSounds.push(loadSound("response-grief.wav"));

  // From Horror/Mystery Folder
  callSounds.push(loadSound("call-anyone-here.mp3"));
  callSounds.push(loadSound("call-get-away.mp3"));
  callSounds.push(loadSound("call-whoever-you-are.mp3"));

  responseSounds.push(loadSound("response-beetlejuice.mp3"));
  responseSounds.push(loadSound("response-dracula.mp3"));
  responseSounds.push(loadSound("response-johnny.mp3"));
  responseSounds.push(loadSound("response-survival.mp3"));
  */

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let barSpacing = 2;
let minBarHeight = 5;
let maxBarHeight = 15;

let staticX = 0;
let staticY = 0;
let staticWidth = 500;
let staticHeight = 260;

let staticTimer = 0;

function setup() {
  // Create the canvas and configure the video player
  createCanvas(640, 360);
  video.size(480, 260);
  video.hide(); // Hide default HTML video controls
  video.volume(0); // Mute the video (we’re using the separate audio track)

  // Setup audio routing: disconnect video audio from default output
  gain = new p5.Gain();
  videoAudio.disconnect(); // Prevent auto-routing
  videoAudio.connect(gain); // Route video audio through a gain node
  gain.connect(); // Connect gain node to output

  // Create FFT analyzer and feed it the processed gain output
  fft = new p5.FFT();
  fft.setInput(gain);

  // Start both the video and its original audio in a loop
  video.loop();
  videoAudio.loop();
  videoAudio.setVolume(mainAudioVolume);

  antennaBaseX = windowWidth / 2 - 50;
  antennaBaseY = windowHeight / 2 - 180;
  
  // antennaTipX = antennaBaseX;
  // antennaTipY = antennaBaseY - antennaLength;

  antenna1 = new Antenna(antennaAngle1);
  antenna2 = new Antenna(antennaAngle2);

  staticNoise = new p5.Noise();
  staticNoise.start();
  staticNoise.amp(0);

  staticEnv = new p5.Env();
  staticEnv.setADSR(0.001, 0.1, 0.2, 0.1);
  staticEnv.setRange(0.5, 0);
}

function draw() {
  video.size(480, 260);
  //to create the background and the scenery
  drawGradientSky();
  drawTable();

  //drawWallpaper();
  //drawTelly();

  //image(video, 0, 0);
  //image(video, width / 2 - 700 / 2, height / 2 - 360 / 2);
  if (tvOn) {
    image(video, width / 2 - 288, height / 2 - 180);

     drawCRTScanLines(); //to draw the CRT scan lines

    // Occasionally draw VHS glitch effects
    if (random(1) < 1 / 100) { // 1% chance per frame
      drawVHSGlitch(); //to draw the VHS glitch
    }
  }

  drawTelly(); //to draw the television
  drawPowerButton(); //to draw interactable power button
  drawChannelKnob(); //to draw interactable channel knob
  drawVolumeButton(); //to draw interactable volume button
  drawAntenna(); //to draw interactable tv antenna
  

  let spectrum = fft.analyze();
  let mids = fft.getEnergy(300, 3000);
  //console.log("Mids:", mids);

  fill(255, 0, 0);
  rect(20, height - mids, 20, mids);

  // Remove dubCooldown logic
  if (!isDubbing && mids > midsensitivity) {
    if (awaitingResponse) {
      if (queuedResponse) {
        playResponse();
      } else {
        awaitingResponse = false;
        if (!tvOn) return;
        startDub();
      }
    } else {
      if (!tvOn) return;
      startDub();
    }
  }
}

function drawCRTScanLines() {
  let x = width / 2 - 288;
  let y = height / 2 - 180;
  let w = 576;
  let h = 250;

  for (let i = y; i < y + h; i += 2) {
    let alpha = map(noise(i * 0.05, frameCount * 0.02), 0, 1, 10, 40);
    stroke(0, 0, 0, alpha);
    line(x, i, x + w, i);
  }
}


function drawVHSGlitch() {
  let x = width / 2 - 240;
  let y = height / 2 - 180;
  let w = 500;
  let h = 250;

  let glitchHeight = int(random(15, 40));
  let glitchY = int(random(y, y + h - glitchHeight));
  let offset = int(random(20, 30));

  // RED smear (left)
  tint(255, 50, 50, 180);
  copy(x, glitchY, w, glitchHeight, x - offset, glitchY, w, glitchHeight);

  // GREEN smear (right)
  tint(50, 255, 50, 180);
  copy(x, glitchY, w, glitchHeight, x + offset, glitchY + 2, w, glitchHeight);

  // BLUE smear (up+left)
  tint(50, 50, 255, 180);
  copy(x, glitchY, w, glitchHeight, x - offset / 2, glitchY - 2, w, glitchHeight);

  noTint();
}

function startDub() {
  isDubbing = true; // Prevent overlapping dubs
  videoAudio.setVolume(0); // Mute the original audio during dub

  // 30% chance for call/response
  let useCallResponse = random(1) < callfrequency;

  if (useCallResponse && callBucket.length > 0 && responseBucket.length > 0) {
    currentDub = random(callBucket);
    queuedResponse = random(responseBucket);

    currentDub.setVolume(random(minDubbedAudioVolume, maxDubbedAudioVolume));
    currentDub.play();

    currentDub.onended(() => {
      isDubbing = false;
      awaitingResponse = true;
      videoAudio.setVolume(mainAudioVolume); //  Restore video audio after call
    });
  } else if (dubBucket.length > 0) {
    let nextDub;
    do {
      nextDub = random(dubBucket);
    } while (nextDub === lastDub);

    currentDub = nextDub;
    lastDub = currentDub;

    currentDub.setVolume(random(minDubbedAudioVolume, maxDubbedAudioVolume));
    currentDub.play();
    currentDub.onended(() => stopDub());
  } else {
    // Fallback in case arrays are empty
    isDubbing = false;
    videoAudio.setVolume(mainAudioVolume);
  }
  if (!tvOn) return;
}

function stopDub() {
  isDubbing = false; // Allow future dubs
  videoAudio.setVolume(mainAudioVolume); // Bring back original audio
  currentDub = null; // Clear current dub reference
}

function playResponse() {
  if (!tvOn) {
    return;
  }
  videoAudio.setVolume(0);
  isDubbing = true;
  awaitingResponse = false;

  currentDub = queuedResponse;
  lastDub = queuedResponse;

  currentDub.setVolume(random(minDubbedAudioVolume, maxDubbedAudioVolume));
  currentDub.play();
  currentDub.onended(() => {
    videoAudio.setVolume(mainAudioVolume); // Restore video audio after response
    stopDub();
  });

  queuedResponse = null;
}

///////////////////////////////////////////////
///////////////////////////////////////////////

//https://editor.p5js.org/evebdn/sketches/O9G35ueZv
//gradient background by evebdn
function drawGradientSky() {
  createCanvas(windowWidth, windowHeight);
  let c1 = color(125, 10, 30);
  let c2 = color(80, 50, 90);

  for (let y = 0; y < height; y++) {
    let n = map(y, 0, height, 0, 1);
    let newc = lerpColor(c1, c2, n);
    stroke(newc);
    loop();
    line(0, y, width, y);
  }
}

function drawTable() {
  //table
  rectMode(CENTER);
  fill(153, 100, 35);
  noStroke();
  rect(width / 2, height / 2 + 320, 800, 455);
  fill(176, 116, 42);
  //top table
  ellipseMode(CENTER);
  noStroke();
  ellipse(width / 2, height / 2 + 90, 800, 90);
}

function drawTelly() {
  //draw static
  staticX = width / 2 - 50;
  staticY = height / 2 - 50;
  if (staticTimer > 0 || currentChannel == 0) {
    generateStatic();
    staticTimer--;
  }

  //tv screen
  stroke(86, 31, 10);
  strokeWeight(30);
  fill(36, 37, 41, 0);
  rectMode(CENTER);
  rect(width / 2 - 50, height / 2 - 50, 500, 260); //to make the tv rectangle
  rect(width / 2 - 50, height / 2 - 50, 500, 260, 60);
  if (!tvOn) {
    fill(36, 37, 41);
    rect(width / 2 - 50, height / 2 - 50, 500, 260, 60);
  }

  //tv controls
  stroke(64, 63, 60);
  strokeWeight(10);
  fill(187, 149, 112);
  rectMode(CENTER);
  rect(width / 2 + 250, height / 2 - 50, 90, 290);

  //gray outline
  stroke(64, 63, 60);
  strokeWeight(10);
  fill(64, 63, 60, 0);
  rect(width / 2 - 50, height / 2 - 50, 525, 290);

  //tv antenna
/* this was a placeholder
  noStroke(0);
  strokeWeight(0);
  fill(217, 218, 219);
  //angleMode(DEGREES);
  //rotate(45);
  rect(width / 2 - 300, height / 2 - 240, 10, 150);
*/
}

function generateStatic() {
  fill(220);
  rect(staticX, staticY, staticWidth, staticHeight);
  let vertScan = staticY - staticHeight / 2;
  let barHeight;
  while (vertScan < staticY + staticHeight / 2) {
    fill(random(100, 200));
    barHeight = random(minBarHeight, maxBarHeight);
    rect(staticX, vertScan, staticWidth, barHeight);
    vertScan += barHeight + barSpacing;
  }
}

function drawPowerButton() {
  let circleX = width / 2 + 255;
  let circleY = height / 2 - 150;
  let circleRadius = 20;

  let hoveringCheck = dist(mouseX, mouseY, circleX, circleY) < circleRadius;
  if (hoveringCheck && mouseIsPressed) {
    fill(66, 135, 245);
  } else {
    fill(107, 79, 3);
  }

  stroke(0);
  strokeWeight(2);
  ellipse(circleX, circleY, circleRadius * 2);

  tint(200, 100, 0);
  image(powerButtonIcon, circleX - 10, circleY - 10, 20, 20);
  noTint();
}

//https://editor.p5js.org/fergfluff/sketches/H1rwGFSsZ
//Complicated Knob by icm, with modifications
function drawChannelKnob() {
  let knobFriction = 0.1
  x = width / 2 + 255;
  y = height / 2 + 40;
  if (count === 0) {
    
    // Is it being dragged?
    if (dragging) {
      var dx = mouseX - x;
      var dy = mouseY - y;
      var mouseAngle = atan2(dy, dx);
      angle = mouseAngle - offsetAngle;
    }
    
    
    // Fill according to state
    if (dragging) {
      fill(66, 135, 245); //light blue
    } else {
      fill(255, 221, 244); //light pink
    }
    // Draw ellipse for knob
    push();
    translate(x, y);
    rotate(angle);
    stroke(59, 59, 59);
    strokeWeight(3);
    ellipse(0, 0, r * 2, r * 2);
    line(0, 0, r, 0);
    noStroke();
    pop();
    fill(0);

    var calcAngle = 0;
    if (angle < 0) {
      calcAngle = map(angle, -PI, 0, PI, 0);
    } else if (angle > 0) {
      calcAngle = map(angle, 0, PI, TWO_PI, PI);
    }

    let channelDegrees = int(degrees(calcAngle));
    textAlign(CENTER);
    noStroke();
    textSize(10);
    text("Channel:" + changeChannel(calcAngle), x, y + r + 20);

    var degree = int(degrees(calcAngle));

    // if (dragging && degree < 10) {
    // count == 2;
    // }
    if (count === 2) {
      var b = map(calcAngle, 0, TWO_PI, 0, 255);
      fill(b);
      rect(320, 90, 160, 180);
    }

    //to change the channel based by the channel knob
    let newChannel = changeChannel(calcAngle);
    if(millis() > channelCooldown){
      if (newChannel !== currentChannel){ //&& changeChannelCooldown()) {
        //lastSwitchTime = millis();
        switchChannel(newChannel);
        currentChannel = newChannel;
        if (tvOn) staticTimer = 10;
      }
    }
  }
}

function changeChannel(calcAngle) {
  let totalChannels = dubVideo.length;
  let degree = degrees(calcAngle);
  let slice = 360 / totalChannels;
  let channelIndex = int(degree / slice);
  //https://p5js.org/reference/p5/constrain/
  return constrain(channelIndex, 0, totalChannels - 1);
}

//function changeChannelCooldown() {
//  return millis() - lastSwitchTime > cooldownTime;
//}

//https://www.geeksforgeeks.org/p5-js-isplaying-function/
function switchChannel(channelIndex) {
  if (currentChannel >= 0 && tvOn) staticEnv.play(staticNoise);
  // dubCooldown = millis() + 1500; // REMOVE
  channelCooldown = millis() + 500;

  // Stop all dubbed audios and call/response when swapping channels
  stopAllDubsAndCalls();

  // Stop current video and audio
  if (video) {
    video.stop();
  }
  if (videoAudio && videoAudio.isPlaying()) {
    videoAudio.stop();
  }
  if (currentDub && currentDub.isPlaying()) {
    currentDub.stop();
  }

  if (channelIndex > 0) {
    //to set the new video and audio
    video = dubVideo[channelIndex];
    videoAudio = dubVideoAudio[channelIndex];
    
    video.size(480, 260);
    
    if (!tvOn) return;
    
    videoAudio.loop();
    video.volume(0);
    
    video.loop();
    video.show();
    videoAudio.disconnect();
    gain.disconnect();
    videoAudio.connect(gain);
    gain.connect();
    fft.setInput(gain);
    videoAudio.setVolume(mainAudioVolume);
    videoAudio.play();
    isDubbing = false;
    currentDub = null;
    awaitingResponse = false;
    currentChannel = channelIndex;
    for (i = 0; i < dubVideo.length; i++) {
        dubVideo[i].hide();
    }
  }
}

function drawVolumeButton() {
  rectMode(CORNER);
  let volUpXBtn = width / 2 + 245;
  let volUpYBtn = height / 2 - 70;

  let volDownXBtn = width / 2 + 245;
  let volDownYBtn = height / 2 - 30;

  let btnWidth = 20;
  let btnHeight = 30;

  let hoverUpBtn =
    mouseX > volUpXBtn &&
    mouseX < volUpXBtn + btnWidth &&
    mouseY > volUpYBtn &&
    mouseY < volUpYBtn + btnHeight;

  let hoverDownBtn =
    mouseX > volDownXBtn &&
    mouseX < volDownXBtn + btnWidth &&
    mouseY > volDownYBtn &&
    mouseY < volDownYBtn + btnHeight;

  //green volume up button
  if (hoverUpBtn && mouseIsPressed) {
    fill(66, 135, 245); // Light blue on click
  } else {
    fill(63, 97, 65);
  }
  stroke(59, 59, 59);
  strokeWeight(2.5);
  rect(volUpXBtn, volUpYBtn, btnWidth, btnHeight, 5);
  textAlign(CENTER);
  noStroke(0);
  fill(0);
  textSize(15);
  text("+", volUpXBtn + 10, volUpYBtn + 15);

  //red volume down button
  if (hoverDownBtn && mouseIsPressed) {
    fill(66, 135, 245);
  } else {
    fill(97, 63, 63);
  }
  stroke(59, 59, 59);
  strokeWeight(2.5);
  rect(volDownXBtn, volDownYBtn, btnWidth, btnHeight, 5);
  textAlign(CENTER);
  noStroke();
  fill(0);
  textSize(25);
  text("-", volDownXBtn + 10, volDownYBtn + 30);
}

// Helper to stop all dub/call/response audio
function stopAllDubsAndCalls() {
  for (let dub of dubAudios) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  for (let dub of callSounds) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  for (let dub of responseSounds) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  // Also stop queued dubs from buckets
  for (let bucketObject of audioBucket) {
    for (let arrName of ['call', 'response', 'random']) {
      for (let sound of bucketObject[arrName]) {
        if (sound.isPlaying && sound.isPlaying()) {
          sound.stop();
        }
      }
    }
  }
  if (currentDub && currentDub.isPlaying()) {
    currentDub.stop();
  }
  currentDub = null;
  queuedResponse = null;
  isDubbing = false;
  awaitingResponse = false;
}

class Antenna {
  constructor(angle) {
    this.angle = angle;
    this.antennaTipX = antennaBaseX + cos(angle) * antennaLength;
    this.antennaTipY = antennaBaseY + sin(angle) * antennaLength;
    this.antennaDragging = false;
  }

  isDragging() {
    if (dist(mouseX, mouseY, this.antennaTipX, this.antennaTipY) < antennaDiameter)
      return true;
    return false;
  }

  drawAntenna() {
    antennaBaseX = width / 2 - 50;
    antennaBaseY = height / 2 - 180;
    this.antennaTipX = antennaBaseX + cos(this.angle) * antennaLength;
    this.antennaTipY = antennaBaseY + sin(this.angle) * antennaLength;
    
    if (this.antennaDragging) {
      let dx = mouseX - antennaBaseX;
      let dy = min(-10, mouseY - antennaBaseY);
      let angle = this.angle = atan2(dy, dx);
      this.antennaTipX = antennaBaseX + cos(angle) * antennaLength;
      this.antennaTipY = antennaBaseY + sin(angle) * antennaLength;
    }

    if (isNaN(this.antennaTipX) || isNaN(this.antennaTipY)) {
      // /console.log("NaN error.")
      return;
    }
  
    // Draw line and draggable head
    stroke("silver");
    strokeWeight(3);
    line(antennaBaseX, antennaBaseY, this.antennaTipX, this.antennaTipY);
  
    fill("silver");
    noStroke();
    ellipse(this.antennaTipX, this.antennaTipY, antennaDiameter);
  }
}

function drawAntenna() {
  antenna1.drawAntenna();
  antenna2.drawAntenna();

  let angle = lerp(antenna1.angle, antenna2.angle, 0.5);
  let newBucket = floor(map(degrees(angle), -170, -10, 0, antennaBuckets));       //intially, it was -180, 0, 0.
  newBucket = constrain(newBucket, 0, antennaBuckets - 1);

  if (newBucket !== currentBucket) {
    currentBucket = newBucket;
    if (tvOn) staticTimer = 10;

    // dubCooldown = millis() + 1500; // REMOVE

    applyAntennaBucket(currentBucket);
  }

  if (abs(degrees(antenna1.angle) - degrees(antenna2.angle)) < 15) {
    if (antenna1.angle <= antenna2.angle) antenna1.angle -= radians(1);
    else antenna1.angle += radians(1);
  }

  if (abs(degrees(antenna2.angle) - degrees(antenna1.angle)) < 15) {
    if (antenna2.angle <= antenna1.angle) antenna2.angle -= radians(1);
    else antenna2.angle += radians(1);
  }
  // antennaBaseX = width / 2 - 50;
  // antennaBaseY = height / 2 - 180;
  // antennaTipX = antennaBaseX + cos(antennaAngle) * antennaLength;
  // antennaTipY = antennaBaseY + sin(antennaAngle) * antennaLength;

  // if (antennaDragging) {
  //   let dx = mouseX - antennaBaseX;
  //   let dy = min(-1, mouseY - antennaBaseY);
  //   let angle = antennaAngle = atan2(dy, dx);
  //   antennaTipX = antennaBaseX + cos(angle) * antennaLength;
  //   antennaTipY = antennaBaseY + sin(angle) * antennaLength;

  //   let newBucket = floor(map(degrees(angle), -180, 0, 0, antennaBuckets));       //intially, it was -180, 0, 0.
  //   newBucket = constrain(newBucket, 0, antennaBuckets - 1);

  //   if (newBucket !== currentBucket) {
  //     currentBucket = newBucket;
  //     if (tvOn) staticTimer = 10;

  //     // dubCooldown = millis() + 1500; // REMOVE

  //     applyAntennaBucket(currentBucket);
  //   }
  // }
  
  // // Avoid NaN
  // if (isNaN(antennaTipX) || isNaN(antennaTipY)) {
  //   console.log("NaN error.")
  //   return;
  // }

  // // Draw line and draggable head
  // stroke("silver");
  // strokeWeight(3);
  // line(antennaBaseX, antennaBaseY, antennaTipX, antennaTipY);

  // fill("silver");
  // noStroke();
  // ellipse(antennaTipX, antennaTipY, antennaDiameter);
}

function drawWallpaper() {
  image(bg, 0, 0, windowWidth, windowHeight);
}

function mousePressed() {
  let circleX = width / 2 + 255;
  let circleY = height / 2 - 150;
  let d = dist(mouseX, mouseY, circleX, circleY);

  let volUpXBtn = width / 2 + 245;
  let volUpYBtn = height / 2 - 70;

  let volDownXBtn = width / 2 + 245;
  let volDownYBtn = height / 2 - 30;

  let btnWidth = 20;
  let btnHeight = 30;

  let hoverUpBtn =
    mouseX > volUpXBtn &&
    mouseX < volUpXBtn + btnWidth &&
    mouseY > volUpYBtn &&
    mouseY < volUpYBtn + btnHeight;

  let hoverDownBtn =
    mouseX > volDownXBtn &&
    mouseX < volDownXBtn + btnWidth &&
    mouseY > volDownYBtn &&
    mouseY < volDownYBtn + btnHeight;

  // Volume Up interaction
  if(millis() > volumeCooldown){
    if (
      mouseX > volUpXBtn &&
      mouseX < volUpXBtn + btnWidth &&
      mouseY > volUpYBtn &&
      mouseY < volUpYBtn + btnHeight
    ) {
      console.log("Volume Up button clicked");
      console.log("Current volume: ", mainAudioVolume);
      console.log("Current min dub volume: ", minDubbedAudioVolume);
      console.log("Current max dub volume: ", maxDubbedAudioVolume);

      if (mainAudioVolume < 1) {
        mainAudioVolume += 0.1;
        mainAudioVolume = Math.min(1, mainAudioVolume);

        if (!isDubbing) videoAudio.setVolume(mainAudioVolume);

        minDubbedAudioVolume += 0.06;
        maxDubbedAudioVolume += 0.07;
        midsensitivity += 10;
        if (currentDub)
          currentDub.setVolume(
            random(minDubbedAudioVolume, maxDubbedAudioVolume)
          );
        minDubbedAudioVolume = Math.min(0.6, minDubbedAudioVolume);
        maxDubbedAudioVolume = Math.min(0.7, maxDubbedAudioVolume);
      }
      console.log("++++++++++++++++++++++");
      console.log("New volume: ", mainAudioVolume);
      console.log("Min dubbed volume: ", minDubbedAudioVolume);
      console.log("Max dubbed volume: ", maxDubbedAudioVolume);
      volumeCooldown = millis() + 500;
    }
  }
  // Volume Down interaction
  if(millis() > volumeCooldown){
    if (
      mouseX > volDownXBtn &&
      mouseX < volDownXBtn + btnWidth &&
      mouseY > volDownYBtn &&
      mouseY < volDownYBtn + btnHeight
    ) {
      console.log("Volume Down button clicked");
      console.log("Current volume: ", mainAudioVolume);
      console.log("Current min dub volume: ", minDubbedAudioVolume);
      console.log("Current max dub volume: ", maxDubbedAudioVolume);

      if (mainAudioVolume > 0) {
        mainAudioVolume -= 0.1;
        mainAudioVolume = Math.max(0, mainAudioVolume);

        if (!isDubbing) videoAudio.setVolume(mainAudioVolume);

        minDubbedAudioVolume -= 0.06;
        maxDubbedAudioVolume -= 0.07;
        midsensitivity -= 10;
        if (currentDub)
          currentDub.setVolume(
            random(minDubbedAudioVolume, maxDubbedAudioVolume)
          );
        minDubbedAudioVolume = Math.max(0, minDubbedAudioVolume);
        maxDubbedAudioVolume = Math.max(0, maxDubbedAudioVolume);
      }
      console.log("-----------------------------");
      console.log("New volume: ", mainAudioVolume);
      console.log("Min dubbed volume: ", minDubbedAudioVolume);
      console.log("Max dubbed volume: ", maxDubbedAudioVolume);
      volumeCooldown = millis() + 500;
      if (Math.abs(mainAudioVolume) < 0.01) {
        mainAudioVolume = 0;
      }
    }
  }

  if (d < 20) {
    if (tvOn) {
      tvOn = false;
    } else {
      tvOn = true;
    }
    if (tvOn && currentChannel != 0) {
      video.play();
      video.volume(0);
      videoAudio.play();
      //video.volume(mainAudioVolume);
      video.show();
      video.hide();
      
    } else {
      //idk i want to see if this works to stop audio from playing when off lol
      stopAllAudiosAndVideos();
    }
  }

  // Did I click on slider?
  if (dist(mouseX, mouseY, x, y) < r) {
    dragging = true;
    // If so, keep track of relative location of click to corner of rectangle
    var dx = mouseX - x;
    var dy = mouseY - y;
    offsetAngle = atan2(dy, dx) - angle;
  }

  if (antenna1 && antenna1.isDragging()) antenna1.antennaDragging = true;
  if (antenna2 && antenna2.isDragging()) antenna2.antennaDragging = true;
}

function stopAllAudiosAndVideos() {
  for (let dub of dubAudios) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  
  for (let dub of callSounds) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  
  for (let dub of responseSounds) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }

  if (video) {
    video.stop();
    video.hide();
  }

  if (videoAudio && videoAudio.isPlaying()) {
    videoAudio.stop();
  }

  if (currentDub && currentDub.isPlaying()) {
    currentDub.stop();
  }

  isDubbing = false;
  awaitingResponse = false;
  currentDub = null;
}

function mouseReleased() {
  // Stop dragging
  dragging = false;
  if (antenna1) antenna1.antennaDragging = false;
  if (antenna2) antenna2.antennaDragging = false;
}

function applyAntennaBucket(bucket) {

  for (let dub of dubAudios) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  
  for (let dub of callSounds) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }
  
  for (let dub of responseSounds) {
    if (dub.isPlaying()) {
      dub.stop();
    }
  }

  for (let bucketObject of audioBucket) {
    for (let arrName of ['call', 'response', 'random']) {
      for (let sound of bucketObject[arrName]) {
        if (sound.isPlaying() || sound.isPlaying) {
          sound.stop();
        }
      }
    }
  }

  currentDub = null;
  queuedResponse = null;
  isDubbing = false;
  awaitingResponse = false;
  
  /*if (bucket === 0) {
    //minDubbedAudioVolume = 0.3;
    //maxDubbedAudioVolume = 0.4;
    //midsensitivity = 80;
  } else if (bucket === 1) {
    //minDubbedAudioVolume = 0.5;
    //maxDubbedAudioVolume = 0.6;
    //midsensitivity = 90;
  } else if (bucket === 2) {
    //minDubbedAudioVolume = 0.6;
    //maxDubbedAudioVolume = 0.7;
    //midsensitivity = 100;
  } else {
    //minDubbedAudioVolume = 0.7;
    //maxDubbedAudioVolume = 0.8;
    //midsensitivity = 110;
  }
  */

  // Play static sound when switching antenna buckets if TV is on
  if (tvOn) {
    staticEnv.play(staticNoise);
  }

  callBucket = audioBucket[bucket].call;
  responseBucket = audioBucket[bucket].response;
  dubBucket = audioBucket[bucket].random;

  console.log("Switched to antenna bucket", bucket);
}