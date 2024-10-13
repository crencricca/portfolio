'use client'

import React from "react";
import todoStyles from "./todo.module.css";
import { Dosis } from "next/font/google";
import { chores, Item } from "../constants";

const bodyFont = Dosis({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});

export default function Chores() {
    const [newItem, setNewItem] = React.useState('');
    const [todoList, setTodoList] = React.useState(chores);

    const handleAddItem = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const copy = [...todoList];
            copy.push({
                checked: false,
                text: newItem,
                last_completed: undefined
            });
            setTodoList(copy.sort(a => a.checked ? 1 : -1));
            setNewItem('');
        }
    }

    const handleChecked = (item: Item) => {
        const copy = [...todoList];
        const checkedItem = copy.find(todo => todo.text === item.text);
        if (checkedItem) {
            if (!checkedItem.checked) {
                checkedItem.last_completed = new Date().toDateString();
            } else {
                checkedItem.last_completed = undefined;
            }
            checkedItem.checked = !checkedItem?.checked; 
        }
        copy.sort(a => a.checked ? 1 : -1);
        setTodoList(copy);
    }

    const handleRemoved = (item: Item) => {
        const copy = [...todoList];
        const checkedItem = copy.findIndex(todo => todo.text === item.text);
        if (checkedItem !== -1) {
            copy.splice(checkedItem, 1);
        }
        setTodoList(copy);
    }

    const renderListItem = (item: Item) => (
        <li key={item.text} className={todoStyles.listItem}>
            <div>
                <input className={todoStyles.checkbox} type="checkbox" checked={item.checked} onChange={() => handleChecked(item)} />
                <span className={item.checked ? todoStyles.completed : ''}>{item.text}</span>
                {item.last_completed 
                    ? <span className={todoStyles.date}>
                        <b>Last completed:</b> 
                        {new Date().toDateString()} 
                        </span>
                    : null
                }
            </div>
            <button className={todoStyles.remove} onClick={() => handleRemoved(item)}>X</button>
        </li>
    );

    return (
        <main className={todoStyles.main}>
            <h1 className={bodyFont.className}>Chores List</h1>
            <ul className={`${todoStyles.list} ${bodyFont.className}`}>
                {todoList.map(item => renderListItem(item))}
            </ul>
            <input className={todoStyles.addItem} placeholder="Add item..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={handleAddItem} />
        </main>
    )
}