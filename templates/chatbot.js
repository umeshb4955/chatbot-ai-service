const chatbox = document.getElementById("chatbox");
        const input = document.getElementById("input");
        const sendButton = document.getElementById("sendButton");

        function appendMessage(sender, message) {
            const p = document.createElement("p");
            p.innerHTML = `<b>${sender}:</b> ${message}`; // Sanitize if needed
            chatbox.appendChild(p);
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            appendMessage("You", message);
            input.value = "";

            try {
                const response = await fetch("/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                appendMessage("Bot", data.response || "No response from bot");
            } catch (error) {
                appendMessage("Bot", "Error: Could not connect to the server");
                console.error("Fetch error:", error);
            }
        }

        sendButton.addEventListener("click", sendMessage);
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });