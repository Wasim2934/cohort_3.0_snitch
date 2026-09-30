import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../lib/api.js";
import authReducer from "./auth/authSlice.js";

export const loadProducts = createAsyncThunk("catalog/loadProducts", async () => {
  const result = await request("/products");
  return result.data.products;
});

export const loadSellerProducts = createAsyncThunk("catalog/loadSellerProducts", async () => {
  const result = await request("/products/seller");
  return result.data.products;
});

export const loadCart = createAsyncThunk("catalog/loadCart", async () => {
  const result = await request("/cart");
  return result.data.cart;
});

export const addCartItem = createAsyncThunk("catalog/addCartItem", async (item) => {
  const result = await request("/cart", { method: "POST", body: item });
  return result.message;
});

export const createProduct = createAsyncThunk("catalog/createProduct", async (formData) => {
  const result = await request("/products", { method: "POST", body: formData });
  return result.data.product;
});

export const setProductPublished = createAsyncThunk("catalog/setProductPublished", async ({ id, published }) => {
  const result = await request(`/products/${published ? "list" : "unlist"}/${id}`, { method: "PATCH" });
  return { id, published, message: result.message };
});

const catalogSlice = createSlice({
  name: "catalog",
  initialState: { products: [], sellerProducts: [], cart: null, loading: false, error: "", notice: "" },
  reducers: {
    clearMessages(state) { state.error = ""; state.notice = ""; },
  },
  extraReducers(builder) {
    builder
      .addCase(loadProducts.pending, (state) => { state.loading = true; state.error = ""; })
      .addCase(loadProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(loadProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(loadSellerProducts.pending, (state) => { state.loading = true; state.error = ""; })
      .addCase(loadSellerProducts.fulfilled, (state, action) => { state.loading = false; state.sellerProducts = action.payload; })
      .addCase(loadSellerProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(loadCart.pending, (state) => { state.loading = true; state.error = ""; })
      .addCase(loadCart.fulfilled, (state, action) => { state.loading = false; state.cart = action.payload; })
      .addCase(loadCart.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(addCartItem.fulfilled, (state, action) => { state.notice = action.payload; })
      .addCase(addCartItem.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(createProduct.fulfilled, (state, action) => { state.sellerProducts.unshift(action.payload); state.notice = "Your product is saved as a draft."; })
      .addCase(createProduct.rejected, (state, action) => { state.error = action.error.message; })
      .addCase(setProductPublished.fulfilled, (state, action) => {
        const product = state.sellerProducts.find((item) => item._id === action.payload.id);
        if (product) product.published = action.payload.published;
        state.notice = action.payload.message;
      })
      .addCase(setProductPublished.rejected, (state, action) => { state.error = action.error.message; });
  },
});

export const { clearMessages } = catalogSlice.actions;
export const store = configureStore({ reducer: { auth: authReducer, catalog: catalogSlice.reducer } });