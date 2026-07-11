/*=========================================
    STUDENT MANAGEMENT SYSTEM
    PART - 1
==========================================*/

/*=========================================
    API URLS
==========================================*/

const FETCH_ALL_API = "api-fatch-all.php";
const FETCH_SINGLE_API = "api-fatch-single.php";
const INSERT_API = "api-insert.php";
const UPDATE_API = "api-update.php";
const DELETE_API = "api-delete.php";
const SEARCH_API = "api-search.php";

/*=========================================
    DOM ELEMENTS
==========================================*/

const studentForm = document.getElementById("studentForm");

const tableData = document.getElementById("table-data");

const totalRecords = document.getElementById("totalRecords");

const loader = document.getElementById("loader");

const toast = document.getElementById("toast");

const refreshBtn = document.getElementById("refreshBtn");

const searchInput = document.getElementById("search");

const saveBtn = document.getElementById("saveBtn");

const updateBtn = document.getElementById("updateBtn");

const clearBtn = document.getElementById("clearBtn");

const studentId = document.getElementById("studentId");

const name = document.getElementById("name");

const age = document.getElementById("age");

const city = document.getElementById("city");

/*=========================================
    LOADER
==========================================*/

function showLoader() {

    loader.style.display = "flex";

}

function hideLoader() {

    loader.style.display = "none";

}

/*=========================================
    TOAST
==========================================*/

function showToast(message, color = "#10b981") {

    toast.innerHTML = message;

    toast.style.background = color;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}

/*=========================================
    CLEAR FORM
==========================================*/

function clearForm() {

    studentId.value = "";

    name.value = "";

    age.value = "";

    city.value = "";

}

/*=========================================
    VALIDATION
==========================================*/

function validateForm() {

    if (name.value.trim() == "") {

        showToast("Please Enter Student Name", "#ef4444");

        name.focus();

        return false;

    }

    if (age.value.trim() == "") {

        showToast("Please Enter Age", "#ef4444");

        age.focus();

        return false;

    }

    if (age.value <= 0) {

        showToast("Invalid Age", "#ef4444");

        age.focus();

        return false;

    }

    if (city.value.trim() == "") {

        showToast("Please Enter City", "#ef4444");

        city.focus();

        return false;

    }

    return true;

}

/*=========================================
    CREATE TABLE ROW
==========================================*/

function createRow(student) {

    return `

    <tr>

        <td>${student.id}</td>

        <td>${student.student_name}</td>

        <td>${student.age}</td>

        <td>${student.city}</td>

        <td>

            <button
                class="edit-btn"
                data-id="${student.id}">

                Edit

            </button>

        </td>

        <td>

            <button
                class="delete-btn"
                data-id="${student.id}">

                Delete

            </button>

        </td>

    </tr>

    `;

}

/*=========================================
    LOAD ALL STUDENTS
==========================================*/

async function loadStudents() {

    showLoader();

    try {

        const response = await fetch(FETCH_ALL_API);

        const data = await response.json();

        tableData.innerHTML = "";

        if (data.status === false) {

            tableData.innerHTML = `

            <tr>

                <td colspan="6">

                    No Student Found

                </td>

            </tr>

            `;

            totalRecords.innerHTML = "Total : 0";

            hideLoader();

            return;

        }

        data.forEach(student => {

            tableData.innerHTML += createRow(student);

        });

        totalRecords.innerHTML = "Total : " + data.length;

    }

    catch (error) {

        console.log(error);

        showToast("Server Error", "#ef4444");

    }

    hideLoader();

}

/*=========================================
    PAGE LOAD
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadStudents();

});

/*=========================================
    CLEAR BUTTON
==========================================*/

clearBtn.addEventListener("click", () => {

    clearForm();

});

/*=========================================
    REFRESH BUTTON
==========================================*/

refreshBtn.addEventListener("click", () => {

    clearForm();

    loadStudents();

    showToast("Data Refreshed");

});



/*=========================================
    PART - 2
    INSERT STUDENT
==========================================*/

studentForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    insertStudent();

});

/*=========================================
    INSERT FUNCTION
==========================================*/

async function insertStudent() {

    showLoader();

    const studentData = {

        sname: name.value.trim(),

        sage: age.value.trim(),

        scity: city.value.trim()

    };

    try {

        const response = await fetch(INSERT_API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(studentData)

        });

        const result = await response.json();

        hideLoader();

        if (result.status == true) {

            showToast(result.message);

            clearForm();

            loadStudents();

        } else {

            showToast(result.message, "#ef4444");

        }

    }

    catch (error) {

        hideLoader();

        console.log(error);

        showToast("Server Error", "#ef4444");

    }

}

/*=========================================
    RECORD COUNTER
==========================================*/

function updateRecordCounter() {

    let total = tableData.querySelectorAll("tr").length;

    if (tableData.innerHTML.includes("No Student Found")) {

        total = 0;

    }

    totalRecords.innerHTML = "Total : " + total;

}

/*=========================================
    OVERRIDE LOAD STUDENTS
==========================================*/

const oldLoadStudents = loadStudents;

loadStudents = async function () {

    showLoader();

    try {

        const response = await fetch(FETCH_ALL_API);

        const data = await response.json();

        tableData.innerHTML = "";

        if (data.status === false) {

            tableData.innerHTML = `

            <tr>

                <td colspan="6" style="padding:30px;">

                    No Student Found

                </td>

            </tr>

            `;

            updateRecordCounter();

            hideLoader();

            return;

        }

        data.forEach(student => {

            tableData.innerHTML += createRow(student);

        });

        updateRecordCounter();

    }

    catch (error) {

        console.log(error);

        showToast("Unable to Fetch Data", "#ef4444");

    }

    hideLoader();

};

/*=========================================
    AUTO UPPERCASE CITY
==========================================*/

city.addEventListener("keyup", function () {

    let words = city.value.split(" ");

    words = words.map(word => {

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    });

    city.value = words.join(" ");

});

/*=========================================
    ONLY LETTERS IN NAME
==========================================*/

name.addEventListener("keypress", function (e) {

    let char = String.fromCharCode(e.which);

    if (!/[a-zA-Z ]/.test(char)) {

        e.preventDefault();

    }

});

/*=========================================
    ONLY NUMBER IN AGE
==========================================*/

age.addEventListener("input", function () {

    if (age.value < 0) {

        age.value = "";

    }

    if (age.value > 100) {

        age.value = 100;

    }

});

/*=========================================
    ENTER KEY SUPPORT
==========================================*/

document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        if (document.activeElement === city) {

            e.preventDefault();

            saveBtn.click();

        }

    }

});

/*=========================================
    RESET FORM
==========================================*/

function resetForm() {

    studentForm.reset();

    studentId.value = "";

    name.focus();

}

/*=========================================
    CLEAR BUTTON UPDATE
==========================================*/

clearBtn.addEventListener("click", function () {

    resetForm();

    showToast("Form Cleared");

});

/*=========================================
    PAGE REFRESH
==========================================*/

refreshBtn.addEventListener("click", function () {

    resetForm();

    loadStudents();

});

/*=========================================
    SUCCESS LOG
==========================================*/

console.log("Part 2 Loaded Successfully");


/*=========================================
        PART - 3
        EDIT & UPDATE STUDENT
=========================================*/

/*==============================
    MODAL ELEMENTS
==============================*/

const editModal = document.getElementById("editModal");

const closeModal = document.getElementById("closeModal");

const editForm = document.getElementById("editForm");

const editId = document.getElementById("editId");

const editName = document.getElementById("editName");

const editAge = document.getElementById("editAge");

const editCity = document.getElementById("editCity");

/*==============================
        OPEN MODAL
==============================*/

function openModal(){

    editModal.style.display="flex";

}

/*==============================
        CLOSE MODAL
==============================*/

function closeEditModal(){

    editModal.style.display="none";

}

closeModal.addEventListener("click",closeEditModal);

window.addEventListener("click",function(e){

    if(e.target==editModal){

        closeEditModal();

    }

});

/*==============================
    EDIT BUTTON CLICK
==============================*/

document.addEventListener("click",function(e){

    if(e.target.classList.contains("edit-btn")){

        let id=e.target.dataset.id;

        fetchSingleStudent(id);

    }

});

/*==============================
    FETCH SINGLE STUDENT
==============================*/

async function fetchSingleStudent(id){

    showLoader();

    try{

        const response=await fetch(FETCH_SINGLE_API,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                sid:id

            })

        });

        const data=await response.json();

        hideLoader();

        if(data.status==false){

            showToast("Record Not Found","#ef4444");

            return;

        }

        editId.value=data[0].id;

        editName.value=data[0].student_name;

        editAge.value=data[0].age;

        editCity.value=data[0].city;

        openModal();

    }

    catch(error){

        hideLoader();

        console.log(error);

        showToast("Server Error","#ef4444");

    }

}

/*==============================
        UPDATE FORM
==============================*/

editForm.addEventListener("submit",function(e){

    e.preventDefault();

    updateStudent();

});

/*==============================
    UPDATE STUDENT
==============================*/

async function updateStudent(){

    if(editName.value.trim()==""){

        showToast("Enter Student Name","#ef4444");

        return;

    }

    if(editAge.value.trim()==""){

        showToast("Enter Age","#ef4444");

        return;

    }

    if(editCity.value.trim()==""){

        showToast("Enter City","#ef4444");

        return;

    }

    showLoader();

    const student={

        sid:editId.value,

        sname:editName.value,

        sage:editAge.value,

        scity:editCity.value

    };

    try{

        const response=await fetch(UPDATE_API,{

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(student)

        });

        const result=await response.json();

        hideLoader();

        if(result.status){

            showToast(result.message);

            closeEditModal();

            loadStudents();

        }

        else{

            showToast(result.message,"#ef4444");

        }

    }

    catch(error){

        hideLoader();

        console.log(error);

        showToast("Update Failed","#ef4444");

    }

}

/*==============================
    ESC KEY CLOSE MODAL
==============================*/

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        closeEditModal();

    }

});

/*==============================
    AUTO CAPITALIZE EDIT CITY
==============================*/

editCity.addEventListener("keyup",function(){

    let words=editCity.value.split(" ");

    words=words.map(function(word){

        return word.charAt(0).toUpperCase()+word.slice(1).toLowerCase();

    });

    editCity.value=words.join(" ");

});

/*==============================
    NAME VALIDATION
==============================*/

editName.addEventListener("keypress",function(e){

    let ch=String.fromCharCode(e.which);

    if(!/[a-zA-Z ]/.test(ch)){

        e.preventDefault();

    }

});

/*==============================
    AGE VALIDATION
==============================*/

editAge.addEventListener("input",function(){

    if(editAge.value<0){

        editAge.value="";

    }

    if(editAge.value>100){

        editAge.value=100;

    }

});

console.log("Part 3 Loaded Successfully");


/*=========================================
        PART - 4
        DELETE + SEARCH + FINAL
=========================================*/

/*==============================
        DELETE STUDENT
==============================*/

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("delete-btn")) {

        let id = e.target.dataset.id;

        if (confirm("Are you sure you want to delete this student?")) {

            deleteStudent(id);

        }

    }

});

/*==============================
        DELETE FUNCTION
==============================*/

async function deleteStudent(id) {

    showLoader();

    try {

        const response = await fetch(DELETE_API, {

            method: "DELETE",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                sid: id

            })

        });

        const result = await response.json();

        hideLoader();

        if (result.status == true) {

            showToast(result.message);

            loadStudents();

        }

        else {

            showToast(result.message, "#ef4444");

        }

    }

    catch (error) {

        hideLoader();

        console.log(error);

        showToast("Delete Failed", "#ef4444");

    }

}

/*==============================
        LIVE SEARCH
==============================*/

searchInput.addEventListener("keyup", function () {

    let value = searchInput.value.trim();

    if (value == "") {

        loadStudents();

        return;

    }

    searchStudent(value);

});

/*==============================
        SEARCH FUNCTION
==============================*/

async function searchStudent(keyword) {

    showLoader();

    try {

        const response = await fetch(SEARCH_API + "?search=" + encodeURIComponent(keyword));

        const data = await response.json();

        tableData.innerHTML = "";

        if (data.status == false) {

            tableData.innerHTML = `

            <tr>

                <td colspan="6" style="padding:25px">

                    No Student Found

                </td>

            </tr>

            `;

            updateRecordCounter();

            hideLoader();

            return;

        }

        data.forEach(student => {

            tableData.innerHTML += createRow(student);

        });

        updateRecordCounter();

    }

    catch (error) {

        console.log(error);

        showToast("Search Failed", "#ef4444");

    }

    hideLoader();

}

/*==============================
        TABLE EMPTY CHECK
==============================*/

function emptyTableMessage() {

    if (tableData.children.length == 0) {

        tableData.innerHTML = `

        <tr>

            <td colspan="6">

                No Data Available

            </td>

        </tr>

        `;

    }

}

/*==============================
        AUTO RECORD UPDATE
==============================*/

const observer = new MutationObserver(function () {

    updateRecordCounter();

});

observer.observe(tableData, {

    childList: true

});

/*==============================
        FORM SHORTCUT
==============================*/

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey && e.key === "s") {

        e.preventDefault();

        saveBtn.click();

    }

});

/*==============================
        REFRESH SEARCH
==============================*/

searchInput.addEventListener("search", function () {

    loadStudents();

});

/*==============================
        FOCUS NAME
==============================*/

window.onload = function () {

    name.focus();

};

/*==============================
        NETWORK CHECK
==============================*/

window.addEventListener("offline", function () {

    showToast("Internet Connection Lost", "#ef4444");

});

window.addEventListener("online", function () {

    showToast("Internet Connected");

});

/*==============================
        FINAL LOAD
==============================*/

loadStudents();

console.log("Student Management System Loaded Successfully");

/*=========================================
        END OF PROJECT
=========================================*/