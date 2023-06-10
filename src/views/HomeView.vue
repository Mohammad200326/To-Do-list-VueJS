<template>
  <div class="container">
    <h1 class="text-center mt-5">To-Do List</h1>
    <div class="logout-icon">
      Logout
      <i
        class="bi bi-box-arrow-right"
        style="padding: 5px; background-color: black; border-radius: 50%; color: white"
        @click="logout"
      ></i>
    </div>
    <form @submit.prevent="addTask" class="mt-4">
      <div class="input-group mb-3">
        <input v-model="task" type="text" class="form-control" placeholder="Enter a task" />
        <div class="input-group-append">
          <button class="btn btn-primary" type="submit">Add Task</button>
        </div>
      </div>
    </form>
    <div style="display: flex; justify-content: space-between; align-items: center;">
    <div class="filter-options mt-3">
      <label class="mr-2">Sort by:</label>
      <div class="btn-group" role="group">
        <button
          class="btn btn-secondary"
          :class="{ active: filterOption === 'created' }"
          @click="setFilterOption('created')"
        >
          Date Created
        </button>
        <button
          class="btn btn-secondary"
          :class="{ active: filterOption === 'done' }"
          @click="setFilterOption('done')"
        >
          Date Done
        </button>
        <button
          class="btn btn-secondary"
          :class="{ active: filterOption === 'rank' }"
          @click="setFilterOption('rank')"
        >
          User Rank
        </button>
      </div>
      </div>
        <label>Done Tasks Percentage: {{ doneTasksPercentage }}%</label>
        <div class="statistics">
        Average Completion per Day: {{ averageCompletionPerDay }} tasks
        </div>
    </div>
    <ul class="list-group">
      <li
        v-for="(item, index) in filteredTaskList"
        :key="index"
        :class="{ 'list-group-item': true, green: item.done, red: item.cancel, done: item.done }"
        style="display: flex; justify-content: space-between; align-items: center"
      >
        {{ index + 1 }}. {{ item.task }}
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px">
          <button class="btn btn-info btn-sm" @click="rankTask(index)" v-if= "!item.done">Rank</button>
          <button class="btn btn-primary btn-sm" @click="addSubTask(index)" v-if= "!item.done">Add</button>
          <button class="btn btn-success btn-sm" @click="doneTask(index)" v-if= "!item.done">Done</button>
          <button class="btn btn-warning btn-sm" @click="editTask(index)" v-if= "!item.done">Edit</button>
          <button class="btn btn-secondary btn-sm" @click="cancelTask(index)" v-if= "!item.done">Cancel</button>
          <button class="btn btn-danger btn-sm" @click="deleteTask(index)" v-if= "!item.done">Delete</button>
        </div>
        <ul v-if="item.subtasks" class="list-group mt-3">
          <li
            v-for="(subtask, subIndex) in item.subtasks"
            :key="subIndex"
            :class="{ 'list-group-item': true, green: subtask.done, red: subtask.cancel, done: subtask.done }"
          >
            {{ subIndex + 1 }}. {{ subtask.task }}
            <div
              style="display: flex; justify-content: space-between; align-items: center; gap: 15px"
            >
              <button class="btn btn-info btn-sm" @click="rankSubtask(index, subIndex)" v-if="!subtask.done">
                Rank
              </button>
              <button class="btn btn-success btn-sm" @click="doneSubtask(index, subIndex)" v-if="!subtask.done">
                Done
              </button>
              <button class="btn btn-warning btn-sm" @click="editSubtask(index, subIndex)" v-if="!subtask.done">
                Edit
              </button>
              <button class="btn btn-secondary btn-sm" @click="cancelSubtask(index, subIndex)" v-if="!subtask.done">
                Cancel
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteSubtask(index, subIndex)" v-if="!subtask.done">
                Delete
              </button>
            </div>
            <div v-if="subtask.createdDate">Created: {{ subtask.createdDate }}</div>
            <div v-if="subtask.done && subtask.completionDate">
              Completed: {{ subtask.completionDate }}
            </div>
          </li>
        </ul>
        <div v-if="item.createdDate">Created: {{ item.createdDate }}</div>
        <div v-if="item.done && item.completionDate">Completed: {{ item.completionDate }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      task: '',
      taskList: [],
      filterOption: 'rank' // Set the default filter option to 'rank'
    }
  },
  computed: {
    averageCompletionPerDay() {
    const completedTasks = this.taskList.filter(task => task.done);
    const totalDays = Math.ceil((Date.now() - this.startDate) / (1000 * 60 * 60 * 24));
    const average = completedTasks.length / totalDays;
    return isNaN(average) ? 0 : average.toFixed(2);
  },
    filteredTaskList() {
      const filter = this.filterOption
      let sortedTaskList = [...this.taskList]

      switch (filter) {
        case 'created':
          sortedTaskList = sortedTaskList.filter((task) => task.createdDate)
          sortedTaskList.sort((a, b) => {
            const dateA = new Date(a.createdDate)
            const dateB = new Date(b.createdDate)
            return dateA - dateB
          })
          break
        case 'done':
          sortedTaskList = sortedTaskList.filter((task) => task.done)
          sortedTaskList.sort((a, b) => {
            if (a.completionDate && b.completionDate) {
              console.log(new Date(a.completionDate) - new Date(b.completionDate))
              return new Date(a.completionDate) - new Date(b.completionDate)
            } else if (a.completionDate) {
              return -1
            } else if (b.completionDate) {
              return 1
            }
            return 0
          })
          break
        case 'rank':
        default:
          sortedTaskList.sort((a, b) => a.rank - b.rank)
          break
      }

      return sortedTaskList
    },
    doneTasksPercentage() {
      const totalTasks = this.taskList.length
      const doneTasks = this.taskList.filter((task) => task.done).length
      return totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(2) : 0
    }
  },
  methods: {
    addTask() {
      const task = this.task.trim()
      if (task !== '') {
        const currentDate = new Date().toLocaleString()
        this.taskList.push({
          task: task,
          done: false,
          cancel: false,
          subtasks: [],
          createdDate: currentDate
        })
        this.task = ''
      }
    },
    deleteTask(index) {
      this.taskList.splice(index, 1)
    },
    addSubTask(index) {
      const subtask = prompt('Enter the subtask:')
      if (subtask !== null) {
        const parentTask = this.taskList[index]
        if (!parentTask.subtasks) {
          parentTask.subtasks = []
        }
        parentTask.subtasks.push({
          task: subtask.trim(),
          done: false,
          cancel: false,
          createdDate: new Date().toLocaleString()
        })
      }
    },
    doneTask(index) {
      const task = this.taskList[index]
      if (!task.cancel) {
        task.done = !task.done
        if (task.done) {
          task.completionDate = new Date().toLocaleString()
          task.subtasks.forEach((subtask) => {
            subtask.done = true
            subtask.completionDate = task.completionDate
          })
        } else {
          task.subtasks.forEach((subtask) => {
            subtask.done = false
            delete subtask.completionDate
          })
          delete task.completionDate
        }
      }
    },
    editTask(index) {
      const editedTask = prompt('Enter the new task:', this.taskList[index].task)
      if (editedTask !== null) {
        this.taskList[index].task = editedTask.trim()
      }
    },
    cancelTask(index) {
      const task = this.taskList[index]
      if (!task.done) {
        task.cancel = !task.cancel
        if (task.cancel) {
          task.subtasks.forEach((subtask) => {
            subtask.cancel = true
          })
        } else {
          task.subtasks.forEach((subtask) => {
            subtask.cancel = false
          })
        }
      }
    },
    rankTask(index) {
      const newPosition = prompt('Enter the new position (1-' + this.taskList.length + '):')
      if (newPosition !== null) {
        const newPos = parseInt(newPosition) - 1
        if (newPos >= 0 && newPos < this.taskList.length) {
          const taskToReplace = this.taskList[newPos]
          this.taskList[newPos] = this.taskList[index]
          this.taskList[index] = taskToReplace
        } else {
          alert('Invalid position')
        }
      }
    },
    doneSubtask(taskIndex, subtaskIndex) {
      const subtask = this.taskList[taskIndex].subtasks[subtaskIndex]
      if(!subtask.cancel) {
        subtask.done = !subtask.done
        
        if (subtask.done) {
          subtask.completionDate = new Date().toLocaleString()
        } else {
          delete subtask.completionDate
        }
        
        const parentTask = this.taskList[taskIndex]
        parentTask.done = parentTask.subtasks.every((subtask) => subtask.done)
        if (parentTask.done) {
          parentTask.completionDate = subtask.completionDate
        } else {
          delete parentTask.completionDate
        }
      }
      },
    editSubtask(taskIndex, subtaskIndex) {
      const editedSubtask = prompt(
        'Enter the new subtask:',
        this.taskList[taskIndex].subtasks[subtaskIndex].task
      )
      if (editedSubtask !== null) {
        this.taskList[taskIndex].subtasks[subtaskIndex].task = editedSubtask.trim()
      }
    },
    cancelSubtask(taskIndex, subtaskIndex) {
      const subtask = this.taskList[taskIndex].subtasks[subtaskIndex]
      if(!subtask.done) {
        subtask.cancel = !subtask.cancel
        
        const parentTask = this.taskList[taskIndex]
        parentTask.cancel = parentTask.subtasks.every((subtask) => subtask.cancel)
      }
      },
      deleteSubtask(taskIndex, subtaskIndex) {
        this.taskList[taskIndex].subtasks.splice(subtaskIndex, 1)
      },
    rankSubtask(taskIndex, subtaskIndex) {
      const newPosition = prompt(
        'Enter the new position (1-' + this.taskList[taskIndex].subtasks.length + '):'
      )
      if (newPosition !== null) {
        const newIndex = parseInt(newPosition) - 1
        if (
          !isNaN(newIndex) &&
          newIndex >= 0 &&
          newIndex < this.taskList[taskIndex].subtasks.length
        ) {
          const subtaskToReplace = this.taskList[taskIndex].subtasks[newIndex]
          this.taskList[taskIndex].subtasks[newIndex] =
            this.taskList[taskIndex].subtasks[subtaskIndex]
          this.taskList[taskIndex].subtasks[subtaskIndex] = subtaskToReplace
        }
      }
    },

    setFilterOption(option) {
      this.filterOption = option
    },
    logout() {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.green {
  background-color: lightgreen;
}
.red {
  background-color: lightcoral;
}
.filter-options {
  display: flex;
  align-items: center;
}
.filter-options label {
  margin-right: 10px;
}

.btn.active {
  background-color: #007bff;
  color: #fff;
}
</style>
