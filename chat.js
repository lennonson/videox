async function sendMessage() {
    const userMessage = document.getElementById('sendBox').value;

    if (userMessage.trim() === "") {
        alert("请输入信息");
        return;
    }

    document.getElementById('sendBox').value = '';
    const receiveBox = document.getElementById('receiveBox');
    receiveBox.value += "你: " + userMessage + '\n';

    try {
        const { reply } = await window.api.sendMessage(userMessage);
        receiveBox.value += "人工智障说: " + reply + '\n';
    } catch (error) {
        receiveBox.value += "错误: " + error + '\n';
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);