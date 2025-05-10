const videoPlayer = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const openFile = document.getElementById('openFile');
// const {ipcRenderer} = require('electron');
const progressBar = document.getElementById('progressBar');
const backward = document.getElementById('rewindBtn');
const forward = document.getElementById('forward');

//标题栏按钮事件
// document.getElementById('minButton').addEventListener('click', () => {
//     ipcRenderer.send('minimize-window');
// });
// document.getElementById('maxButton').addEventListener('click', () => {
//     ipcRenderer.send('maximize-window');
// });
// document.getElementById('closeButton').addEventListener('click', () => {
//     ipcRenderer.send('close-window')
// });
document.getElementById('minButton').addEventListener('click', () => {
    window.api.minimizeWindow();
});
document.getElementById('maxButton').addEventListener('click', () => {
    window.api.maximizeWindow();
});
document.getElementById('closeButton').addEventListener('click', () => {
    window.api.closeWindow();
});


//控件显示事件
document.addEventListener('mousemove', function(event) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const mouseY = event.clientY;
    const mouseX = event.clientX;

    if (mouseY > windowHeight * 0.85 && mouseY < windowHeight) {
        document.getElementById('PlayCTRL').classList.add('PlayCTRL-open');
        console.log(event, "检测了鼠标")
    } else {
        document.getElementById('PlayCTRL').classList.remove('PlayCTRL-open');
    }
    if (mouseX < windowWidth *0.15 && mouseX > 0) {
        document.getElementById('listCTRL').classList.add('listCTRL-open');
    } else {
        document.getElementById('listCTRL').classList.remove('listCTRL-open');
    }
    if (document.fullscreenElement) {
        if (mouseY < windowHeight * 0.05) {
            document.getElementById('titlebar').classList.remove('header-back')
        } else {
            document.getElementById('titlebar').classList.add('header-back');
        }
    }
});


//视频操作
openFile.addEventListener('click', openVideo);
playBtn.addEventListener('click', () => {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.classList.remove('paused');
        playBtn.classList.add('playing');
    }else {
        playBtn.classList.remove('playing');
        playBtn.classList.add('paused');
        videoPlayer.pause();
    }
})
videoPlayer.addEventListener('timeupdate', () => {
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressBar.value = progress;
})
progressBar.addEventListener('input', () => {
    const newTime = (progressBar.value / 100) * videoPlayer.duration;
    videoPlayer.currentTime = newTime;
})
async function openVideo() {
    try {
        const [fileHandle] = await window.showOpenFilePicker( {
            types: [{
                description: 'Video Files',
                accept: {'video/*': ['.mp4', '.ts', '.wav', '.webm']}
            }]
        });
        const file = await fileHandle.getFile();
        const videoTitle = document.getElementById('videoTitle');

        videoTitle.textContent = file.name.split('.')[0];

        const videoURL = URL.createObjectURL(file);
        videoPlayer.src = videoURL;
        videoPlayer.play();
        playBtn.classList.remove('paused');
        playBtn.classList.add('playing');

    } catch (error) {
        console.error('error opening video file', error);
    }
    
}
backward.addEventListener('click', () => {
    const newTime = videoPlayer.currentTime - videoPlayer.duration * 0.01;
    videoPlayer.currentTime = newTime;
})
forward.addEventListener('click', () => {
    const newTime = videoPlayer.currentTime + videoPlayer.duration * 0.01;
    videoPlayer.currentTime = newTime;
})
document.getElementById('fullScreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.getElementById('titlebar').classList.add('header-back');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.getElementById('titlebar').classList.remove('header-back');
        }
    }
})



