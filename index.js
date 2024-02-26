const originXInset = 6;
const arrowWidth = 10;
const arrowInset = 6;
const borderWidth = 1;
const deviceWidth = 200;
const prePortPadding = 50;
const midiData =
    ["A4", "", "OFF", "", "C4", "OFF", "A4", "", "OFF", "", "C4", "OFF", "A4", "", "OFF", "", "C4", "OFF", "A4", "", "OFF", "", "C4", "OFF", "OFF"];
const storedData = {
    prototypes: [
        {type: "Midi Source", midiRowMilliseconds: 1000, ports: { out: [{ name: 'midi out', type: 'midi'},{ name: 'events', type: 'mod'}]}},
        {type: "Instrument", shape: "sine", ports: { in: [{name: 'midi in', type: 'midi'}],out: [{name: 'audio', type: 'audio'}]}},
        {type: "Modulation", subType: "ADSR", ports: { in: [{name: 'audio in', type: 'audio'}],  out: [{name: 'audio', type: 'audio'}]}},
        {type: "Effect", subType: "super bus compressor thing", ports: { in: [{name: 'audio in', type: 'audio'}, {name: 'mod',type: 'mod'}, {name: 'blork',type: 'midi'}, {name: 'snorg',type: 'midi'}], out: [{name: 'audio', type: 'audio'}]}},
        {type: "Output", subType: "speakers", ports: { in: [{name: 'audio in', type: 'audio'}], out: [{name: 'audio', type: 'audio'}]}}
    ],
    devices: [
        {name: "Device One", position: {top: 10, left: 100}, type: "Midi Source", midiRowMilliseconds: 1000, midi: midiData, ports: { out: [{ name: 'midi out', type: 'midi'},{ name: 'events', type: 'mod'}]}},
        {name: "Device Two", position: {top: 10, left: 450}, type: "Instrument", shape: "sine", ports: { in: [{name: 'midi in', type: 'midi', connected: 0, portName: 'midi out'}],out: [{name: 'audio', type: 'audio'}]}},
        {name: "Device Three", position: {top: 10, left: 800}, type: "Modulation", subType: "ADSR", ports: { in: [{name: 'audio in', type: 'audio', connected: 1, portName: 'audio'}],  out: [{name: 'audio', type: 'audio'}]}},
        {name: "Device Four", position: {top: 200, left: 450}, type: "Effect", subType: "super bus compressor thing", ports: { in: [{name: 'audio in', type: 'audio', connected: 2, portName: 'audio'}, {name: 'mod',type: 'mod', connected: 0, portName: 'events'}, {name: 'blork',type: 'midi'}, {name: 'snorg',type: 'midi'}], out: [{name: 'audio', type: 'audio'}]}},
        {name: "Device Five", position: {top: 200, left: 800}, type: "Effect", subType: "super bus compressor thing", ports: { in: [{name: 'audio in', type: 'audio', connected: 3, portName: 'audio'}], out: [{name: 'audio', type: 'audio'},]}},
        {name: "Device Six", position: {top: 200, left: 1150}, type: "Effect", subType: "super bus compressor thing", ports: { in: [{name: 'audio in', type: 'audio', connected: 4, portName: 'audio'},{ name: 'events', type: 'mod'}], out: [{name: 'audio', type: 'audio'}]}},
        {name: "Device Seven", position: {top: 400, left: 100}, type: "Effect", subType: "output", ports: { in: [{name: 'audio in', type: 'audio', connected: 5, portName: 'audio'}], out: [{name: 'audio', type: 'audio'}]}}
    ]
};

const app = new Vue({
    el: '#app',
    data: {
        devices: storedData.devices,
        prototypes: storedData.prototypes
    }
});


