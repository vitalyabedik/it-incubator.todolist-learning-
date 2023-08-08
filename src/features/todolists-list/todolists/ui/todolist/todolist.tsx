import React, { useCallback } from "react"

import { AddItemForm } from "common/components/addItemForm"
import { TodolistDomainType, todolistsThunks } from "features/todolists-list/todolists/model/todolists.reducer"
import { TaskDomainType, tasksThunks } from "features/todolists-list/tasks/model/tasks.reducer"
import { useActions } from "common/hooks"
import { FilterTasksButtons } from "features/todolists-list/todolists/ui/todolist/filter-tasks-buttons/filter-tasks-buttons"
import { Tasks } from "features/todolists-list/todolists/ui/todolist/tasks"
import { TodolistTitle } from "features/todolists-list/todolists/ui/todolist/todolist-title/todolist-title"

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskDomainType>
}

export const Todolist: React.FC<PropsType> = React.memo(({ todolist, tasks }) => {
  const { addTask } = useActions({ ...todolistsThunks, ...tasksThunks })

  const addTaskHandler = useCallback((title: string) => addTask({ todolistId: todolist.id, title }), [])

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm disabled={todolist.entityStatus === "loading"} addItem={addTaskHandler} />
      <Tasks todolist={todolist} tasks={tasks} />
      <div style={{ padding: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
