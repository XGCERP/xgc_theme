# Step-by-Step: Develop Custom Frappe App with Kiro

This guide walks you through developing and testing a custom Frappe app using Kiro IDE.

---

## Understanding the Setup

### Your Mac Paths
```
/Users/dzb/Dev/docker-frappe/                    # Main project folder
├── frappe_docker/.devcontainer/                 # Docker config (don't touch)
├── FRAPPE_SETUP_GUIDE.md                        # Setup documentation
└── (your custom apps will be separate folders)
```

### Inside Docker Container
```
/workspace/development/frappe-bench/             # Frappe bench
├── apps/                                        # All apps go here
│   ├── frappe/                                  # Core Frappe
│   ├── erpnext/                                 # ERPNext
│   └── your_custom_app/                         # Your app (after install)
└── sites/
    └── dev.localhost/                           # Your test site
```

---

## Step 1: Create Your Custom App

### Option A: Create New App in Kiro

```bash
# 1. Open Terminal in Kiro
# 2. Navigate to your Dev folder
cd /Users/dzb/Dev

# 3. Create a new Frappe app using the container
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench new-app my_custom_app"

# 4. Copy the generated app to your Mac
docker cp devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app /Users/dzb/Dev/my_custom_app

# 5. Open the app folder in Kiro
# File > Open Folder > /Users/dzb/Dev/my_custom_app
```

### Option B: Use Existing App

```bash
# If you already have a custom app
# Just open it in Kiro:
# File > Open Folder > /Users/dzb/Dev/your_existing_app
```

---

## Step 2: Develop Your App in Kiro

### Open Your App in Kiro

1. **Open Kiro IDE**
2. **File → Open Folder**
3. **Select**: `/Users/dzb/Dev/my_custom_app`

### Use Kiro AI to Build Features

Ask Kiro to help you:

```
"Create a new DocType called 'Task Manager' with these fields:
- task_name (Data)
- description (Text Editor)
- due_date (Date)
- status (Select: Open, In Progress, Completed)
- priority (Select: Low, Medium, High)"
```

```
"Add a Python method to calculate overdue tasks"
```

```
"Create a client script to show an alert when priority is set to High"
```

### Your App Structure

```
my_custom_app/
├── my_custom_app/
│   ├── __init__.py
│   ├── hooks.py                    # App configuration
│   ├── modules.txt                 # Modules list
│   ├── my_module/                  # Your module
│   │   ├── doctype/                # DocTypes
│   │   │   └── task_manager/       # Your DocType
│   │   │       ├── task_manager.py
│   │   │       ├── task_manager.js
│   │   │       └── task_manager.json
│   │   └── __init__.py
│   └── public/                     # Static files
├── setup.py
└── README.md
```

---

## Step 3: Install Your App in Docker

### First Time Installation

```bash
# 1. Copy your app to Docker container
docker cp /Users/dzb/Dev/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/

# 2. Install the app on your site
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost install-app my_custom_app"
```

**Expected Output:**
```
Installing my_custom_app...
Updating DocTypes for my_custom_app: [========================================] 100%
```

---

## Step 4: Start the Development Server

```bash
# Start the Frappe server
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench start"
```

**You'll see:**
```
14:30:45 web.1           | * Running on http://0.0.0.0:8000
14:30:45 socketio.1      | * Running on http://0.0.0.0:9000
14:30:45 watch.1         | Watching for changes...
```

**Access your app:**
- Open browser: **http://localhost:8000**
- Login: **Administrator** / **admin**

---

## Step 5: Test Your App

### Access Your DocType

1. Go to http://localhost:8000
2. Login with Administrator / admin
3. Search for your DocType (e.g., "Task Manager")
4. Create a new document
5. Test all fields and functionality

### Check Logs

```bash
# View live logs
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && tail -f logs/bench-start.log"
```

---

## Step 6: Make Changes and Update

### When You Edit Files in Kiro

**After making changes in Kiro:**

```bash
# 1. Sync your changes to Docker
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/

# 2. Clear cache
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost clear-cache"

# 3. If you changed JS/CSS, rebuild
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench build --app my_custom_app"

# 4. If you changed DocType JSON, migrate
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost migrate"
```

### Quick Sync Command (Use This Most Often)

```bash
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/ && docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost clear-cache"
```

**Then refresh your browser (Cmd+R or Ctrl+R)**

---

## Step 7: Run Tests

### Create Tests in Kiro

Ask Kiro:
```
"Create a test case for Task Manager DocType that tests:
1. Creating a new task
2. Updating task status
3. Checking overdue tasks"
```

### Run Tests

```bash
# Run all tests for your app
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost run-tests --app my_custom_app"

# Run specific test file
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost run-tests --app my_custom_app --module my_custom_app.my_module.doctype.task_manager.test_task_manager"
```

---

## Complete Example Workflow

### Scenario: Add a New Field to Task Manager

**Step 1: Edit in Kiro**
```
1. Open /Users/dzb/Dev/my_custom_app in Kiro
2. Ask Kiro: "Add a new field 'assigned_to' (Link to User) in Task Manager DocType"
3. Kiro will update the JSON file
4. Save the changes (Cmd+S)
```

**Step 2: Sync to Docker**
```bash
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/
```

**Step 3: Run Migration**
```bash
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost migrate"
```

**Step 4: Clear Cache**
```bash
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost clear-cache"
```

**Step 5: Test**
```
1. Refresh browser (Cmd+R)
2. Open Task Manager
3. Create new task
4. Verify "Assigned To" field appears
```

---

## Common Tasks

### Add a New DocType

**In Kiro:**
```
Ask: "Create a new DocType called 'Project' with fields for project name, start date, end date, and status"
```

**Sync and Migrate:**
```bash
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/ && docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost migrate && bench --site dev.localhost clear-cache"
```

### Add a Server Script (Python)

**In Kiro:**
```
Ask: "Add a Python method in Task Manager to send email notification when status changes to Completed"
```

**Sync:**
```bash
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/ && docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost clear-cache"
```

### Add Client Script (JavaScript)

**In Kiro:**
```
Ask: "Add a client script to Task Manager that auto-fills due_date with 7 days from today when creating a new task"
```

**Sync and Rebuild:**
```bash
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/ && docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench build --app my_custom_app && bench --site dev.localhost clear-cache"
```

### Create a Report

**In Kiro:**
```
Ask: "Create a report called 'Overdue Tasks' that shows all tasks where due_date is past and status is not Completed"
```

**Sync and Migrate:**
```bash
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/ && docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost migrate && bench --site dev.localhost clear-cache"
```

---

## Troubleshooting

### App Not Showing Up

```bash
# Check if app is installed
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost list-apps"

# Should show:
# frappe
# erpnext
# my_custom_app
```

### Changes Not Reflecting

```bash
# Nuclear option - clear everything
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost clear-cache && bench --site dev.localhost clear-website-cache && bench build --app my_custom_app"

# Then hard refresh browser (Cmd+Shift+R)
```

### Permission Errors

```bash
# Fix permissions inside container
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && chown -R frappe:frappe apps/my_custom_app"
```

### Server Not Starting

```bash
# Check if containers are running
docker ps

# Restart containers if needed
cd /Users/dzb/Dev/docker-frappe/frappe_docker/.devcontainer
docker compose down
docker compose up -d

# Wait 30 seconds, then start bench
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench start"
```

### See Error Details

```bash
# View detailed logs
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && cat logs/dev.localhost.log"

# View last 50 lines
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && tail -50 logs/dev.localhost.log"
```

---

## Quick Reference Commands

### Daily Development Commands

```bash
# 1. Start server (do this once per day)
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench start"

# 2. Sync changes (after editing in Kiro)
docker cp /Users/dzb/Dev/my_custom_app/my_custom_app devcontainer-frappe-1:/workspace/development/frappe-bench/apps/my_custom_app/ && docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost clear-cache"

# 3. Migrate (after changing DocType structure)
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost migrate"

# 4. Rebuild (after changing JS/CSS)
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench build --app my_custom_app"

# 5. Run tests
docker exec -it devcontainer-frappe-1 bash -c "cd frappe-bench && bench --site dev.localhost run-tests --app my_custom_app"
```

### Path Reference

| Description | Path |
|-------------|------|
| Your app in Kiro | `/Users/dzb/Dev/my_custom_app` |
| Docker config | `/Users/dzb/Dev/docker-frappe/frappe_docker/.devcontainer` |
| App in container | `/workspace/development/frappe-bench/apps/my_custom_app` |
| Frappe bench | `/workspace/development/frappe-bench` |
| Site folder | `/workspace/development/frappe-bench/sites/dev.localhost` |

---

## Tips for Using Kiro

### Ask Kiro for Help

```
"Show me the structure of a Frappe DocType JSON file"

"Create a custom button in Task Manager that marks all tasks as completed"

"Write a scheduled job that runs daily and sends overdue task reminders"

"Add validation to prevent setting due_date in the past"

"Create a dashboard showing task statistics"

"Write a REST API endpoint to get all tasks for a user"
```

### Use Kiro's Context

When asking Kiro for help, provide context:

```
"In my Task Manager DocType (my_custom_app/my_module/doctype/task_manager/), 
add a method to calculate the number of days until due date"
```

### Let Kiro Write Tests

```
"Create comprehensive tests for Task Manager that cover:
- Creating tasks
- Updating status
- Validation rules
- Overdue task calculation"
```

---

## Next Steps

1. **Create your first custom app** following Step 1
2. **Open it in Kiro** and start developing
3. **Use the sync command** after each change
4. **Test in browser** at http://localhost:8000
5. **Iterate quickly** with Kiro's AI assistance

---

## Need Help?

### Check Container Status
```bash
docker ps
```

### View Container Logs
```bash
docker logs devcontainer-frappe-1
```

### Access Container Shell
```bash
docker exec -it devcontainer-frappe-1 bash
```

### Restart Everything
```bash
cd /Users/dzb/Dev/docker-frappe/frappe_docker/.devcontainer
docker compose restart
```

---

**Happy Coding with Kiro! 🚀**
