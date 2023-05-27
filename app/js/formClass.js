class Form {
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
const formConverter = {
    toFirestore: (form) => {
        return {
            name: form.name,
            content: form.content,
            link: form.link,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Form(data.name, data.content, data.link);
    }
};
export default formConverter;