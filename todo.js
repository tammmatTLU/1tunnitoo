class Entry{
    constructor(title, description, date){
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
        //default prioriteet on keskmine
        this.priority = "2";
    }
}

class Todo{
    constructor(){
        this.entries = JSON.parse(localStorage.getItem('entries')) || [];
        document.querySelector('#addButton').addEventListener('click', () => {this.addEntry()});
        this.render();
    }
    // allikad: 
    // https://www.w3schools.com/jsref/jsref_sort.asp
    // https://medium.com/@danialashrafk20sw037/sorting-dates-in-javascript-89c63e143acf
    sortByDate() {
        this.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    addEntry(){
        const titleValue = document.querySelector('#title').value;
        const descriptionValue = document.querySelector('#description').value;
        const dateValue = document.querySelector('#date').value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue));
        this.render();
    }

    render(){
        //Sorteerimine igal renderdamisel
        this.sortByDate();
        let taskList = document.querySelector('#taskList');
        taskList.innerHTML = "";

        const doneUl = document.createElement("ul");
        const ul = document.createElement('ul');
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "To Do";
        doneHeading.innerText = "Done";

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement('li');
            const div = document.createElement('div');
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container"
            const deleteButton = document.createElement('button');
            const doneButton = document.createElement('button');
            //PRIORITEEDI MÄÄRAMISE RIPPMENÜÜ
            const prioritySelect = document.createElement('select');
            prioritySelect.setAttribute("id", `priority${entryIndex}`);
            prioritySelect.add(new Option("Kõrge", "1"));
            prioritySelect.add(new Option("Keskmine", "2"));
            prioritySelect.add(new Option("Madal", "3"));
            prioritySelect.value = this.entries[entryIndex].priority;

            prioritySelect.addEventListener('change', ()=>{
                this.entries[entryIndex].priority = document.querySelector(`#priority${entryIndex}`).value;
                this.save();
                this.render();
            });
            //EDIT NUPP
            const editButton = document.createElement('button');
            editButton.innerText = "✎";
            editButton.className = "edit";

            doneButton.innerText = "✓";
            doneButton.className = "done";
            deleteButton.innerText = "x";
            deleteButton.className = "delete";

            deleteButton.addEventListener('click', () => {
                this.entries.splice(entryIndex, 1);
                this.render();
            });
            doneButton.addEventListener('click', () => {
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                } else{
                    this.entries[entryIndex].done = true;
                }
                this.render();
            });
            //EDIT NUPP
            editButton.addEventListener('click', () => {
                let newTitle = prompt("Title:", this.entries[entryIndex].title);
                let newDesc = prompt("Description:", this.entries[entryIndex].description);
                let newDate = prompt("Date:", this.entries[entryIndex].date);

                // Update the task directly
                this.entries[entryIndex].title = newTitle;
                this.entries[entryIndex].description = newDesc;
                this.entries[entryIndex].date = newDate;

                this.save();
                this.render(); // Sorting will happen here after the edit
            });

            div.className = "task";
            //KUUPÄEVA VORMINDUS MANUAALSELT KASUTADES .substring() MEETODIT
            div.innerHTML = `<div>${entryIndex + 1}</div><div>${entryValue.title}</div><div>${entryValue.description}</div><div>${entryValue.date.substring(8, 10)}.${entryValue.date.substring(5, 7)}.${entryValue.date.substring(0, 4)}</div>`;
            
            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }

            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
            buttonDiv.appendChild(prioritySelect);
        });
        taskList.appendChild(taskHeading);
        taskList.appendChild(ul);
        taskList.appendChild(doneHeading);
        taskList.appendChild(doneUl);
        this.save();
    }

    save(){
        localStorage.setItem('entries', JSON.stringify(this.entries));
    }

    
}

const todo = new Todo();

