class Event {
    constructor (name, content) {
        this.name=name;
        this.content = content;
    }
    toString() {
        return this.name + ', ' + this.content ;
    }
    getReName() {
        return this.name;
    }
    getContent() {
        return this.content;
    }
}

// Firestore data converter
const eventConverter = {
    toFirestore: (event) => {
        return {
            name: event.name,
            content: event.content,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Event(data.name, data.content);
    }
};
export default eventConverter;