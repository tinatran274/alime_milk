class Regulation {
    constructor (name, content, link) {
        this.name=name;
        this.content = content;
        this.link = link;
    }
    toString() {
        return this.name + ', ' + this.content + ', ' + this.link;
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
}

// Firestore data converter
const regulationConverter = {
    toFirestore: (regulation) => {
        return {
            name: regulation.name,
            content: regulation.content,
            link: regulation.link,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Regulation(data.name, data.content, data.link);
    }
};
export default regulationConverter;