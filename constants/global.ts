import { LANG } from "@/localization/constants";

export const DEFAULT_PIN = '0000'
export const DEFAULT_LANG = LANG.EN
export const DEFAULT_SPPECH_SPEED = 100

export const DEFAULT_STARTER_BOARD = {
    groups: [
        {
            title: 'Actions',
            color: '#63a845',
            lists: [
                [
                    {
                        title: 'I want',
                        image: null,
                        color: null,
                        order: 0,
                    },
                    {
                        title: 'I need',
                        image: null,
                        color: null,
                        order: 1,
                    }
                ],
                [
                    {
                        title: 'I dont want',
                        image: null,
                        color: null,
                        order: 0,
                    },
                ],
                []
            ]
        },
        {
            title: 'Group 1',
            color: '#65a8c7',
            lists: [
                [
                    {
                        title: 'Apple',
                        image: null,
                        color: null,
                        order: 0,
                    },
                    
                ],
                [],
                []
            ]
        },
    ]
}