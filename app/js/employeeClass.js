class Employee {
    constructor (name, age, phone, mail, address, role, unit) {
        this.name=name;
        this.age = age;
        this.phone = phone;
        this.mail=mail
        this.address = address;
        this.role = role;
        this.unit = unit;
        
    }
    toString() {
        return this.name + ', ' + this.age + ', ' + this.phone +', ' + this.mail+ ', ' + this.address + ', ' + this.role+ ', ' + this.unit;
    }
    getRename() {
        return this.name;
    }
    getAge() {
        return this.age;
    }
    getPhone() {
        return this.phone;
    }
    getMail() {
        return this.mail;
    }
    getAddress() {
        return this.address;
    }
    getRole() {
        return this.role;
    }
    getUnit() {
        return this.unit;
    }
}

// Firestore data converter
const employeeConverter = {
    toFirestore: (employee) => {
        return {
            name: employee.name,
            age: employee.age,
            phone: employee.phone,
            mail: employee.mail,
            address: employee.address,
            role: employee.role,
            unit: employee.unit,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Employee(data.name, data.age, data.phone,data.mail, data.address, data.role, data.unit);
    }
};
export default employeeConverter;