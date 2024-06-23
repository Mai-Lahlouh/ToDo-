let toDoList = document.getElementById("todo-list");
let input = document.getElementById("todo-input");
let addBtn = document.getElementById("addBtn");
const filters = document.querySelectorAll('.show button');
const clearCompletedBtn = document.getElementById('clear-completed');
const remainingCount = document.querySelector('.show output');
const defaultFilterBtn = document.querySelector('#all');
var arrList;

if(localStorage.getItem('toDo') !== null){
    arrList = JSON.parse(localStorage.getItem('toDo'));
    addElementToPageFrom(arrList);
}else{
    arrList = [];
};
//function to add a task and store it in local storage
function addTask(){
    if(input.value.trim() !== ''){
        var data = input.value.trim();
        var object={
            taskId : arrList.length +1,
            taskName: data,
            completed : false,
        };
        arrList.push(object);
        localStorage.setItem('toDo',JSON.stringify(arrList));
        input.value='';
        addElementToPageFrom(arrList);
        updateRemainingCount();
    }else{
        alert("You must write something");
    }
};
//function to handle enter key press in input field
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });
// Function to create and display task elements in the list
function addElementToPageFrom(arrList){
    toDoList.innerHTML='';
    for(let i=0 ;i<arrList.length;i++){
        var ilEle = document.createElement('li');
        ilEle.classList.add('task');
        if(arrList[i].completed){
            ilEle.classList.add('checked');
        };
        var ionIcon = document.createElement('ion-icon');
        ionIcon.setAttribute('name', arrList[i].completed ? 'checkmark-circle' : 'ellipse-outline');
        ionIcon.classList.add('checkbtn');
        var deleteIcon = document.createElement('ion-icon');
        deleteIcon.setAttribute('name','close-outline');
        deleteIcon.classList.add('delete-icon');
        var span= document.createElement('span');
        span.textContent = arrList[i].taskName;
        ilEle.setAttribute('data-id',arrList[i].taskId);
        ilEle.appendChild(ionIcon);
        ilEle.appendChild(deleteIcon);
        ilEle.appendChild(span);
        toDoList.appendChild(ilEle);    
    };
};

//Function to toggle task completion status
toDoList.addEventListener("click", (e) =>{
    if(e.target.classList.contains('checkbtn')){
        const taskId = e.target.parentElement.getAttribute('data-id');
        toggleStatus(taskId);
        e.target.parentElement.classList.toggle('checked');
    };
    if(e.target.classList.contains('delete-icon')){
        const taskId = e.target.parentElement.getAttribute('data-id');
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if(confirmDelete){
            deleteTask(taskId);
        };
    };
});
//Function to toggle task completion status in local storage
function toggleStatus(id){
    for(let i=0;i<arrList.length;i++){
        if(arrList[i].taskId == id){
            arrList[i].completed = !arrList[i].completed;
        };
    };
    //update local storage data
    localStorage.setItem('toDo',JSON.stringify(arrList));
    updateRemainingCount();
    showData(getSelectedFilter()); 
    refreshTaskList();  
};
// Function to display data based on the selected filter
function showData(filter){
    let filteredList;
    if(filter === 'active'){
        filteredList = arrList.filter(task => !task.completed);
    }else if(filter === 'completed'){
        filteredList = arrList.filter(task => task.completed);
    }else{
        filteredList=arrList;
    };
    addElementToPageFrom(filteredList);// update page with filtered list
};
//get te currently selected filter
function getSelectedFilter(){
    const activeFilterBtn = document.querySelector('.show button');
    return activeFilterBtn;
};
//clear completed tasks
function clearCompleted(){
    if(arrList.length > 0){
        const completedTasks = arrList.filter(task => task.completed);
        if(completedTasks.length > 0){
            if(confirm('Are you sure you want to clear completed tasks?')){
                arrList = arrList.filter(task => !task.completed);
                localStorage.setItem('toDo', JSON.stringify(arrList)); // Update local storage
                showData(getSelectedFilter());
                updateRemainingCount();
                refreshTaskList();
            }
        }else{
            alert('There are currently no completed tasks to clear.');
        }
    }else{
        alert('There are currently no completed tasks to clear.');
    }
    document.getElementById('all').click();
};   
filters.forEach(filterBtn => {
    filterBtn.addEventListener('click',()=>{
        filters.forEach(btn => btn.classList.remove('clicked'));
        filterBtn.classList.add('clicked');
        filterBtn.classList.toggle('active');
        showData(filterBtn.id);
    });
});
//function to display the number of active tasks
function updateRemainingCount(){
    const remainingTasks=arrList.filter(task => !task.completed).length;
    remainingCount.textContent = `${remainingTasks} items left`;
};
clearCompletedBtn.addEventListener('click',clearCompleted);
showData(getSelectedFilter);
//function to refresh tasks list
function refreshTaskList() {
    toDoList.innerHTML = ""; 
    addElementToPageFrom(arrList);
    const completedTasks = arrList.filter(task => task.completed);
    const activeTasks = arrList.filter(task => !task.completed);  
    const selectedButton = document.querySelector('.show button.clicked');
  
    if (completedTasks.length === 0 && selectedButton.textContent === "Completed") {
      selectedButton.classList.remove('clicked'); // Remove 'clicked' class
      document.getElementById('all').click();
    } else if (activeTasks.length === 0 && selectedButton.textContent === "Active") {
      selectedButton.classList.remove('clicked'); 
      document.getElementById('all').click();
    };
};
toDoList.addEventListener("mouseover",(e)=>{
    if(e.target.classList.contains('task')){
        const deleteIcon = e.target.querySelector('.delete-icon');
        if(deleteIcon && e.relatedTarget !== deleteIcon){
            deleteIcon.style.display = 'block';
        }        
    }
});
toDoList.addEventListener("mouseout",(e)=>{
    if(e.target.classList.contains('task')){
        const deleteIcon = e.target.querySelector('.delete-icon');
        if(deleteIcon && e.relatedTarget !== deleteIcon){
            deleteIcon.style.display = 'none';
        }
    }
});
//function to delete a task
function deleteTask(id){
    const newArrList =arrList.filter(task => task.taskId != id);
    arrList=newArrList;
    localStorage.setItem('toDo',JSON.stringify(arrList));
    addElementToPageFrom(newArrList);
    updateRemainingCount();
};
window.onload =()=>{
    showData(getSelectedFilter());
    updateRemainingCount();
    defaultFilterBtn.click();
    const deleteIcons = toDoList.querySelectorAll('.delete-icon');
    deleteIcons.forEach(icon => icon.style.display = 'none');
};