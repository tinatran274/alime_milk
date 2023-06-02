class Sending {
    constructor (recipient_name,recipient, sender, sender_name, title, content, time) {
        this.recipient_name=recipient_name;
        this.recipient = recipient;
        this.time = time;
        this.sender = sender;
        this.sender_name = sender_name;
        this.title = title;
        this.content = content;

    }
    toString() {
        return recipient_name + ', ' + sender_name + ', ' + this.title + ', ' + this.time;
    }
    getRecipientName() {
        return this.recipient_name;
    }
    getRecipient() {
        return this.recipient;
    }
    getSenderName() {
        return this.sender_name;
    }
    getSender() {
        return this.sender;
    }
    getTime() {
        return this.time;
    }
    getTitle() {
        return this.title;
    }
    getContent() {
        return this.content;
    }

}

// Firestore data converter
const sendingConverter = {
    toFirestore: (sending) => {
        return {
            recipient_name: sending.recipient_name,
            recipient: sending.recipient,
            time: sending.time,
            sender_name: sending.sender_name,
            sender: sending.sender,
            title: sending.title,
            content: sending.content,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Sending(data.recipient_name,data.recipient, data.sender, data.sender_name, data.title, data.content, data.time);
    }
};
export default sendingConverter;