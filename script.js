const servers = [
    "http://localhost:3000",
    "http://localhost:3001"
];

let socket = null;
let username = "";
let role = "";
let currentServer = 0;
let reconnecting = false;

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");

joinBtn.addEventListener("click", () => {

    username = document.getElementById("username").value.trim();
    role = document.getElementById("role").value;
    currentServer = Number(document.getElementById("serverSelect").value);

    if(username===""){
        alert("Please enter a username.");
        return;
    }

    connect(currentServer);

});

function connect(serverIndex){

    reconnecting = false;

    if(socket){
        socket.removeAllListeners();
        socket.disconnect();
    }

    socket = io(servers[serverIndex],{
        reconnection:true,
        reconnectionAttempts:Infinity,
        reconnectionDelay:1000
    });

    socket.on("connect",()=>{

        document.getElementById("login").style.display="none";
        document.getElementById("chat").style.display="block";

        socket.emit("join",{ username, role });

        document.getElementById("serverName").textContent =
            serverIndex===0 ? "Server 1" : "Server 2";

    });

    socket.on("server",(server)=>{
        document.getElementById("serverName").textContent=server;
    });

    socket.on("users",(users)=>{
        const list=document.getElementById("userList");
        list.innerHTML="";
        users.forEach(user=>{
            const li=document.createElement("li");
            li.innerHTML=`
                <strong>${user.username}</strong><br>
                ${user.role}<br>
                <small>${user.server}</small>
            `;
            list.appendChild(li);
        });
    });

    socket.on("message",(msg)=>{
        const area=document.getElementById("messageArea");
        const div=document.createElement("div");
        div.style.marginBottom="15px";
        div.style.padding="12px";
        div.style.borderRadius="8px";

        let icon="ℹ️", border="#6b7280", bg="#f3f4f6";
        if(msg.type==="announcement"){
            icon="📢"; border="#2563eb"; bg="#dbeafe";
        }else if(msg.type==="response"){
            icon="💬"; border="#16a34a"; bg="#dcfce7";
        }

        div.style.borderLeft=`6px solid ${border}`;
        div.style.background=bg;

        div.innerHTML=`
            <strong>${icon} ${msg.username}</strong>
            <small style="float:right">${msg.time}</small><br>
            <em>${msg.role}</em><br><br>
            ${msg.text}
        `;

        area.appendChild(div);
        area.scrollTop=area.scrollHeight;
    });

    socket.on("disconnect",()=>{

        if(reconnecting) return;
        reconnecting=true;

        document.getElementById("serverName").textContent =
            "Disconnected - Switching Server...";

        currentServer = currentServer===0 ? 1 : 0;

        setTimeout(()=>{
            connect(currentServer);
        },1000);

    });

}

function sendMessage(){
    if(!socket) return;
    const text=messageInput.value.trim();
    if(text==="") return;

    socket.emit("message",{
        username,
        role,
        text
    });

    messageInput.value="";
}

sendBtn.addEventListener("click",sendMessage);

messageInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        e.preventDefault();
        sendMessage();
    }
});
