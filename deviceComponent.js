let connectingSource;
Vue.component('device', {
    props: ['device', 'index'],
    template:
        `<div v-bind:data-deviceid="index" v-bind:id="'device' + index" class="device draggable-target"
             v-bind:class="{ 'device-midi': device.type == 'Midi Source'}"
             v-bind:style="{ top: device.position.top + 'px', left: device.position.left + 'px' }">
            <div v-on:mousedown="startDragging" class="device-content device-name draggable">{{device.name}}</div>
            <div class="device-body">
                <div class="device-ports device-ports-in">
                    <div v-for="port in device.ports.in" class="device-port device-port-in"  
                    v-on:mouseover="selectConnectingDestination($event,index,port.name)" 
                    v-on:mouseout="stopConnectingDestination($event)" 
                    v-bind:class="'device-port-' + port.type" >
                        <span>{{port.name}}</span>
                        <svg class="pane"><circle r="6" class="port-circle port-circle-in" cy="10" cx="10"></circle></svg>
                    </div>
                </div>
            <div class="device-details-container">
            <div class="device-content">
                <div class="device-details">
                    <div class="device-details-row"><span class="device-type-label device-content-item">Type: </span><span
                            class="device-type-value device-content-item">{{device.type}}</span></div>
                    <div v-if="device.subType" class="device-content device-details-row">
                        <span class="device-type-label device-content-item">FX type: </span><span
                            class="device-type-value device-content-item">{{device.subType}}</span>
                    </div>
                </div>
            </div>
            <div v-if="device.type == 'Midi Source'" class="device-content">
                <span class="device-type-label device-content-item">ms per row: </span><span
                    class="device-type-value device-content-item">{{device.midiRowMilliseconds}}</span>
                <div class="device-midi-data">
                    <div class="device-midi-table">
                        <div v-for="(row, index) in device.midi" class="midi-row">
                            <span class="midi-cell">{{index}}:</span>
                            <span class="midi-cell midi-value">&nbsp;{{row}}</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
                <div class="device-ports device-ports-out">
                    <div v-for="connection in device.ports.out" class="device-port device-port-out" v-bind:class="'device-port-' + connection.type" 
                    v-on:mousedown="startConnecting($event,index,connection.type,connection.name)">
                        <span>{{connection.name}}</span>
                        <svg class="pane"><circle r="5" class="port-circle port-circle-out" cy="10" cx="10"></circle></svg>
                    </div>
                </div>
            </div>
        </div>`,
    methods: {
        startDragging: function (e) {
            e.preventDefault();
            let dragging = true;
            let curX = e.clientX;
            let curY = e.clientY;
            const draggableTarget = $(e.currentTarget).parent(".draggable-target");
            document.onmousemove = function (e) {
                if (dragging) {
                    e.preventDefault();
                    const offsetX = e.clientX - curX;
                    const offsetY = e.clientY - curY;
                    curX = e.clientX;
                    curY = e.clientY;
                    // set the element's new position:
                    $(draggableTarget).each(function (index) {
                        const device = getDeviceById(this.dataset.deviceid);
                        const top = device.position.top + offsetY;
                        device.position.top = (top >= 0 ? top: 0);
                        const left = device.position.left + offsetX;
                        device.position.left = (left >= 0 ? left: 0);
                    });
                }
            };
            document.onmouseup = function (e) {
                dragging = false;
                e.preventDefault();
                document.onmousemove = null;
            };
        },
        stopConnecting: function (e) {
            e.preventDefault();
            document.onmousemove = null;
            document.onmouseup = null;
            const connectingPane = document.querySelector("#connecting-pane");
            connectingPane.style.width =  0 ;
            connectingPane.style.height =  0 ;
            connectingPane.style.top =  0 ;
            connectingPane.style.left =  0 ;
            const connectingLine = document.querySelector("#connecting-line");
            connectingLine.setAttribute("x1", 0);
            connectingLine.setAttribute("y1", 0);
            connectingLine.setAttribute("x2", 0);
            connectingLine.setAttribute("y2", 0);
        },
        startConnecting: function (e,index,type,portName) {
            e.preventDefault();
            connectingSource = {origin: index, type: type, portName: portName};
            const connectingLine = document.querySelector("#connecting-line");
            const devicePort = e.currentTarget.closest(".device-port");
            const portPosition = getPosition(devicePort);
            const connectingPane = document.querySelector("#connecting-pane");
            const startX = portPosition.x + 10;
            connectingPane.style.left = startX;
            const startY = portPosition.y + 25;
            connectingPane.style.top = startY;
            connectingLine.setAttribute("x1", 0);
            connectingLine.setAttribute("y1", 0);
            connectingLine.setAttribute("x2", 0);
            connectingLine.setAttribute("y2", 0);
            document.onmousemove = function (e) {
                const lineLengthX = e.clientX  - startX;
                const lineLengthY = e.clientY - startY;

                const width = Math.abs(lineLengthX);
                connectingPane.style.width =  width ;
                const height = Math.abs(lineLengthY);
                connectingPane.style.height = height;

                if (lineLengthX < 0) {
                    connectingPane.style.left = (startX - width) + "px";
                    connectingLine.setAttribute("x1", width);
                    connectingLine.setAttribute("x2", 0);
                } else {
                    connectingPane.style.left = startX + "px";
                    connectingLine.setAttribute("x1", 0);
                    connectingLine.setAttribute("x2", lineLengthX);
                }

                if (lineLengthY < 0) {
                    connectingPane.style.top = (startY - height) + "px";
                    connectingLine.setAttribute("y1", height);
                    connectingLine.setAttribute("y2", 0);
                } else {
                    connectingPane.style.top = startY + "px";
                    connectingLine.setAttribute("y1", 0);
                    connectingLine.setAttribute("y2", lineLengthY);
                }
            }
            $(document).on("mouseup",  this.stopConnecting);
        },
        stopConnectingDestination: function (e) {
            e.preventDefault();
            $(document).off("mouseup.createConnection");
        },
        selectConnectingDestination: function (e,index,name) {
            e.preventDefault();
            if (connectingSource) {
                $(document).one("mouseup.createConnection", this.createConnection(index, name));
            }
        },
        createConnection: function (destination,name) {
            return function(e) {
                e.preventDefault();
                const device = storedData.devices[destination];
                const destinationPortNumber = getDestinationPortNumber(device,name);
                const type = device.ports.in[destinationPortNumber].type;
                if (connectingSource.origin >= 0 && connectingSource.type === type) {
                    Vue.set(device.ports.in[destinationPortNumber], 'connected', connectingSource.origin);
                    Vue.set(device.ports.in[destinationPortNumber], 'portName', connectingSource.portName);
                    connectingSource = null;
                }
            }
        }
    }
});

function getDeviceById(id) {
    return storedData.devices[id];
}

function getPosition(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
        if (el.tagName === "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            const yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

