document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Form ko submit hokar page refresh hone se rokna
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMessage');

    // Basic Validation Requirements
    if (email === "" || password === "") {
        errorMsg.textContent = "Please fill in all fields.";
        errorMsg.style.display = "block";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters long.";
        errorMsg.style.display = "block";
        return;
    }

    // Agar verification pass ho jaye
    errorMsg.style.display = "none";
    alert("Login Successful! Moving to Dashboard...");
    
    // YE WALI LINE FILE MEIN ADD KREIN:
    window.location.href = "pages/dashboard.html"; 
});
// --- DASHBOARD BUSINESS LOGIC ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Dashboard Page Load hone par checks run karein
if (document.getElementById('taskForm')) {
    renderTasks();
    
    // Task Submit form event listener
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const employee = document.getElementById('assignedEmployee').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const startDate = document.getElementById('startDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const status = document.getElementById('taskStatus').value;
        const formError = document.getElementById('formError');

        // Business Logic Check 1: Due date cannot be before start date
        if (new Date(dueDate) < new Date(startDate)) {
            formError.textContent = "Error: Due date cannot be before the start date!";
            formError.style.display = "block";
            return;
        }
        
        formError.style.display = "none";

        const newTask = {
            id: Date.now(),
            title,
            employee,
            priority,
            startDate,
            dueDate,
            status
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save to Local Storage
        
        document.getElementById('taskForm').reset();
        renderTasks();
    });

    // Event Listeners for Search and Filters
    document.getElementById('searchEmployee').addEventListener('input', renderTasks);
    document.getElementById('filterPriority').addEventListener('change', renderTasks);
    document.getElementById('filterStatus').addEventListener('change', renderTasks);
}

// Render and Calculate Report Statistics
function renderTasks() {
    const tableBody = document.getElementById('taskTableBody');
    if (!tableBody) return;

    const searchQuery = document.getElementById('searchEmployee').value.toLowerCase();
    const filterPriority = document.getElementById('filterPriority').value;
    const filterStatus = document.getElementById('filterStatus').value;

    tableBody.innerHTML = "";

    let totalTasksCount = tasks.length;
    let completedCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    const today = new Date().setHours(0,0,0,0);

    tasks.forEach(task => {
        const isCompleted = task.status === "Completed";
        const isOverdue = new Date(task.dueDate) < today && !isCompleted;

        // Statistics Counter
        if (isCompleted) completedCount++;
        else pendingCount++;
        if (isOverdue) overdueCount++;

        // Apply Filters & Search
        const matchesSearch = task.employee.toLowerCase().includes(searchQuery);
        const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
        const matchesStatus = filterStatus === "All" || task.status === filterStatus;

        if (matchesSearch && matchesPriority && matchesStatus) {
            const tr = document.createElement('tr');

            // Business Logic Check 2: High-priority overdue tasks must be highlighted
            if (task.priority === "High" && isOverdue) {
                tr.classList.add('high-priority-overdue');
            }

            tr.innerHTML = `
                <td>${task.title}</td>
                <td>${task.employee}</td>
                <td>${task.priority}</td>
                <td>${task.dueDate}</td>
                <td>${task.status}</td>
                <td><button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button></td>
            `;
            tableBody.appendChild(tr);
        }
    });

    // Update Report UI elements
    document.getElementById('pendingTasksCount').textContent = pendingCount;
    document.getElementById('completedTasksCount').textContent = completedCount;
    document.getElementById('overdueTasksCount').textContent = overdueCount;

    // Project Progress Percentage Calculation
    let progressPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;
    document.getElementById('progressPercentage').textContent = `${progressPercent}%`;
}

// Delete Task Function
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}