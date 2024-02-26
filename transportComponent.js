Vue.component('transport', {
    template:
        `
    <div id="transport" class="button-bar">
        <div class="transport-button-container">
            <button id="play-button" v-on:click="togglePlay('play-button','pause-button')">
                <svg>
                    <polygon class="button-shape" points="0,0 25,15 0,30"/>
                </svg>
            </button>
            <button id="pause-button" v-on:click="togglePlay('pause-button','play-button')">
                <svg>
                    <rect x="2" class="button-shape pause-button-shape"/>
                    <rect x="20" class="button-shape pause-button-shape"/>
                </svg>
            </button>
        </div>
    </div>`,
    methods: {
        togglePlay: function (currentElement,targetElement) {
            const target = document.getElementById(targetElement);
            target.style.display = 'block';
            target.focus();
            document.getElementById(currentElement).style.display = 'none';
            if (!playing) {
                startPlaying();
            } else {
                stopPlaying();
            }
        }
    }
});

let playing = false;
let oscillator;
let audioCtx;

function startPlaying() {
    audioCtx = new window.AudioContext;
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    playing = true;
}

function stopPlaying() {
    oscillator.stop();
    playing = false;
}