let ip_address = '';
let ipv6Address = '';
function updateFilterInput() {
    const filterType = document.getElementById('filter_type').value;

    const defaultFilterValueContainer = document.getElementById('filter_value_container');
    const ipv4AddressContainer = document.getElementById('ipv4_address_container');
    const specificPortContainer = document.getElementById('specfic_port_container');
    const ipv6AddressContainer = document.getElementById('ipv6_address_container');

    if (filterType === 'host') {
        defaultFilterValueContainer.style.display = 'none';
        ipv4AddressContainer.style.display = 'block';
        specificPortContainer.style.display = 'none';
        ipv6AddressContainer.style.display = 'none';
    }
    else if (filterType === 'hostIPv6') {
        defaultFilterValueContainer.style.display = 'none';
        ipv4AddressContainer.style.display = 'none';
        specificPortContainer.style.display = 'none';
        ipv6AddressContainer.style.display = 'block';
    }
    else if (filterType === 'port') {
        defaultFilterValueContainer.style.display = 'none';
        specificPortContainer.style.display = 'block';
        ipv4AddressContainer.style.display = 'none';
        ipv6AddressContainer.style.display = 'none';
    }
    else {
        defaultFilterValueContainer.style.display = 'block';
        ipv4AddressContainer.style.display = 'none';
        specificPortContainer.style.display = 'none';
        ipv6AddressContainer.style.display = 'none';
    }
}

function validateOctet(value) {
    const octet = parseInt(value, 10);
    return !isNaN(octet) && octet >= 0 && octet <= 255;
}

function autoPrintIPv4() {
    const octet1 = document.getElementById('octet1').value;
    const octet2 = document.getElementById('octet2').value;
    const octet3 = document.getElementById('octet3').value;
    const octet4 = document.getElementById('octet4').value;

    const isValid =
        validateOctet(octet1) &&
        validateOctet(octet2) &&
        validateOctet(octet3) &&
        validateOctet(octet4);

    if (isValid && octet1 && octet2 && octet3 && octet4) {
        ip_address = `${octet1}.${octet2}.${octet3}.${octet4}`;
        document.getElementById('ipv4_error_message').style.display = 'none';
    } else {
        document.getElementById('ipv4_error_message').style.display = 'block';
    }
}

function validatePacketCount() {
    const packetCountInput = document.getElementById('packet_count');
    const errorMessage = document.getElementById('packet_count_error_message');

    const value = packetCountInput.value;
    if (value === '' || Number.isInteger(Number(value))) {
        // Valid input (empty or integer)
        errorMessage.style.display = 'none';
    } else {
        // Invalid input
        errorMessage.style.display = 'block';
    }
}

function validateDuration() {
    const durationInput = document.getElementById('duration');
    const errorMessage = document.getElementById('duration_error_message');

    const value = durationInput.value;
    if (value === '' || Number.isInteger(Number(value))) {
        // Valid input (empty or integer)
        errorMessage.style.display = 'none';
    }
    else {
        // Invalid input
        errorMessage.style.display = 'block';
    }
}

function validateBufferSize() {
    const bufferSizeInput = document.getElementById('buffer_size');
    const errorMessage = document.getElementById('buffer_size_error_message');

    const value = bufferSizeInput.value;
    if (value === '' || Number.isInteger(Number(value))) {
        // Valid input (empty or integer)
        errorMessage.style.display = 'none';
    }
    else {
        // Invalid input
        errorMessage.style.display = 'block';
    }
}

function validateCaptureSlicing() {
    const captureSlicingInput = document.getElementById('capture_slicing');
    const errorMessage = document.getElementById('capture_slicing_error_message');

    const value = captureSlicingInput.value;
    if (value === '' || Number.isInteger(Number(value))) {
        // Valid input (empty or integer)
        errorMessage.style.display = 'none';
    }
    else {
        // Invalid input
        errorMessage.style.display = 'block';
    }
}

function validateSpecificPort() {
    const specificPortInput = document.getElementById('specific_port');
    const errorMessage = document.getElementById('specific_port_error_message');

    const value = specificPortInput.value;

    if (value === '' || Number.isInteger(Number(value)) && value >= 0 && value <= 65535) {
        // Valid input (empty or integer)
        errorMessage.style.display = 'none';
    }
    else {
        // Invalid input
        errorMessage.style.display = 'block';
    }
}

function autoPrintIPv6() {
    const hextets = [];
    for (let i = 1; i <= 8; i++) {
        hextets.push(document.getElementById(`hextet${i}`).value);
    }

    const isValid = hextets.every(validateHextet);

    if (isValid && hextets.every((hextet) => hextet.length > 0)) {
        ipv6Address = hextets.join(':');
        document.getElementById('ipv6_error_message').style.display = 'none';
    } else {
        document.getElementById('ipv6_error_message').style.display = 'block';
    }
}

function validateHextet(hextet) {
    const hexRegex = /^[0-9a-fA-F]{1,4}$/;
    return hexRegex.test(hextet);
}

function updateTsharkCommand() {
    let interfaceValue = document.getElementById('interface').value;
    let filterType = document.getElementById('filter_type').value;
    let filterValue = document.getElementById('filter_value').value;
    let packetCount = document.getElementById('packet_count').value;
    let duration = document.getElementById('duration').value;
    let outputFile = document.getElementById('output_file').value;
    let outputFormat = document.getElementById('output_format').value;
    let verboseMode = document.getElementById('verbose_mode').value;
    let displayInterfaces = document.getElementById('display_interfaces').checked;
    let captureSlicing = document.getElementById('capture_slicing').value;
    let useRingBuffer = document.getElementById('use_ring_buffer').checked;
    let bufferSize = document.getElementById('buffer_size').value;
    let specificPort = document.getElementById('specific_port').value;

    // Build the tshark command
    let tsharkCommand = 'tshark';

    // Add interface
    if (interfaceValue !== '') {
        tsharkCommand += ' -i ' + interfaceValue;
    }

    // Add filter (host, port, or protocol)
    if (filterType !== '' || ip_address !== '' || filterValue !== '' || ipv6Address !== '') {
        switch (filterType) {
            case 'host':
                tsharkCommand += ' host ' + ip_address;
                break;
            case 'hostIPv6':
                tsharkCommand += ' host ' + ipv6Address;
                break;
            case 'port':
                tsharkCommand += filterValue;
                break;
            case 'protocol':
                tsharkCommand += ' ' + '-f "' + filterValue + '"';
                break;
        }
    }

    // Add specific port capture
    if (specificPort !== '') {
        tsharkCommand += ' port ' + specificPort;
    }

    // Add packet count
    if (packetCount !== '') {
        tsharkCommand += ' -c ' + packetCount;
    }

    // Add duration
    if (duration !== '') {
        tsharkCommand += ' -a duration:' + duration;
    }

    // Add capture slicing (slice packet size)
    if (captureSlicing !== '') {
        tsharkCommand += ' -s ' + captureSlicing;
    }

    // Use verbose mode
    if (verboseMode !== '') {
        tsharkCommand += ' -V ' + verboseMode;
    }

    // Automatically append the correct file extension to the output filename
    if (outputFile !== '' && outputFormat !== '') {
        switch (outputFormat) {
            case 'pcap':
                tsharkCommand += ' -w ' + outputFile + '.pcap';
                break;
            case 'json':
                tsharkCommand += ' -T json > ' + outputFile + '.json';
                break;
            case 'csv':
                tsharkCommand += ' -T fields -E separator=, > ' + outputFile + '.csv';
                break;
            case 'xml':
                tsharkCommand += ' -T pdml > ' + outputFile + '.xml';
                break;
        }
    }

    // Display list of interfaces
    if (displayInterfaces) {
        tsharkCommand += ' -D';
    }

    // Use ring buffer if selected
    if (useRingBuffer) {
        tsharkCommand += ' -b';
        if (bufferSize !== '') {
            tsharkCommand += ' filesize:' + bufferSize;
        }
    }

    // Collect selected fields from checklist
    let selectedFields = [];
    const checkboxes = document.querySelectorAll('.dropdown-checklist-content input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedFields.push(checkbox.value);
        }
    });

    // Add fields to tshark command if any are selected
    if (selectedFields.length > 0) {
        tsharkCommand += ' -T fields -e ' + selectedFields.join(' -e ');
    }

    // Display the generated command
    // if theres error message then dont display the command
    if (document.getElementById('ipv4_error_message').style.display === 'none' && document.getElementById('packet_count_error_message').style.display === 'none' && document.getElementById('duration_error_message').style.display === 'none' && document.getElementById('buffer_size_error_message').style.display === 'none' && document.getElementById('capture_slicing_error_message').style.display === 'none' && document.getElementById('specific_port_error_message').style.display === 'none') {
        document.getElementById('tsharkCommand').innerText = tsharkCommand;
    }
    else {
        document.getElementById('tsharkCommand').innerText = '';
    }
    //document.getElementById('tsharkCommand').innerText = tsharkCommand;
}

function copyCommand() {
    // Copy command logic here
    const copyText = document.getElementById("tsharkCommand").innerText;
    navigator.clipboard.writeText(copyText).then(() => {
        // Show the confirmation pop-up
        const confirmation = document.getElementById("copy-confirmation");
        confirmation.style.display = 'block';
        confirmation.style.opacity = '1';

        // Hide the confirmation pop-up after 1 second
        setTimeout(() => {
            confirmation.style.opacity = '0';
            setTimeout(() => {
                confirmation.style.display = 'none';
            }, 500); // Match this duration with the CSS transition duration
        }, 1000);
    });
}


function showInfo(inputType, messageBoxId) {
    const messageBox = document.getElementById(messageBoxId);
    const messageContent = document.getElementById(messageBoxId).querySelector('p');
    let message = '';

    // Set messages based on the input type
    switch (inputType) {
        case 'interface':
            message = "Select the network interface you want to capture traffic from (e.g., eth0 for Ethernet, wlan0 for Wi-Fi).";
            break;
        case 'filter_type':
            message = "Choose a filter type to narrow down the captured traffic, such as by Host IP, Port Number, or Protocol.";
            break;
        case 'output_format':
            message = "Select the format in which you want to save the captured data (e.g., PCAP, JSON, CSV, XML).";
            break;
        case 'capture_slicing':
            message = "Specify the maximum packet size to capture; this can help reduce the amount of data processed.";
            break;
        case 'output_file':
            message = "Enter the filename for the output file where the captured data will be stored.";
            break;
        case 'packet_count':
            message = "Specify the number of packets to capture before stopping the capture process.";
            break;
        case 'duration':
            message = "Set the duration for capturing packets before stopping the capture process.";
            break;
        case 'buffer_size':
            message = "Specify the size of the ring buffer file for capturing packets.";
            break;
        case 'specific_port':
            message = "Enter the specific port number you want to capture traffic for.";
            break;
        case 'verbose_mode':
            message = "Enable verbose mode to display detailed packet information in the output.";
            break;
        case 'display_interfaces':
            message = "Check this box to display a list of available network interfaces on the system.";
            break;
        case 'use_ring_buffer':
            message = "Enable ring buffer mode to store captured packets in a circular buffer file.";
            break;
        case 'field_selection':
            message = "Select the fields you want to display in the output data (e.g., Source IP, Destination IP, Protocol).";
            break;
        default:
            message = "Input the fields based on the field selected";
    }

    // Update the message content and display the message box
    messageContent.innerHTML = message;
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

function closeMessage(messageBoxId) {
    const messageBox = document.getElementById(messageBoxId);
    messageBox.style.display = 'none';
}

function resetForm() {
    document.getElementById('interface').value = '';
    document.getElementById('filter_type').value = '';
    document.getElementById('filter_value').value = '';
    document.getElementById('packet_count').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('output_file').value = '';
    document.getElementById('output_format').value = '';
    document.getElementById('verbose_mode').value = '';
    document.getElementById('display_interfaces').checked = false;
    document.getElementById('capture_slicing').value = '';
    document.getElementById('use_ring_buffer').checked = false;
    document.getElementById('buffer_size').value = '';
    document.getElementById('specific_port').value = '';
    document.getElementById('tsharkCommand').innerText = 'tshark';
    document.getElementById('ipv4_error_message').style.display = 'none';
    document.getElementById('packet_count_error_message').style.display = 'none';
    document.getElementById('duration_error_message').style.display = 'none';
    document.getElementById('buffer_size_error_message').style.display = 'none';
    document.getElementById('capture_slicing_error_message').style.display = 'none';
    document.getElementById('specific_port_error_message').style.display = 'none';
    document.getElementById('ipv6_address_container').style.display = 'none';
    document.getElementById('ipv4_address_container').style.display = 'none';
    document.getElementById('ipv6_error_message').style.display = 'none';
    document.getElementById('specfic_port_container').style.display = 'none';
    document.getElementById('filter_value_container').style.display = 'block';
    document.getElementById('dropdown-checklist').style.display = 'none';
    ip_address = '';
    ipv6Address = '';
}

window.onload = function () {
    document.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('input', updateTsharkCommand);
    });

    // Trigger update on field selection changes
    const fieldCheckboxes = document.querySelectorAll('.dropdown-checklist-content input[type="checkbox"]');
    fieldCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', updateTsharkCommand);
    });

    document.getElementById('filter_type').addEventListener('change', updateFilterInput); // Update filter type input on change
};