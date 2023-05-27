class Employee {
    constructor (name, age, phone, address, role) {
        this.name=name;
        this.age = age;
        this.phone = phone;
        this.address = address;
        this.role = role;
        
    }
    toString() {
        return this.name + ', ' + this.age + ', ' + this.phone + ', ' + this.address + ', ' + this.role;
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
    getAddress() {
        return this.address;
    }
    getRole() {
        return this.role;
    }
}

// Firestore data converter
const employeeConverter = {
    toFirestore: (employee) => {
        return {
            name: employee.name,
            age: employee.age,
            phone: employee.phone,
            phone: employee.address,
            phone: employee.role,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Employee(data.name, data.age, data.phone, data.address, data.role);
    }
};
export default employeeConverter;