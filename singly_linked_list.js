export class Node {
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
            return null; // Index out of bounds
        }
        
        let current = this.head;
        for (let i = 0; i < index; i++) {
            current = current.next;
        }
        return current.data;
    }

    // Print element by index
    printAtIndex(index) {
        const element = this.get(index);
        if (element !== null) {
            console.log(`Index ${index}:`, element);
        } else {
            console.log(`Index ${index} is out of bounds`);
        }
        return element;
    }

    // Print all elements
    print() {
        let current = this.head;
        const elements = [];
        while (current) {
            console.log(current.data);
            console.log();
            current = current.next;
        }
    }

    // Get size
    getSize() {
        return this.size;
    }
    clear() {
        this.head = null;
        this.size = 0;
    }
}