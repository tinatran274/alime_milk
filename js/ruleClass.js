class Rule {
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
const ruleConverter = {
    toFirestore: (rule) => {
        return {
            name: rule.name,
            content: rule.content,
            link: rule.link,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Rule(data.name, data.content, data.link);
    }
};
export default ruleConverter;