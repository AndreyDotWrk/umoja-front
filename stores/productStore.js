import { defineStore } from 'pinia';
import axios from 'axios';
import { useApi } from '~/composables/useApi';
import { debounce } from 'lodash';

const config = useRuntimeConfig()
const baseURL = config.public.backendApiUrl;

export const useProductStore = defineStore('productStore', {
  state: () => ({
    productLoading: false,
    notFound: false,
    recentSearches: [],
    popCurrentPage: null,
    popLastPage: null,
    mostCurrentPage: null,
    mostLastPage: null,
    promoCurrentPage: null,
    promoLastPage: null,
    productFrom: "",
    allProducts: [],
    productTo: "",
    totalProducts: '',
    searchError: "",
    searchTerm: "",
    searching: false,
    fetchTriggered: false, 
    topArticle: [],
    bestSelling: {
      all: [],
      art: [],
      homeDecoration: [],
      cosmetics: [],
      accessories: [],
      fashion: [],
      furniture: []

    },
    products: {
      main: [],
      row: [],
      hotDeals: [],
      popular: [],
      mostSelling: [],
      recently_viewed: [],
      sale: [],
      homePopular: [],
      homeMostSelling: [],
      customArray: [],
       // You can add more arrays based on your needs
    },
    // marketplace
    params: {
      gender: "",
      category_name: "",
      sizes: "",
      product_rating: "",
      compare_at_price: "",
      sub_category_name: "",
      priceMinimum: "",
      priceMaximum: ""
    },
    pageNo: 1,
    marketLastPage: null,
  }),
  persist: {
    enabled: true,
    storage: persistedState.localStorage,
  },
  actions: {
    saveParams(data){
      this.params = data
    },
    clearParams(){
      this.params = {
        gender: "",
        category_name: "",
        sizes: "",
        product_rating: "",
        compare_at_price: "",
        sub_category_name: "",
        priceMinimum: "",
        priceMaximum: ""
      }
      this.pageNo = 1
      this.marketLastPage = null
    },
    removeParam(key) {
      this.params[key] = "";
    },
    async fetchFilteredProducts() {
      const params = new URLSearchParams(this.params).toString();
      this.productLoading = true;
      this.notFound = false;
    
      const transformResponse = (data) => {
        const jsonData = JSON.parse(data);
        return {
          Products: jsonData.data,
          meta: {
            last_page: jsonData.meta.last_page,
            total: jsonData.meta.total,
            from: jsonData.meta.from,
            to: jsonData.meta.to,
          }
        }
      };
    
      const api = useApi(transformResponse);
    
      try {
        const res = await api({
          url: `allproducts/?page=${this.pageNo}&${params}`,
          method: 'GET'
        });
        const { Products, meta } = res.data;
    
        if (Products.length === 0) {
          this.notFound = true;
        } else {
          this.products.main = Products;
          this.notFound = false;
        }
    
        this.productFrom = meta.from;
        this.productTo = meta.to;
        this.totalProducts = meta.total;
        this.marketLastPage = meta.last_page;
      } catch (error) {
        console.error(error);
        this.notFound = true;
        this.products.main = [];
        this.productFrom = '';
        this.productTo = '';
        this.marketLastPage = null;
        this.totalProducts = '';
      } finally {
        this.productLoading = false;
      }
    } ,
    search: debounce(async function() {
      const api = useApi()
      
      if (this.searchTerm.trim()) {
        try{
          this.updateRecentSearches(this.searchTerm);
            this.searching = true
            this.searchError = ""
            const response = await api({
              url: `search?search_global=${this.searchTerm}`,
              method: 'get'
            });
            if (response.data.products.data.length <= 0){
              this.searchError = "Sorry the product you are looking for is not available"
            }
            this.products.main = response.data.products.data
            return true
        }catch(error){
          if (error.response) {
            this.searchError = error.response.data.message || 'An error while searching.';
          } else if (error.request) {
            this.searchError = 'No response received from server. Please try again later.';
          } else {
            this.searchError = 'An error occurred. Please try again later.';
          }
          return false;
        }finally {
          this.searching = false
        }
        
      }
    }, 500),
    // ... other actions ...
    updateRecentSearches(searchTerm) {
			const maxRecentSearches = 6;
			this.recentSearches.unshift(searchTerm);

			if (this.recentSearches.length > maxRecentSearches) {
				this.recentSearches.pop(); // Remove the oldest search term from the end
				
			}

    	},
      clearSearchHistory() {
        this.recentSearches = [];
      },
    async fetchProducts() {
      const response = await axios.get(baseURL + '/allproducts');
      this.products.row = response.data.data;
      this.allProducts = response.data.data
    },
    // Method to add a product to a specific array
    addProductToArray(product, arrayName) {
      if (this.products[arrayName]) {
        this.products[arrayName].push(product);
      }
    },

    // Method to update a product in a specific array
    updateProductInArray(updatedProduct, arrayName) {
      if (this.products[arrayName]) {
        const index = this.products[arrayName].findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (index !== -1) {
          this.products[arrayName][index] = updatedProduct;
        }
      }
    },
    addProductsToSection(section, products) {
        this.products.section = products;
      },
    // Method to remove a product from a specific array
    removeProductFromArray(productId, arrayName) {
      if (this.products[arrayName]) {
        this.products[arrayName] = this.products[arrayName].filter(
          (product) => product.id !== productId
        );
      }
    },
  },
  getters: {
    // Getter to get a specific array of products
    getProductsArray: (state) => (arrayName) => {
      return state.products[arrayName] || [];
    },
  },
});

// // Usage example
// const productStore = useProductStore();

// // Adding a product to a specific array
// const newProduct = { id: 123, name: 'New Product', price: 99.99 };
// productStore.addProductToArray(newProduct, 'newArrivals');

// // Updating a product in a specific array
// const updatedProduct = { id: 123, name: 'Updated Product', price: 109.99 };
// productStore.updateProductInArray(updatedProduct, 'newArrivals');

// // Removing a product from a specific array
// const productIdToRemove = 123;
// productStore.removeProductFromArray(productIdToRemove, 'newArrivals');

// // Getting a specific array of products
// const newArrivals = productStore.getProductsArray('newArrivals');
// console.log(newArrivals);
