const distanceBetweenPorts = 28;
Vue.component('connectors', {
    props: ['inconnections', 'devindex'],
    template:
        `<g>
        <g :id="'connector'+devindex+'-'+index" v-for="(port,index) in inconnections" v-if="port.connected || port.connected == 0" >
            <path class="connector" v-bind:class="'connector-' + port.type"
                  v-bind:data-origin="port.connected" v-bind:data-port-name="port.portName" 
                  v-bind:data-destination="devindex"
                  v-bind:d="connectorCoords(port.connected,devindex,port.portName,port.name)" fill="none"
                  v-on:click="animateDash($event,devindex+'-'+index)"/>
            <polygon class="connector-shape arrow" v-bind:class="'arrow-' + port.type"
                     v-bind:data-destination="devindex"
                     v-bind:points="connectorArrowPoints(devindex,port.name)"
                     v-on:click="animateDash($event,devindex+'-'+index)"/>
        </g>
    </g>`,
    methods: {
        connectorArrowPoints: connectorArrowPoints,
        connectorCoords: function (origin, destination, originPortName, destinationPortName) {
            const originDevice = getDeviceById(origin);
            const destinationDevice = getDeviceById(destination);
            const originPortNumber = getOriginPortNumber(originDevice,originPortName);
            const destinationPortNumber = getDestinationPortNumber(destinationDevice,destinationPortName);
            return calcCoordinatesForConnector(lineOriginX(originDevice), calcLineY(originDevice,originPortNumber), lineDestinationX(destinationDevice), calcLineY(destinationDevice,destinationPortNumber));
        },
        animateDash: animateDash
    }
});

function getOriginPortNumber(originDevice,originPortName) {
    return originDevice.ports.out.findIndex(function (value) {
        return value.name === originPortName;
    });
}

function getDestinationPortNumber(destinationDevice,destinationPortName) {
    const destinationInPorts = destinationDevice.ports.in;
    return destinationInPorts.findIndex(function (value) {
        return value.name === destinationPortName;
    });
}

function animateDash(sourceEvent, index) {
    sourceEvent.preventDefault();
    const connector = document.querySelector(`#connector${index} path`);
    connector.classList.add("animate-stroke");
    const eventName = "click.un-animate-stroke-"+index;
    $(document).on(eventName, function (e) {
        if (e.target !== sourceEvent.target) {
            connector.classList.remove("animate-stroke");
            $(document).off(eventName);
        }
    })
}

function totalBorderWidth() {
    return borderWidth * 2;
}

function deviceLeft(device) {
    return device.position.left;
}

function deviceTop(device) {
    return device.position.top;
}

function connectorArrowPoints(destIndex,portName) {
    const device = getDeviceById(destIndex);
    const x = deviceLeft(device) - arrowInset;
    const y = calcLineY(device,getDestinationPortNumber(device,portName));
    return `${x - arrowWidth},${y - 7} ${x},${y} ${x - arrowWidth},${y + 7}`;
}

function calcLineY(device,portNumber) {
    return deviceTop(device) + prePortPadding  + (distanceBetweenPorts * portNumber);
}

function lineDestinationX(device) {
    return deviceLeft(device) - arrowWidth - arrowInset;
}

function lineOriginX(device) {
    return deviceLeft(device) + deviceWidth + totalBorderWidth() + originXInset;
}

function calcCoordinatesForConnector(originX, originY, destinationX, destinationY) {
    const diffX = destinationX - originX;
    const diffY = destinationY - originY;
    const middleX = originX + diffX / 2;
    const middleY = originY + diffY / 2;
    const quarterDiffX = diffX / 4;
    const quarterDiffY = diffY / 4;
    const scaleFactor = diffX > -500 ? Math.abs(diffX) / 500 : 1;

    const controlPointYDistance = quarterDiffY * scaleFactor;
    const originControlY = diffX > 0 ? originY : originY + controlPointYDistance;
    const destinationControlY = diffX > 0 ? destinationY : destinationY - controlPointYDistance;

    const controlPointXDistance = diffX < 0 ? getScaledDiffXFraction(quarterDiffX, scaleFactor) : Math.max(quarterDiffX, 20);
    const originControlX = originX + controlPointXDistance;
    const destinationControlX = destinationX - controlPointXDistance;

    const coords = `M ${originX},${originY} Q ${originControlX},${originControlY} ${middleX},${middleY} Q ${destinationControlX},${destinationControlY} ${destinationX},${destinationY}`;
    // console.log(coords);
    return coords;

    function getScaledDiffXFraction(quarterDiffX, scaleFactor) {
        const toScaleDiffXFraction = Math.max(quarterDiffX, 100);
        return Math.max(toScaleDiffXFraction * scaleFactor, 20);
    }
}
