// --------------------------------------Step 1---------------------------------------------
// implement send button functionality

// save references to html elements that we need later
var textBox = document.getElementById('textBox');
var messageContainer = document.getElementById('messageContainer');
var sendButton = document.getElementById('sendBtn');

function sendMessage() {
    // create new div element
    var msg = document.createElement('div');
    // set class to 'msg right' to apply styling
    msg.className = 'msg right';

    // create text element from user input
    var message = textBox.value;
    var text = document.createTextNode(message);
    // add text element to message element
    msg.appendChild(text);

    // reset textBox
    textBox.value = "";

    // add message element to the message container, now its actually visible
    messageContainer.appendChild(msg);

    // scroll to newly created message automatically
    msg.scrollIntoView(true);


    // added in Step 2
    // add new message to state
    state.chatList[state.activeChat].messages.push({
        sender: "right",
        text: message
    });


    // added in Step 3
    // make sure last message is displayed in sidebar
    updateSideBar(state.activeChat);
    
}

// apply the created function to the button so it is called when the user clicks it
//sendButton.addEventListener('click', sendMessage)
// lieber direkt Eigenschaft ändern als mit events arbeiten - einfacher zu verstehen
sendButton.onclick = sendMessage;

// call function when 'enter' is pressed
textBox.onkeypress = function (event) {
    // hier googlen nach enter code
    if (event.keyCode === 13) {
        sendMessage();
    }
};

// --------------------------------------Step 2---------------------------------------------
// initialize page content via code

var sideBar = document.getElementById("sideBar");
// oben schon referenziert
//var messageContainer = document.getElementById("messageContainer")
var chatInfo = document.getElementById("chatInfo");

// Wenn genug Zeit über ist, s.u.
// class Chat {
//     constructor(contact, messages) {
//         this.contact = contact;
//         this.messages = messages;
//     }
// }

// create mock messages to replace html
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

// fill chatList object with mock data
function fillChatList(chatList) {
    var contactList = ['Max Mustermann', 'Peter Pan', 'Godric Gryffindor', 'Gundula Gause', 'Spongebob Schwammkopf',
        'Bilbo Beutlin', 'Albert Ainstein', 'Billy Boy', 'Mamma Mia', 'Turk Turkleton'];
    for (var i = 0; i < 10; i++) {
        var contact = contactList[i];
        var messages = generateDefaultMessages();
        // Wenn genug Zeit über ist, hier in die Chat Klasse auslagern
        var newChat = {
            contact,
            messages
        };
        chatList.push(newChat);
    }
}

// insert data from chatList into html document
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

// insert messages of currently displayed chat in html document
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

// state of website, e.g. all messages of all chats and currently displayed chat
var state = {
    chatList: [],
    activeChat: 0
};

// fill html document
fillChatList(state.chatList);
fillSideBar(state.chatList);
// durch switchChat später ersetzt
//fillChatContainer(state.chatList[0])

// added in Step 3
// sets active chat and fills messageContainer
switchChat(state.activeChat);



// --------------------------------------Step 3---------------------------------------------
// implemet sidebar functionality


// set last message in sidebar
function updateSideBar(chatId) {
    var list = state.chatList[chatId].messages;
    sideBar.children[chatId].children[0].children[1].innerHTML = list[list.length-1].text;
}

// set new active chat and load all messages
function switchChat(chatId) {
    sideBar.children[state.activeChat].style.backgroundColor = 'white';
    state.activeChat = chatId;
    sideBar.children[chatId].style.backgroundColor = 'gainsboro';
    messageContainer.innerHTML = '';
    fillChatContainer(state.chatList[state.activeChat]);
    textBox.focus();
}

// connect click event of sidebar to switch functionality
for (var i = 0; i < sideBar.childElementCount; i++) {
    sideBar.children[i].onclick = function() {
        switchChat(this.id);
    }
}