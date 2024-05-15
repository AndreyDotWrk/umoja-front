import {defineStore} from "pinia"
import {vendorUseApi} from '~/composables/vendorApi'
import Compressor from 'compressorjs';



export const useEditVendorStore = defineStore('edit-product',{
    state: () => ({
        currentEditProduct: [],
        loading: false,
        allVariations: [],
        deleteVariant: [],
        currentVariant: []
    }),
    persist: {
        enabled: true,
        storage: persistedState.localStorage,
      },
    actions: {
        saveVariantsInfo(info) {
            this.allVariations = info
          },
          saveDeleteVariant(info){
            this.deleteVariant = info
          },
          saveCurrentVariant(info){
            this.currentVariant = info
          },
        setCurrentProduct(product) {
            this.currentEditProduct = product;
        },
        async editProduct(datas) {
            const api = vendorUseApi()
                const response = await api({
                    url: `vendor/products/${this.currentEditProduct.id}`,
                    method: 'post',
                    data: {
                        _method: 'PUT',
                        ...datas
                    }
                });
                return response
        },
        async handleEditphotoUpload(imagePreviews) {
            const api = vendorUseApi()
            this.loading = true;
            const tempCloudinaryLinks = [];
        
            for (let index = 0; index < imagePreviews.length; index++) {
                const imageData = imagePreviews[index];
        
                if (imageData) {
                    try {
                        const blob = imageData instanceof Blob ? imageData : await fetch(imageData).then(res => res.blob());
                        const compressedImage = await new Promise((resolve, reject) => {
                            new Compressor(blob, {
                                quality: 1, // Adjust quality as needed
                                maxWidth: 1000,
                                maxHeight: 600,
                                success(result) {
                                    resolve(result);
                                },
                                error(error) {
                                    reject(error);
                                }
                            });
                        });
        
                        const formData = new FormData();
                        formData.append('photo', compressedImage, 'compressed.jpg');
        
                        const response = await api({
                            url: 'vendor/products/upload',
                            method: 'post',
                            data: formData
                        });
        
                        const cloudinaryLink = response.data.secure_url;
                        tempCloudinaryLinks.push(cloudinaryLink);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        // Handle error (e.g., show error message to user)
                    }
                }
            }
        
            const photos = tempCloudinaryLinks.join(', ');
            if (photos) {
                try {
                    const response = await api({
                        url: `vendor/products/${this.currentEditProduct.id}`,
                        method: 'post',
                        data: {
                            _method: 'PUT',
                            photo: photos
                        }
                    });
                    return response;
                } catch (error) {
                    console.error('Error updating product with photos:', error);
                    // Handle error (e.g., show error message to user)
                    return null; // Or handle error in a different way
                }
            } else {
                return null;
            }
        },
            async updateVariants(datas) {
                const api = vendorUseApi()
                await this.editProduct(datas);
            
                // Get delete variants
                const deleteVariants = this.deleteVariant;
            
                // Delete existing variants
                await this.deleteVariants(deleteVariants);
            
                // Get existing variants
                let existingVariants = this.allVariations;
            
                // Filter out variants marked for deletion
                if (deleteVariants.length >= 1) {
                    existingVariants = existingVariants.filter(variant => 
                        !deleteVariants.some(deleteVariant => deleteVariant.name === variant.name)
                    );
                }
            
                // Update or add current variants
                const updatePromises = [];
                for (const variant of this.currentVariant) {
                    const existingVariant = existingVariants.find(v => v.name === variant.name);
                    if (existingVariant && existingVariant.id) {
                        variant.id = existingVariant.id;
                        variant.sku = existingVariant.sku;
                        variant.price = existingVariant.price;
                        variant.no_available = existingVariant.no_available;
                        const updatePromise = this.updateVariant(variant);
                        updatePromises.push(updatePromise);
                    } else if (existingVariant && !existingVariant.id) {
                        // Variant doesn't exist in the database, add it
                        variant.sku = existingVariant.sku;
                        variant.price = existingVariant.price;
                        variant.no_available = existingVariant.no_available;
                        const addPromise = this.addVariant(variant);
                        updatePromises.push(addPromise);
                    }
                }
            
                // Wait for all updates to finish
                await Promise.all(updatePromises);
            
            },
            
              async updateVariant(variant) {
                const api = vendorUseApi()
                try {
                  // Call the update endpoint for the variant
                  const response = await api({
                    url: `vendor/products/${this.currentEditProduct.id}/variations/${variant.id}`,
                    method: 'post',
                    data: {
                        _method: 'PUT',
                        name: variant.name,
                        sku: variant.sku,
                        no_available: variant.no_available,
                        price: variant.price,

                    }
                  });
                } catch (error) {
                  // Handle error
                  console.error('Error updating variant:', error);
                }
              },
              
              async addVariant(variant) {
                const api = vendorUseApi()
                try {
                    const response = await api({
                        url: `vendor/products/${this.currentEditProduct.id}/variations`,
                            method: 'post',
                            data: {
                                name: variant.name,
                                sku: variant.sku,
                                no_available: variant.no_available,
                                price: variant.price
                            }
                    });
                } catch (error) {
                  console.error('Error adding variants:', error);
                }
              },
              async deleteVariants(variants) {
                const api = vendorUseApi()
                try {
                  const addPromises = variants.map(async (variant) => {
                    const response = await api({
                        url: `vendor/products/${this.currentEditProduct.id}/variations/${variant.id}`,
                            method: 'post',
                            data: {
                                _method: 'DELETE',
                                name: variant.name,
                                sku: variant.sku,
                                no_available: variant.no_available,
                                price: variant.price
                            ,}
                    });
                  });
                  await Promise.all(addPromises);
                } catch (error) {
                  // Handle error
                  console.error('Error deleting variants:', error);
                }
              },
              
        
    }
})