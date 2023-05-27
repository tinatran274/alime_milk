class Notify {
    constructor (name, content, link, date) {
        this.name=name;
        this.content = content;
        this.link = link;
        this.date = date;
    }
    toString() {
        return this.name + ', ' + this.content + ', ' + this.link +', ' + this.date;
    }
    getReName() {
        return this.name;
    }
    getContent() {
        return this.content;
    }
    getLink() {
        return this.link;
    }
    getDate() {
        return this.date;
    }
}

// Firestore data converter
const notifyConverter = {
    toFirestore: (notify) => {
        return {
            name: notify.name,
            content: notify.content,
            link: notify.link,
            date: notify.date,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Notify(data.name, data.content, data.link, data.date);
    }
};
export default notifyConverter;