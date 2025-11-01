class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Add to end
    append(data) {
        const newNode = new Node(data);
        
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // Get element by index
    get(index) {
        if (index < 0 || index >= this.size) {
            return null;
        }
        
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }

    print() {
        if (this.size === 0) {
            console.log("List is empty");
            return;
        }
        
        let current = this.head;
        const array = [];
        
        while (current) {
            array.push(current.data);
            current = current.next;
        }
        
        console.log(array);
    }

    // Alternative: Return as string
    toString() {
        let current = this.head;
        let result = "";
        while (current) {
            result += current.data + " -> ";
            current = current.next;
        }
        result += "null";
        return result;
    }

    getSize() {
        return this.size;
    }
    
    clear() {
        this.head = null;
        this.size = 0;
    }
}