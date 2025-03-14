import { KeyboardLayout } from "@contexts/SettingsContext";

const qwertyToAzerty = {
    'KeyA': 'KeyQ',
    'KeyB': 'KeyP',
    'KeyC': 'KeyC',
    'KeyD': 'KeyD',
    'KeyE': 'KeyE',
    'KeyF': 'KeyF',
    'KeyG': 'KeyG',
    'KeyH': 'KeyH',
    'KeyI': 'KeyI',
    'KeyJ': 'KeyJ',
    'KeyK': 'KeyK',
    'KeyL': 'KeyL',
    'KeyM': 'KeyM',
    'KeyN': 'KeyN',
    'KeyO': 'KeyO',
    'KeyP': 'KeyB',
    'KeyQ': 'KeyA',
    'KeyR': 'KeyR',
    'KeyS': 'KeyS',
    'KeyT': 'KeyT',
    'KeyU': 'KeyU',
    'KeyV': 'KeyV',
    'KeyW': 'KeyW',
    'KeyX': 'KeyX',
    'KeyY': 'KeyY',
    'KeyZ': 'KeyZ',
    'Digit0': 'Digit0',
    'Digit1': 'Digit1',
    'Digit2': 'Digit2',
    'Digit3': 'Digit3',
    'Digit4': 'Digit4',
    'Digit5': 'Digit5',
    'Digit6': 'Digit6',
    'Digit7': 'Digit7',
    'Digit8': 'Digit8',
    'Digit9': 'Digit9',
}


export const keyboardCodeAdapter = (code: string, layout: KeyboardLayout) => {
    switch (layout) {
        case KeyboardLayout.QWERTY:
            return code;
        case KeyboardLayout.AZERTY:
            return qwertyToAzerty[code as keyof typeof qwertyToAzerty];
    }
}
