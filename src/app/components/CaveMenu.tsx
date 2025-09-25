'use client'

import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
    InformationCircleIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { Settings } from 'lucide-react';

const menuSections = [
    {
        title: 'Cave',
        items: [
            { name: 'Infos de la cave', href: '/cave/info', icon: InformationCircleIcon },
            // { name: 'Modifier cave', href: '/cave/info', icon: PencilSquareIcon },
        ],
    },
    // {
    //     title: 'Membres',
    //     items: [
    //         { name: 'Ajouter un membre', href: '#', icon: UserPlusIcon },
    //         { name: 'Gérer les membres', href: '#', icon: UsersIcon },
    //     ],
    // },
    {
        title: 'Compte',
        items: [
            { name: 'Déconnexion', href: '/logout', icon: ArrowLeftOnRectangleIcon },
        ],
    },
]

export default function CaveMenu() {
    return (
        <Popover className="relative">
            <Popover.Button
                className="inline-flex items-center gap-x-2 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-600 transition cursor-pointer">
                <Settings/>

                <span className="ml-1 hidden sm:flex">Ma Cave
                </span>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute right-0 mt-2 w-64 rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="divide-y divide-gray-700">
                        {menuSections.map((section) => (
                            <div key={section.title} className="p-2">
                                <h3 className="px-3 py-1 text-gray-400 text-xs uppercase font-semibold">{section.title}</h3>
                                {section.items.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-x-3 rounded-md px-3 py-2 text-white hover:bg-gray-700 transition"
                                    >
                                        <item.icon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                                        <span>{item.name}</span>
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
