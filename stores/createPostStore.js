import {defineStore} from "pinia";
import {vendorUseApi} from '~/composables/vendorApi'
import imageCompression from 'browser-image-compression';
import { useVendorStore } from "./vendorStore";
import { likePost, unlikePost } from "~/composables/useLike";
import { useUserStore } from "./userStore";


export const useCreateStore = defineStore('post', {
    state: () => ({
        relatedPosts: [],
        menuVisible: [],
        menuVisible2: [],
        loading: false,
        errorArticle: "",
        postToEdit: null,
        articleToEdit: null,
        load: false,
        load2: false,
        load3: false,
        load4: false,
        loadEdit: false,
        pictureInfo: [],
        coverInfo: [],
        errorPost: "",
        scheduleError: "",
        posts: [],
        articles: []
    }),
    persist: {
        enabled: true,
        storage: persistedState.localStorage,
    },

    actions: {
      async getPost(){
        const api = vendorUseApi()
        try{
          const res = await api({
            url: "vendor/posts",
            method: 'GET'
          });
          this.posts = res.data.data
        }catch(error){
          console.error(error)
          return []
        }
      },
      async getArticle(){
        const api = vendorUseApi()
        try{
          const res = await api({
            url: "vendor/articles",
            method: 'GET'
          });
          this.articles = res.data.data
        }catch(error){
          console.error(error)
          return []
        }
      },
      clearUser(){
        this.posts = []
        this.articles = []
      },
      setPostToEdit(post) {
       this.postToEdit = post;
      },
      setArticleToEdit(article) {
        this.articleToEdit = article;
       },
        
        async deleteArticle(id){
          const api = vendorUseApi();
          try{
            const res = await api({
              url: `vendor/articles/${id}`,
              method: 'post',
              data: {
                _method: 'DELETE'
              }
            });
            await this.getArticle()
          }catch(error){
            console.error(error, "an error occured")
          }
        },
        async getProduct(searchQuery) {
            const api = vendorUseApi()
            this.loading = true
            try {
              const response = await api({
                url: `vendor/products/?search_global=${searchQuery}`,
                method: 'get'
              });
              const loadedPostIds = new Set(this.relatedPosts.map(post => post.id));
              // Filter out any products that are already in relatedPosts
              const newProducts = response.data.data.filter(product => !loadedPostIds.has(product.id));
              // Add only new products to the relatedPosts array
              this.relatedPosts = [...this.relatedPosts, ...newProducts];
              return 
            }catch(error) {
              console.error(error)
            }finally{
                this.loading = false
            }
          },
          deleteProduct(item){
            this.relatedPosts = this.relatedPosts.filter((post) => {
                return post.id !== item;
            });
          },
          async handlephotoUpload(imagePreviews) {
            const api = vendorUseApi();
            const tempCloudinaryLinks = [];
            
            for (let index = 0; index < imagePreviews.length; index++) {
              const imageData = imagePreviews[index];
              
              try {
                if (imageData) {
                  const blob = imageData instanceof Blob ? imageData : await fetch(imageData).then(res => res.blob());
                  const options = {
                    maxSizeMB: 1,
                    useWebWorker: true
                  };
                  const compressedImage = await imageCompression(blob, options);
                  
                  const formData = new FormData();
                  formData.append('featured_img', compressedImage, 'compressed.jpg');
                  
                  const res = await api({
                    url: 'vendor/posts/upload',
                    method: 'post',
                    data: formData
                  });
                  tempCloudinaryLinks.push(res.data.secure_url);
                }
              } catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorPost = error.response.data.message || 'An error occurred during photo upload.';
                } else if (error.request) {
                  this.errorPost  = 'No response received from server. Please try again later.';
                } else {
                  this.errorPost   = 'An error occurred. Please try again later.';
                }
                return false;
              }
            } 
            this.pictureInfo = tempCloudinaryLinks.join(', ');
            return tempCloudinaryLinks.length > 0; // Return true if at least one image was uploaded
          },
          async handlephotoUpload2(imagePreviews) {
            const api = vendorUseApi();
            const tempCloudinaryLinks = [];
            
            for (let index = 0; index < imagePreviews.length; index++) {
              const imageData = imagePreviews[index];
              
              try {
                if (imageData) {
                  const blob = imageData instanceof Blob ? imageData : await fetch(imageData).then(res => res.blob());
                  
                  const options = {
                    maxSizeMB: 1,
                    useWebWorker: true
                  };
                  const compressedImage = await imageCompression(blob, options);
                  
                  const formData = new FormData();
                  formData.append('cover_image', compressedImage, 'compressed.jpg');
                  
                  const res = await api({
                    url: 'vendor/articles/upload',
                    method: 'post',
                    data: formData
                  });
                  tempCloudinaryLinks.push(res.data.secure_url);
                }
              } catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorArticle = error.response.data.message || 'An error occurred during photo upload.';
                } else if (error.request) {
                  this.errorArticle  = 'No response received from server. Please try again later.';
                } else {
                  this.errorArticle   = 'An error occurred. Please try again later.';
                }
                return false;
              }
            } 
            this.coverInfo = tempCloudinaryLinks.join(', ');
            return tempCloudinaryLinks.length > 0; // Return true if at least one image was uploaded
          },
          async deletePost(id){
            const api = vendorUseApi();
            try{
              const res = await api({
                url: `vendor/posts/${id}`,
                method: 'post',
                data: {
                  _method: 'DELETE'
                }
              });
              await this.getPost()
            }catch(error){
              console.error(error, "an error occured")
            }
          },
          async createPost(imagePreviews, data){
            const vendorStore = useVendorStore()
            this.load = true
            try{
                const photoResponse = await this.handlephotoUpload(imagePreviews)
                if (photoResponse){
                    const api = vendorUseApi()
                    const response = await api ({
                        url: 'vendor/posts',
                        method: 'POST',
                        data: {
                            category_id: data.category_id,
                            product_ids: data.product_ids,
                            location: data.location,
                            description: data.description,
                            featured_img: this.pictureInfo
                        }
                    });
                    this.relatedPosts = []
                    await vendorStore.getUser(vendorStore.vendor.id)
                    await this.getPost()
                    return true
                }
            }catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorPost = error.response.data.message || 'An error occurred during post upload.';
                } else if (error.request) {
                  this.errorPost  = 'No response received from server. Please try again later.';
                } else {
                  this.errorPost   = 'An error occurred. Please try again later.';
                }
                return false;
              }finally{
                this.load = false
              }
          },
          async editPost(imagePreviews, data){
            this.loadEdit = true
            try{
                const photoResponse = await this.handlephotoUpload(imagePreviews)
                if (photoResponse){
                    const api = vendorUseApi()
                    const response = await api ({
                        url: `vendor/posts/${this.postToEdit.id}`,
                        method: 'POST',
                        data: {
                          _method: 'PUT',
                            category_id: data.category_id,
                            product_ids: data.product_ids,
                            location: data.location,
                            description: data.description,
                            featured_img: this.pictureInfo
                        }
                    });
                    await this.getPost()
                    return true
                }
            }catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorPost = error.response.data.message || 'An error occurred during post upload.';
                } else if (error.request) {
                  this.errorPost  = 'No response received from server. Please try again later.';
                } else {
                  this.errorPost   = 'An error occurred. Please try again later.';
                }
                return false;
              }finally{
                this.loadEdit = false
              }
          },
          async schedulePost(imagePreviews, data){
            this.load2 = true
            const vendorStore = useVendorStore()
            try{
                const photoResponse = await this.handlephotoUpload(imagePreviews)
                if (photoResponse){
                    const api = vendorUseApi()
                    const response = await api ({
                        url: 'vendor/posts/schedule',
                        method: 'POST',
                        data: {
                            category_id: data.category_id,
                            product_ids: data.product_ids,
                            location: data.location,
                            description: data.description,
                            featured_img: this.pictureInfo,
                            scheduled_at: data.scheduled_at
                        }
                    });
                    this.relatedPosts = []
                    await vendorStore.getUser(vendorStore.vendor.id)
                    await this.getPost()
                    return true
                }
            }catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.scheduleError = error.response.data.message || 'An error occurred during post upload.';
                } else if (error.request) {
                  this.scheduleError  = 'No response received from server. Please try again later.';
                } else {
                  this.scheduleError   = 'An error occurred. Please try again later.';
                }
                return false;
              }finally{
                this.load2 = false
              }
          },
          async draftPost(imagePreviews, data){
            this.load3 = true
            const vendorStore = useVendorStore()
            try{
                const photoResponse = await this.handlephotoUpload(imagePreviews)
                if (photoResponse){
                    const api = vendorUseApi()
                    const response = await api ({
                        url: 'vendor/posts/draft',
                        method: 'POST',
                        data: {
                            category_id: data.category_id,
                            product_ids: data.product_ids,
                            location: data.location,
                            description: data.description,
                            featured_img: this.pictureInfo
                        }
                    });
                    this.relatedPosts = []
                    await vendorStore.getUser(vendorStore.vendor.id)
                    await this.getPost()
                    return true
                }
            }catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorPost = error.response.data.message || 'An error occurred during post upload.';
                } else if (error.request) {
                  this.errorPost  = 'No response received from server. Please try again later.';
                } else {
                  this.errorPost   = 'An error occurred. Please try again later.';
                }
                return false;
              }finally{
                this.load3 = false
              }
          },
          async postArticle(imagePreview, data){
            const vendorStore = useVendorStore()
            this.load4 = true
            try{
                const photoResponse = await this.handlephotoUpload2(imagePreview)
                if (photoResponse){
                    const api = vendorUseApi()
                    const response = await api ({
                        url: 'vendor/articles',
                        method: 'POST',
                        data: {
                          title: data.title,
                          content: data.content,
                          category_id: data.category_id,
                          cover_image: this.coverInfo
                        }
                    });
                    await vendorStore.getUser(vendorStore.vendor.id)
                    await this.getArticle()
                    return true
                }
            }catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorArticle = error.response.data.message || 'An error occurred during post upload.';
                } else if (error.request) {
                  this.errorArticle  = 'No response received from server. Please try again later.';
                } else {
                  this.errorArticle   = 'An error occurred. Please try again later.';
                }
                return false;
              }finally{
                this.load4 = false
              }
          },
          async editArticle(imagePreview, data){
            this.load4 = true
            try{
                const photoResponse = await this.handlephotoUpload2(imagePreview)
                if (photoResponse){
                    const api = vendorUseApi()
                    const response = await api ({
                        url: `vendor/articles/${this.articleToEdit.id}`,
                        method: 'POST',
                        data: {
                          _method: 'PUT',
                          title: data.title,
                          content: data.content,
                          category_id: data.category_id,
                          cover_image: this.coverInfo
                        }
                    });
                    this.getArticle()
                    return true
                }
            }catch (error) {
                console.error('Failed to upload file:', error);
                if (error.response) {
                  this.errorArticle = error.response.data.message || 'An error occurred during post upload.';
                } else if (error.request) {
                  this.errorArticle  = 'No response received from server. Please try again later.';
                } else {
                  this.errorArticle   = 'An error occurred. Please try again later.';
                }
                return false;
              }finally{
                this.load4 = false
              }
          }
    }
})