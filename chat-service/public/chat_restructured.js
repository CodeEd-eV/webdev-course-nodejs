
var textBox = document.getElementById('textBox');
var messageContainer = document.getElementById('messageContainer');
var sendButton = document.getElementById('sendBtn');
var sideBar = document.getElementById("sideBar");
var chatInfo = document.getElementById("chatInfo");


class Chat {
    constructor(contact, messages) {
        this.contact = contact;
        this.messages = messages;
    }
}

function generateDefaultMessages() {
    var messages = [];
    for (var i = 0; i < 5; i++) {
        var msgLeft = {
            sender: "left",
            text: "Hi, ich bin eine Nachricht"
        };
        messages.push(msgLeft);
        var msgRight = {
            sender: "right",
            text: "Hi, ich bin eine Antwort"
        };
        messages.push(msgRight);
    }
    return messages;
}

function fillChatList(chatList) {
    var contactList = ['Max Mustermann', 'Peter Pan', 'Godric Gryffindor', 'Gundula Gause', 'Spongebob Schwammkopf',
        'Bilbo Beutlin', 'Albert Ainstein', 'Billy Boy', 'Mamma Mia', 'Turk Turkleton'];
    for (var i = 0; i < 10; i++) {
        var contact = contactList[i];
        var messages = generateDefaultMessages();
        var newChat = new Chat(contact, messages);
        chatList.push(newChat);
    }
}

function fillSideBar(chatList) {
    for (var i = 0; i < chatList.length; i++) {
        var chat = chatList[i];

        var header = document.createElement('h1');
        header.innerHTML = chat.contact;

        var lastMessage = document.createElement('p');
        lastMessage.innerHTML = chat.messages[chat.messages.length - 1].text;

        var content = document.createElement('div');
        content.className = "content";
        content.appendChild(header);
        content.appendChild(lastMessage);

        var htmlChat = document.createElement('div');
        htmlChat.className = "chat";
        htmlChat.id = i;
        htmlChat.appendChild(content);

        sideBar.appendChild(htmlChat);
    }
}

function fillChatContainer(chat) {
    chatInfo.children[0].children[0].innerHTML = chat.contact;
    chatInfo.children[0].children[1].innerHTML = 'Vor 38 Minuten';

    for (var i = 0; i < chat.messages.length; i++) {
        var messageObject = chat.messages[i];
        var msg = document.createElement('div');

        if (messageObject.sender === 'left') {
            msg.className = 'msg left';
        }
        else {
            msg.className = 'msg right';
        }

        var text = document.createTextNode(messageObject.text);
        msg.appendChild(text);
        messageContainer.appendChild(msg);
    }

    messageContainer.children[messageContainer.childElementCount-1].scrollIntoView(true);
}

function updateSideBar(chatId) {
    var list = state.chatList[chatId].messages;
    sideBar.children[chatId].children[0].children[1].innerHTML = list[list.length-1].text;
}

function swithChat(chatId) {
    sideBar.children[state.activeChat].style.backgroundColor = 'white';
    state.activeChat = chatId;
    sideBar.children[chatId].style.backgroundColor = 'gainsboro';
    messageContainer.innerHTML = '';
    fillChatContainer(state.chatList[state.activeChat]);
    textBox.focus();
}

function sendMessage() {
    var msg = document.createElement('div');
    msg.className = 'msg right';

    var message = textBox.value;
    var text = document.createTextNode(message);
    msg.appendChild(text);
    textBox.value = "";

    messageContainer.appendChild(msg);
    msg.scrollIntoView(true);

    state.chatList[state.activeChat].messages.push({
        sender: "right",
        text: message
    });
    updateSideBar(state.activeChat);
}


var state = {
    chatList: [],
    activeChat: 0
};

fillChatList(state.chatList);
fillSideBar(state.chatList);
swithChat(state.activeChat);

sendButton.onclick = sendMessage;
textBox.onkeypress = function (event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
};

for (var i = 0; i < sideBar.childElementCount; i++) {
    sideBar.children[i].onclick = function() {
        swithChat(this.id);
    }
}
