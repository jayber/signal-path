Vue.component('action-buttons', {
    props: ['prototypes'],
    template:`
    <div id="footer" class="button-bar">
        <div class="transport-button-container">
            <ul id="create-menu">
                <li v-for="(device,index) in prototypes" @click="createDevice($event,index)">
                    {{ menuEntry(device) }}
                </li>
            </ul>
            <button id="add-device-button"  @click="deviceMenu($event)">
                <svg>
                    <polygon class="button-shape" points="13,0 17,0 17,13 30,13 30,17 17,17 17,30 13,30 13,17 0,17 0,13 13,13 "/>
                </svg>
            </button>
            
        </div>
    </div>`,
    methods: {
        menuEntry: function (device) {
            return device.type + (device.hasOwnProperty('subType') ? ' - ' + device.subType : '');
        },
        deviceMenu: function (sourceEvent) {
            document.getElementById("create-menu").style.display = 'block';
            const eventName = "click.showCreateMenu";
            $(document).on(eventName, function (e) {
                if (e.target !== sourceEvent.target) {
                    document.getElementById("create-menu").style.display = 'none';
                    $(document).off(eventName);
                }
            });
        },
        createDevice: function (sourceEvent, index) {
            sourceEvent.preventDefault();
            const item = storedData.prototypes[index];
            const newItem = copyValues(item);
            newItem.name = makeName();
            newItem.position = {top: 400, left: 400};
            
            storedData.devices.push(newItem);
            document.getElementById("create-menu").style.display = 'none';

        }
    }
});

function makeName() {
    return "Device " + (storedData.devices.length + 1);
}

function copyValues(source) {
    return JSON.parse(JSON.stringify(source));
}