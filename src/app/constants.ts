export const tagline = "Software engineer with a UX obsession.";
export const bio = "Currently based in NYC as a UI platform engineer at Ridgeline since August 2022. Passionate about crafting intuitive, innovative web solutions for real-world problems.";

export type Item = {
    checked: boolean,
    text: string,
    last_completed?: string,
}

export const chores: Item[] = [
    {
        checked: false,
        text: 'Find Gifts',
        last_completed: undefined
    },
    {
        checked: false,
        text: 'Foster Dogs',
        last_completed: undefined
    },
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