export const LESSONS: string[] = [
  "asdf jkl; asdf jkl; asdf jkl;",
  "the quick brown fox jumps over the lazy dog",
  "a good programmer is someone who always looks both ways before crossing a one-way street",
  "in the midst of chaos, there is also opportunity",
  "the journey of a thousand miles begins with a single step",
];

export const KEYBOARD_LAYOUT: string[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  [' ', ' ', ' ', 'Space', ' ', ' ', ' '],
];

export const KEY_TO_FINGER_MAP: { [key: string]: string } = {
  // Left Hand
  '`': 'left pinky', '1': 'left pinky', 'q': 'left pinky', 'a': 'left pinky', 'z': 'left pinky',
  '2': 'left ring', 'w': 'left ring', 's': 'left ring', 'x': 'left ring',
  '3': 'left middle', 'e': 'left middle', 'd': 'left middle', 'c': 'left middle',
  '4': 'left index', 'r': 'left index', 'f': 'left index', 'v': 'left index',
  '5': 'left index', 't': 'left index', 'g': 'left index', 'b': 'left index',
  // Right Hand
  '6': 'right index', 'y': 'right index', 'h': 'right index', 'n': 'right index',
  '7': 'right index', 'u': 'right index', 'j': 'right index', 'm': 'right index',
  '8': 'right middle', 'i': 'right middle', 'k': 'right middle', ',': 'right middle',
  '9': 'right ring', 'o': 'right ring', 'l': 'right ring', '.': 'right ring',
  '0': 'right pinky', 'p': 'right pinky', ';': 'right pinky', '/': 'right pinky',
  '-': 'right pinky', '[': 'right pinky', "'": 'right pinky',
  '=': 'right pinky', ']': 'right pinky', '\\': 'right pinky',
  ' ': 'thumb',
};