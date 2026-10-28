export type Item = {
    checked: boolean,
    text: string,
    last_completed?: string,
}

export const chores: Item[] = [
    {
        checked: false,
        text: 'Do Laundry',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Make the Bed',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Clean Dining Table',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Sweep Floor',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Vacuum Floor',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Swiffer Floor',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Clean and Sweep Bathroom',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Clean Kitchen Surfaces',
        last_completed: undefined
    },
    {
        checked: false,
        text: 'Do the Dishes',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Dust Surfaces',
        last_completed: undefined,
    },
    {
        checked: false,
        text: 'Water Plants',
        last_completed: undefined,
    }
]