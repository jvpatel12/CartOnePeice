import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
  items: [],
  addToCart: () => {},
  updateToCart: () => {},
});

function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );

    if (existingCartItemIndex !== -1) {
      updatedItems[existingCartItemIndex] = {
        ...updatedItems[existingCartItemIndex],
        quantity: updatedItems[existingCartItemIndex].quantity + 1,
      };
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );

      if (!product) return state; // safety

      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return { items: updatedItems };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];

    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    if (updatedItemIndex === -1) return state;

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
      quantity:
        updatedItems[updatedItemIndex].quantity + action.payload.amount,
    };

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return { items: updatedItems };
  }

  return state; // ✅ ALWAYS return state
}

export default function ContextProvider({ children }) {
  const [shoppingCartOk, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    { items: [] }
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: { productId, amount },
    });
  }

  const cxtValue = {
    items: shoppingCartOk.items,
    addToCart: handleAddItemToCart,
    updateToCart: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={cxtValue}>
      {children}
    </CartContext.Provider>
  );
}
