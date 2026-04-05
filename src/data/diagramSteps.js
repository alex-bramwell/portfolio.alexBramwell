// Step definitions for interactive diagrams.
// Each step: { show: [selectors], highlight: [selectors], text: "explanation" }
// show = which CSS classes become visible. highlight = which get a pulse glow.

const S = { T: ".idg-title", I: ".idg-input", A: ".idg-arrow", P: ".idg-process", O: ".idg-output", N: ".idg-note" };

// ===== JS ESSENTIALS =====

export const mapSteps = [
  { show: [S.T], highlight: [S.T], text: "We are going to use .map(), which takes an array and transforms every item inside it." },
  { show: [S.T, S.I], highlight: [S.I], text: "Here is the input array: [1, 2, 3, 4]. Each number will be processed one by one." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.P], text: "Each number passes through the function n * 2. The original array is never changed." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "The result is a brand new array: [2, 4, 6, 8]. Every item was doubled." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [], text: null },
];

export const filterSteps = [
  { show: [S.T], highlight: [S.T], text: ".filter() tests each item and keeps only the ones that pass." },
  { show: [S.T, S.I], highlight: [S.I], text: "The input is four words: \"hello\", \"hi\", \"hey\", \"howdy\"." },
  { show: [S.T, S.I, S.P], highlight: [S.P], text: "The test is: is the word 3 characters or fewer? \"hello\" (5) and \"howdy\" (5) fail. They get crossed out." },
  { show: [S.T, S.I, S.P, S.A], highlight: [S.A], text: "\"hi\" (2) and \"hey\" (3) pass the test, so they flow through to the output." },
  { show: [S.T, S.I, S.P, S.A, S.O], highlight: [S.O], text: "The result is a new array with only the items that passed: [\"hi\", \"hey\"]." },
];

export const findSteps = [
  { show: [S.T], highlight: [S.T], text: ".find() scans through an array and returns the first item that matches." },
  { show: [S.T, S.I], highlight: [S.I], text: "We have two objects in the array. We are looking for the one where name is \"Sam\"." },
  { show: [S.T, S.I, S.P], highlight: [S.P], text: "The first item (Alex) does not match, so it gets skipped." },
  { show: [S.T, S.I, S.P, S.A, S.O], highlight: [S.O], text: "The second item (Sam) matches. .find() stops immediately and returns it. It does not check the rest." },
];

export const spreadSteps = [
  { show: [S.T], highlight: [S.T], text: "The spread operator (...) copies properties from one object into a new one." },
  { show: [S.T, S.I], highlight: [S.I], text: "We start with the original object: { name: \"Alex\", age: 39 }." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.A, S.P], text: "The ... copies every property into the new object. Then age: 40 overrides the copied value." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "The result is a new object with age updated to 40. The original object is untouched." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [], text: null },
];

export const destructureSteps = [
  { show: [S.T], highlight: [S.T], text: "Destructuring pulls specific values out of an object into their own variables." },
  { show: [S.T, S.I], highlight: [S.I], text: "The user object has three properties: name, age, and role." },
  { show: [S.T, S.I, S.A], highlight: [S.A], text: "We only want name and role, so destructuring extracts just those two." },
  { show: [S.T, S.I, S.A, S.O], highlight: [S.O], text: "Now name and role are standalone variables. The age property stays in the object, untouched." },
  { show: [S.T, S.I, S.A, S.O, S.N], highlight: [S.N], text: "You do not have to extract everything. Only take what you need." },
];

export const functionSteps = [
  { show: [S.T], highlight: [S.T], text: "A function takes inputs, processes them, and returns an output." },
  { show: [S.T, S.I], highlight: [S.I], text: "The inputs are called parameters. Here we pass 5 as 'a' and 3 as 'b'." },
  { show: [S.T, S.I, S.A], highlight: [S.A], text: "The values flow into the function through the parameter names." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.P], text: "Inside the function, a + b is calculated. 5 + 3 = 8." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "The return keyword sends 8 back to wherever the function was called." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [], text: null },
];

export const variablesSteps = [
  { show: [S.T], highlight: [S.T], text: "JavaScript has two main ways to create variables: let and const." },
  { show: [S.T, S.I], highlight: [S.I], text: "Both start with a keyword, a name, and a value." },
  { show: [S.T, S.I, S.O], highlight: [S.O], text: "let allows you to change the value later. score starts at 0 and is reassigned to 10." },
  { show: [S.T, S.I, S.O, S.P], highlight: [S.P], text: "const does not allow reassignment. Trying to change name from \"Alex\" to \"Sam\" throws an error." },
  { show: [S.T, S.I, S.O, S.P, S.N], highlight: [], text: "Use const by default. Only use let when you know the value needs to change." },
];

export const conditionalSteps = [
  { show: [S.T], highlight: [S.T], text: "An if/else statement checks a condition and runs different code depending on the result." },
  { show: [S.T, S.I], highlight: [S.I], text: "The condition is: is age greater than or equal to 18?" },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.P], text: "The code follows one of two paths: true (left) or false (right)." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "Since age is 39, the condition is true, so the result is \"Adult\". The \"Minor\" path is ignored." },
];

// ===== JS TO REACT =====

export const imperativeSteps = [
  { show: [S.T], highlight: [S.T], text: "JavaScript and React take different approaches to updating the page." },
  { show: [S.T, S.I], highlight: [S.I], text: "Vanilla JS is imperative: you manually find an element, read its value, and change the DOM step by step." },
  { show: [S.T, S.I, S.O], highlight: [S.O], text: "React is declarative: you set state, and React figures out what to change in the DOM for you." },
  { show: [S.T, S.I, S.O, S.P], highlight: [S.P], text: "The key word is \"automatically\". You describe the result, React handles the work." },
  { show: [S.T, S.I, S.O, S.P, S.N], highlight: [], text: null },
];

export const eventSteps = [
  { show: [S.T], highlight: [S.T], text: "Both approaches handle click events, but in different ways." },
  { show: [S.T, S.I], highlight: [S.I], text: "In vanilla JS, you first find the element with querySelector, then attach a listener. Two separate steps." },
  { show: [S.T, S.I, S.O], highlight: [S.O], text: "In React, the handler lives directly on the element as an onClick prop. One step, right where you can see it." },
  { show: [S.T, S.I, S.O, S.P, S.N], highlight: [S.P], text: "The React approach is simpler because the event and the element are never separated." },
];

export const listRenderSteps = [
  { show: [S.T], highlight: [S.T], text: "Rendering a list in React uses the .map() array method inside JSX." },
  { show: [S.T, S.I], highlight: [S.I], text: "We start with an array of strings: [\"Apple\", \"Banana\", \"Cherry\"]." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.P], text: "The .map() method transforms each string into a JSX element." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "Each array item becomes an <li> element. React renders them as a list." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [], text: null },
];

export const conditionalRenderSteps = [
  { show: [S.T], highlight: [S.T], text: "In React, state controls what appears on screen." },
  { show: [S.T, S.I], highlight: [S.I], text: "isOpen is a piece of state that holds true or false." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.P], text: "React checks the value. True goes left, false goes right." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "When true, the <Panel /> component renders. When false, nothing appears. The component is literally removed from the page." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [], text: null },
];

// ===== REACT CONCEPTS =====

export const propsSteps = [
  { show: [S.T], highlight: [S.T], text: "Props are how a parent component sends data to its children." },
  { show: [S.T, S.I], highlight: [S.I], text: "The <App /> component is the parent. It owns the data." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.A, S.P], text: "It passes name=\"Alex\" to <Header /> and items={[]} to <List />. These are props." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "Each child receives the data and uses it to render. The children cannot send props back up." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [S.N], text: "This one-way flow makes it easy to trace where any piece of data comes from." },
];

export const stateSteps = [
  { show: [S.T], highlight: [S.T], text: "State is data that lives inside a component and triggers a re-render when it changes." },
  { show: [S.T, S.I], highlight: [S.I], text: "The component starts with state = 0. The screen shows \"Count: 0\"." },
  { show: [S.T, S.I, S.P], highlight: [S.P], text: "The user clicks a button. This triggers an event." },
  { show: [S.T, S.I, S.P, S.A, S.O], highlight: [S.O], text: "setState(1) is called. React updates the state value to 1." },
  { show: [S.T, S.I, S.P, S.A, S.O, S.N], highlight: [S.A], text: "React re-renders the component with the new value. The screen now shows \"Count: 1\". The cycle repeats on every click." },
];

export const useEffectSteps = [
  { show: [S.T], highlight: [S.T], text: "useEffect runs code after your component has rendered and the browser has painted." },
  { show: [S.T, S.I, S.A], highlight: [S.I], text: "First, the component renders. Then the browser paints the result to the screen." },
  { show: [S.T, S.I, S.A, S.O], highlight: [S.O], text: "After the paint, the effect runs. This is where you fetch data, start timers, or update the document title." },
  { show: [S.T, S.I, S.A, S.O, S.P], highlight: [S.P], text: "The dependency array controls when the effect re-runs. An empty array means only once. A value like [count] means whenever count changes." },
  { show: [S.T, S.I, S.A, S.O, S.P, S.N], highlight: [], text: null },
];

export const keysSteps = [
  { show: [S.T], highlight: [S.T], text: "When you render a list, each item needs a unique key so React can track it." },
  { show: [S.T, S.I], highlight: [S.I], text: "The list starts with items A, B, C in that order. Each has a unique key." },
  { show: [S.T, S.I, S.A], highlight: [S.A], text: "The list gets reordered. A and B swap positions. The dashed lines show React tracking which item is which using keys." },
  { show: [S.T, S.I, S.A, S.O], highlight: [S.O], text: "The result is B, A, C. Because React knows the keys, it moves the existing elements instead of destroying and rebuilding them." },
  { show: [S.T, S.I, S.A, S.O, S.N], highlight: [S.N], text: "Without keys, React would rebuild every item from scratch on every change. Keys make list updates fast and correct." },
];

// ===== SCSS =====

export const nestingSteps = [
  { show: [S.T], highlight: [S.T], text: "SCSS lets you nest selectors inside each other, mirroring your HTML structure." },
  { show: [S.T, S.I], highlight: [S.I], text: "On the left, .card contains .card-title, which contains &:hover. The nesting shows the relationship." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.A, S.P], text: "When SCSS compiles, it flattens the nesting into standard CSS selectors." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "The output is three flat selectors: .card, .card .card-title, and .card .card-title:hover." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [S.N], text: "Nesting keeps your SCSS organised. The browser sees normal CSS." },
];

export const mixinSteps = [
  { show: [S.T], highlight: [S.T], text: "A mixin is a reusable block of styles you define once and include anywhere." },
  { show: [S.T, S.I], highlight: [S.I], text: "Here we define @mixin flex-center with three centering properties." },
  { show: [S.T, S.I, S.A], highlight: [S.A], text: "The mixin is included in two different selectors using @include." },
  { show: [S.T, S.I, S.A, S.O, S.P], highlight: [S.O], text: "Both .hero and .modal get the same centering styles injected. No copy-pasting needed." },
  { show: [S.T, S.I, S.A, S.O, S.P, S.N], highlight: [], text: null },
];

export const partialsSteps = [
  { show: [S.T], highlight: [S.T], text: "SCSS partials split your styles across multiple files for organisation." },
  { show: [S.T, S.I], highlight: [S.I], text: "Each partial handles one concern: _variables for tokens, _base for resets, _shared for utilities." },
  { show: [S.T, S.I, S.A], highlight: [S.A], text: "All partials flow into one entry file using @use imports." },
  { show: [S.T, S.I, S.A, S.O], highlight: [S.O], text: "main.scss combines everything into a single stylesheet that the browser loads." },
  { show: [S.T, S.I, S.A, S.O, S.N], highlight: [], text: null },
];

// ===== ACCESSIBILITY =====

export const semanticSteps = [
  { show: [S.T], highlight: [S.T], text: "Semantic HTML elements come with built-in accessibility features. Generic divs do not." },
  { show: [S.T, S.I], highlight: [S.I], text: "A <div onclick> looks like a button visually, but screen readers do not announce it, keyboards cannot activate it, and it has no focus state. You must build all of that yourself." },
  { show: [S.T, S.I, S.O], highlight: [S.O], text: "A <button> gives you all of that for free: keyboard support (Enter and Space), screen reader announcement, and focus management." },
  { show: [S.T, S.I, S.O, S.P], highlight: [S.P], text: "The lesson: always use the right HTML element. The accessibility comes built in." },
];

export const contrastSteps = [
  { show: [S.T], highlight: [S.T], text: "Text needs enough contrast against its background to be readable by everyone." },
  { show: [S.T, S.I], highlight: [S.I], text: "Light grey text on a white background has a ratio of 2.3:1. This fails WCAG AA, which requires at least 4.5:1." },
  { show: [S.T, S.I, S.O], highlight: [S.O], text: "Light text on a dark background has a ratio of 18.1:1. This passes easily." },
  { show: [S.T, S.I, S.O, S.P], highlight: [S.P], text: "Always check your contrast ratios. Browser dev tools show the ratio in the colour picker." },
];

export const focusSteps = [
  { show: [S.T], highlight: [S.T], text: "Keyboard users navigate by pressing Tab to move between interactive elements." },
  { show: [S.T, S.I], highlight: [S.I], text: "Tab moves focus from one element to the next: Logo, Nav link, then onwards." },
  { show: [S.T, S.I, S.A, S.P], highlight: [S.A, S.P], text: "Each Tab press moves focus forward. The \"Tab\" labels show the key press between elements." },
  { show: [S.T, S.I, S.A, S.P, S.O], highlight: [S.O], text: "The currently focused element (Button) gets a visible outline. This is :focus-visible. Never remove it without providing an alternative." },
  { show: [S.T, S.I, S.A, S.P, S.O, S.N], highlight: [], text: null },
];
