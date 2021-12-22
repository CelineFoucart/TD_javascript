const eventEntity = {
    name: '',
    place: '',
    description: ''
};

class CardManager {

    constructor() {
        this.formFields = {};
        this.counter = 0;
        this.getFields();
    }

    getFields() {
        for (const property in eventEntity) {
            let input = document.getElementById(property);
            this.formFields[property] = input;
            input.addEventListener('keyup', () => {
                eventEntity[property] = input.value;
                console.log(eventEntity);
            });
        }
    }

    /**
     * @param {Object} eventEntity 
     * @returns {HTMLElement}
     */
    createCard(eventEntity) {
        const card = document.createElement('article');
        card.className = "card";
        const body = this.appendCardPart('div', "card-body", '', card);
        const data = {
            name: ['h5', 'card-title'],
            place: ['p', 'card-text fw-bold'],
            description: ['p', 'card-text']
        };
        for (const property in eventEntity) {
            this.appendCardPart(data[property][0], data[property][1], eventEntity[property], body);
        }
        return card;
    }

    /**
     * @param {string} elementName 
     * @param {string} classes 
     * @param {string} text 
     * @param {HTMLElement} parent 
     * @returns {HTMLElement}
     */
    appendCardPart(elementName, classes, text, parent) {
        const element = document.createElement(elementName);
        element.className = classes;
        element.innerHTML = text;
        parent.appendChild(element);
        return element;
    }

    /**
     * @returns {boolean}
     */
    validate() {
        let valid = true;
        for (const property in eventEntity) {
            if(eventEntity[property] === "") {
                valid = false;
            }
        }
        return valid;
    }

    /**
     * @param {HTMLElement} element 
     * @param {string} idToErase 
     */
    appendButton(element, idToErase) {
        const footer = document.createElement('div');
        footer.className = "card-footer text-center";            
        const button = document.createElement('button');
        button.className = "btn btn-danger";
        button.innerHTML = "Supprimer la carte";
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const card = document.getElementById(idToErase);
            card.remove();
        });
        footer.appendChild(button);
        element.appendChild(footer);
    }

    /**
     * @param {HTMLElement} message 
     */
    insertErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = "alert alert-danger";
        alert.innerHTML = "Le formulaire est mal rempli";
        message.appendChild(alert);
    }

    insertHiddenButton(parent) {
        const eye = document.createElement('button');
        eye.className = "btn btn-success";
        eye.innerHTML = `<i class="bi bi-eye-slash-fill"></i>`;
        parent.appendChild(eye);
        eye.addEventListener('click', (event) => {
            event.preventDefault();
            parent.classList.add("d-none");
            const showButton = document.getElementById('show');
            showButton.classList.remove("d-none");
            if(showButton.getAttribute('listener') !== 'active') {
                showButton.setAttribute('listener', 'active');
                showButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    document.querySelectorAll('.d-none').forEach(element => {
                        element.classList.remove('d-none');
                    });
                    showButton.classList.add('d-none');
                });
            }
        });
    }

    insertCard(message) {
        this.counter++;
        const col = document.createElement('div');
        let idToErase = 'event' + this.counter;
        col.className = "col-md-6 col-lg-4 d-flex align-items-start";
        col.id = idToErase;
        const card = this.createCard(eventEntity);
        this.appendButton(card, idToErase);
        col.appendChild(card);
        this.insertHiddenButton(col);
        document.getElementById('events').appendChild(col);
        message.innerHTML = "";
        for (const property in eventEntity) {
            this.formFields[property].value = "";
            eventEntity[property] = "";
        }
    }

    run() {
        const valid = this.validate();
        const message = document.getElementById('message');
        if(valid) {
            this.insertCard(message);
        } else {
            this.insertErrorMessage(message);
        }
    }
}

window.onload = () => {
    const cardManager = new CardManager();
    document.getElementById('submit').addEventListener('click', (event) => {
        event.preventDefault();
        cardManager.run();
    });
}
