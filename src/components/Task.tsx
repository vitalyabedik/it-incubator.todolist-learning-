import React, {ChangeEvent, useCallback} from 'react';
import styles from './Todolist.module.css';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import {TaskType} from './Todolist';

type TaskPropsType = {
    task: TaskType
    todolistId: string
    removeTask: (todolistId: string, id: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, taskStatus: boolean) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {
    console.log('Task is called')
    const removeTaskHandler = useCallback(() => {
        props.removeTask(props.todolistId, props.task.id)
    }, [props.todolistId, props.task.id])

    const onChangeCheckboxHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.todolistId, props.task.id, e.currentTarget.checked)
    }, [props.todolistId, props.task.id])

    const onChangeTitleHandler = useCallback((newTitle: string) => {
        props.changeTaskTitle(props.todolistId, props.task.id, newTitle)
    }, [props.todolistId, props.task.id])

    const taskStatusClasses = props.task.isDone ? styles.isDone : ''

    return (
        <div key={props.task.id} className={taskStatusClasses}>
            <Checkbox onChange={onChangeCheckboxHandler}
                      checked={props.task.isDone}
            />
            <EditableSpan onChange={onChangeTitleHandler} title={props.task.title}/>
            <IconButton onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
});
