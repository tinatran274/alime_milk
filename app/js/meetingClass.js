class Meeting {
    constructor (name,date, time, emp) {
        this.name=name;
        this.date = date;
        this.time = time;
        this.emp = emp;
    }
    toString() {
        return this.name + ', ' + this.date + ', ' + this.time + ', ' + this.emp;
    }
    getReName() {
        return this.name;
    }
    getDate() {
        return this.date;
    }
    getTime() {
        return this.time;
    }
    getEmp() {
        return this.emp;
    }
}

// Firestore data converter
const meetingConverter = {
    toFirestore: (meeting) => {
        return {
            name: meeting.name,
            date: meeting.date,
            time: meeting.time,
            emp: meeting.emp,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Meeting(data.name, data.date, data.time, data.emp);
    }
};
export default meetingConverter;