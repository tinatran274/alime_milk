class News {
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
const newsConverter = {
    toFirestore: (news) => {
        return {
            name: news.name,
            content: news.content,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new News(data.name, data.content);
    }
};
export default newsConverter;