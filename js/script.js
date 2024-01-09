let elementVideo = document.createElement("video");
let step = null;

let canvasVideo = null;
let canvasMask = null;

let btnOpenCamera = null;
let btnCloseCamera = null;
let btnRegisterDevice = null;
let btnConfirmRegisterDevice = null;
let btnRegisterMoreDevice = null;
let btnWhiteList = null;

let current_step = 0;
let stepCount = 4;

let detectedQRCode = "";
let pendingUserConfirm = false;

let divToastDeviceId = null;
let divDeviceId = null;
let divNetworkSettings = null;

const lineColor = "#13fd17";

let toastDeviceIdConfirm = null;

const isHover  = window.matchMedia("(any-hover:hover)").matches;

document.addEventListener("DOMContentLoaded", function () {

    step = document.getElementsByClassName("step");
    prevBtn = document.getElementById("prev-btn");
    nextBtn = document.getElementById("next-btn");

    canvasVideo = document.getElementById("canvasVideo");
    canvasMask = document.getElementById("canvasMask");

    btnOpenCamera = document.getElementById("btnOpenCamera");

    if (btnOpenCamera != null) {
        btnOpenCamera.addEventListener("click", clickBtnOpenCamera, true);
    }

    btnCloseCamera = document.getElementById("btnCloseCamera");

    if (btnCloseCamera != null) {
        btnCloseCamera.addEventListener("click", clickBtnCloseCamera, true);
    }

    btnConfirmRegisterDevice = document.getElementById("btnConfirmRegisterDevice");

    if (btnConfirmRegisterDevice != null) {
        btnConfirmRegisterDevice.addEventListener("click", clickBtnConfirmRegisterDevice, true);
    }

    btnCancelRegisterDevice = document.getElementById("btnCancelRegisterDevice");

    if (btnCancelRegisterDevice != null) {
        btnCancelRegisterDevice.addEventListener("click", clickBtnCancelRegisterDevice, true);
    }

    btnRegisterDevice = document.getElementById("btnRegisterDevice");

    if (btnRegisterDevice != null) {
        btnRegisterDevice.addEventListener("click", clickBtnRegisterDevice, true);
    }

    btnRegisterMoreDevice = document.getElementById("btnRegisterMoreDevice");

    if (btnRegisterMoreDevice != null) {
        btnRegisterMoreDevice.addEventListener("click", clickBtnRegisterMoreDevice, true);
    }

    btnWhiteList = document.getElementById("btnWhiteList");

    if (btnWhiteList != null) {
        btnWhiteList.addEventListener("click", clickBtnWhiteList, true);
    }

    let toastDeviceIdConfirmElement = document.getElementById("toastDeviceIdConfirm");

    if (toastDeviceIdConfirmElement) {

        toastDeviceIdConfirm = bootstrap.Toast.getOrCreateInstance(toastDeviceIdConfirmElement);

        toastDeviceIdConfirmElement.addEventListener("hide.bs.toast", () => {
            pendingUserConfirm = false;
            detectedQRCode = "";
            divToastDeviceId.innerHTML = "";
        });

        toastDeviceIdConfirmElement.addEventListener("show.bs.toast", () => {
            pendingUserConfirm = true;
        });
    }

    divToastDeviceId = document.getElementById("divToastDeviceId");
    divDeviceId = document.getElementById("divDeviceId");


    var listProject = document.getElementById("listProject");

    if (listProject != null)
    {
        listProject.addEventListener("change", (event) => {
            if (event.target.value === "")
            {
                listProject.classList.add("is-invalid");
                listProject.classList.remove("is-valid");
            }
            else
            {
                listProject.classList.remove("is-invalid");
                listProject.classList.add("is-valid");
            }
          });
    }

    const switchNetworkSettings = document.getElementById("switchNetworkSettings");

    if (switchNetworkSettings != null)
    {
        divNetworkSettings = document.getElementById("divNetworkSettings");
        switchNetworkSettings.addEventListener("click", (event) => {
 
            if (event.target.checked == true)
            {
                divNetworkSettings.style.display = 'block';
            }
            else
            {
                divNetworkSettings.style.display = 'none';
            }
        });
    }
    
    const networkTypeToggle = document.getElementById("networkTypeToggle");

    if (networkTypeToggle != null)
    {
        divStaticIp = document.getElementById("divStaticIp");
        networkTypeToggle.addEventListener("click", (event) => {
 
            if (event.target.value == 'static')
            {
                divStaticIp.style.display = 'block';
            }
            else
            {
                divStaticIp.style.display = 'none';
            }
        });
    }

    const divQrcodeForMobile = document.getElementById("divQrcodeForMobile"); 

    if (divQrcodeForMobile != null)
    {
        if (isHover == true)
        {
            divQrcodeForMobile.style.display = 'block';
        }
        else
        {
            divQrcodeForMobile.style.display = 'none';
        }
    
    }

    stepConfig(0, -1);
});

function clickBtnOpenCamera(event) {
    current_step++;

    stepConfig(1, 0);
}

function clickBtnCloseCamera(event) {
    stepConfig(0, 1);

    cameraClose();
}

function clickBtnConfirmRegisterDevice(event)
{
    console.log(`clickBtnConfirmRegisterDevice`);
    if (toastDeviceIdConfirm.isShown())
    {
        divDeviceId.innerHTML = divToastDeviceId.innerHTML;
        toastDeviceIdConfirm.hide();
    }
    stepConfig(2, 1);
    cameraClose();
}

function clickBtnCancelRegisterDevice(event)
{
    console.log(`clickBtnCancelRegisterDevice`);
    stepConfig(1, 2);
}


function clickBtnRegisterDevice(event)
{
    console.log(`clickBtnRegisterDevice`);
    stepConfig(3, 2);
}

function clickBtnRegisterMoreDevice(event)
{
    console.log(`clickBtnRegisterMoreDevice`);
    stepConfig(1, 3);
}

function clickBtnWhiteList(event)
{
    console.log(`clickBtnWhilteList`);
    alert('This button will show Whitelist Page');
}

function showGeometry()
{
    console.log(`clickBtnWhilteList`);
    alert(`${window.innerWidth} x ${window.innerHeight} \r\n ${navigator.userAgent}`);
}

function stepConfig(step_new, step_prev) {
    console.log(`Current ${step_new} Previous ${step_prev}`);

    if (step_new >= 0 && step_prev <= stepCount) {
        step[step_new].classList.remove("d-none");
        step[step_new].classList.add("d-flex");

        if (step_prev >= 0) {
            step[step_prev].classList.remove("d-flex");
            step[step_prev].classList.add("d-none");
        }

        current_step = step_new;
    }

    if (current_step == 1) {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    width: { min: 800, ideal: 1920, max: 1920 },
                    height: { min: 600, ideal: 1080, max: 1080 },
                    facingMode: "environment",
                },
            })
            .then((videoStream) => {
                elementVideo.srcObject = videoStream;
                elementVideo.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                return elementVideo.play();
            })
            .then(() => {
                canvasVideo.height = elementVideo.videoHeight;
                canvasVideo.width = elementVideo.videoWidth;
                canvasMask.height = elementVideo.videoHeight;
                canvasMask.width = elementVideo.videoWidth;
                requestAnimationFrame(drawVideoStream);
            })
            .catch((error) => {
                console.error(error);
                // divMessage.innerHTML = `Failed to access video stream : ${error}`;
                this.hidden = false;
            });
    }
}

function cameraClose() {
    if (elementVideo != null && elementVideo.srcObject == null) {
        return;
    }

    let stream = elementVideo.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function (track) {
        track.stop();
    });

    elementVideo.srcObject = null;

    var ctx = canvasVideo.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, canvasVideo.width, canvasVideo.height);

    detectedQRCode = "";
}

function drawLine(ctx, begin, end, color) {
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawBBox(ctx, location) {
    if (location != null) {
        drawLine(ctx, location.topLeftCorner, location.topRightCorner, lineColor);
        drawLine(ctx, location.topRightCorner, location.bottomRightCorner, lineColor);
        drawLine(ctx, location.bottomRightCorner, location.bottomLeftCorner, lineColor);
        drawLine(ctx, location.bottomLeftCorner, location.topLeftCorner, lineColor);
    }
}

function scanCode(ctx, canvas) {
    var startTime = new Date();
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
    });
    if (code && code.data.length > 0) {
        drawBBox(ctx, code.location);
        checkDetectedCode(code.data);
        var endTime = new Date();
        var timeDiff = (endTime - startTime) / 1000;
        //console.log(`took ${timeDiff} sec`);
    }
}

function drawVideoStream() {
    if (elementVideo.readyState === elementVideo.HAVE_ENOUGH_DATA) {

        // var ctxMask = canvasMask.getContext("2d", { willReadFrequently: true });
        // ctxMask.globalAlpha = 0.5;
        // ctxMask.beginPath();

        // //ctxMask.clearRect(0,0, canvasMask.width, canvasMask.heigh);
        // ctxMask.rect(0,0, canvasMask.width, canvasMask.heigh)
        // //ctxMask.fillStyle = 'rgba(255, 0, 0, 0.5)';
        // ctxMask.fill();

        // var w = canvasMask.clientWidth / 2;
        // var h = canvasMask.clientHeigh / 2;

        //ctxMask.clearRect(canvasMask.width / 2 - w , canvasMask.height / 2 - h, w, h);

        var ctx = canvasVideo.getContext("2d", { willReadFrequently: true });

        ctx.drawImage(elementVideo, 0, 0, canvasVideo.width, canvasVideo.height);

        scanCode(ctx, canvasVideo);
    }
    requestAnimationFrame(drawVideoStream);
}

function checkDetectedCode(data) {

    if (detectedQRCode.length > 0 && detectedQRCode == data) {
        return;
    }

    detectedQRCode = data;

    if (pendingUserConfirm == false) {

        divToastDeviceId.innerHTML = detectedQRCode;
        toastDeviceIdConfirm.show();
    }
    else{
        console.log('skip')
    }
}
