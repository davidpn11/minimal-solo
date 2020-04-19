export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    return state;
  } catch (error) {
    return undefined;
  }
};

// export const saveState = (state) => {
//   try {
//     const newState = { todos: state.todos };
//     const serializedState = JSON.stringify(newState);
//     localStorage.setItem("state", serializedState);
//   } catch (error) {
//     console.error(error);
//   }
// };
