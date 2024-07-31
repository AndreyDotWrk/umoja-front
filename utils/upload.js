import imageCompression from 'browser-image-compression';
import { useVendorStore } from '~/stores/vendorStore';
import axios from 'axios';

export const upLoadPicture = async ({ event, upLoadedFiles, showProgress, profilePicture, profile_photo, errorMessage, mode }) => {
    const vendorStore = useVendorStore();
    const baseURL = process.env.BACKEND_API_URL;

    if (upLoadedFiles.value.length >= 1) {
        errorMessage.value = 'Maximum number of images allowed is 1';
        return;
    }

    let file;
    if (mode === 'drop') {
        file = event.dataTransfer.files[0];
    } else {
        file = event.target.files[0];
    }

    if (!file) return;

    const allowedFiles = ['.png', '.jpeg', '.jpg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedFiles.includes('.' + fileExtension)) {
        errorMessage.value = 'Please upload files having extensions: ' + allowedFiles.join(', ');
        return;
    }

    errorMessage.value = '';

    const options = {
        maxSizeMB: 1,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('profile_photo', compressedFile);

        const form = { name: compressedFile.name, loading: 0 };
        profilePicture.value = [form];
        showProgress.value = true;

        const response = await axios.post(baseURL + '/vendor/upload', formData, {
            headers: {
                Authorization: `Bearer ${vendorStore.vendorToken}`
            },
            onUploadProgress: ({ loaded, total }) => {
                profilePicture.value[profilePicture.value.length - 1].loading = Math.floor((loaded / total) * 100);
                if (loaded === total) {
                    const fileSize = (total < 1024) ? total + 'KB' : (loaded / (1024 * 1024)).toFixed(2) + 'MB';
                    upLoadedFiles.value.push({ name: compressedFile.name, size: fileSize });
                    profilePicture.value = [];
                }
            }
        });

        const profileImg = response.data.profile_photo;
        profile_photo.value = profileImg;
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.message || 'An error occurred during file upload.';
        } else if (error.request) {
            errorMessage.value = 'No response received from server. Please try again later.';
        } else {
            errorMessage.value = 'An error occurred. Please try again later.';
        }
    }
};

export const uploadCoverImage = async({event, upLoadedFiles1, showProgress1, coverPicture, cover_photo, errorMessage1, mode}) => {
    const vendorStore = useVendorStore();
    if (upLoadedFiles1.value.length == 1){
        errorMessage1.value = 'Maximum number of images allowed is 1';
        return;
    }
    let file;
    if (mode == 'drop'){
        file= event.dataTransfer.files[0]
    }else{
        file = event.target.files[0];
    }
    
    if (!file) return;

    const allowedFiles = [".png", ".jpeg", ".jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedFiles.includes("." + fileExtension)) {
        errorMessage1.value = "Please upload files having extensions: " + allowedFiles.join(', ');
        return;
    }

    errorMessage1.value = "";

    const options = {
        maxSizeMB: 1,
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append("cover_image", compressedFile);

        const form = { name: compressedFile.name, loading: 0 };
        coverPicture.value = [form];
        showProgress1.value = true;

        const response = await axios.post(baseURL + '/vendor/upload/cover_image', formData, {
            headers: {
                Authorization: `Bearer ${vendorStore.vendorToken}`
            },
            onUploadProgress: ({ loaded, total }) => {
                coverPicture.value[coverPicture.value.length - 1].loading = Math.floor((loaded / total) * 100);
                    if (loaded == total) {
                        const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
                        upLoadedFiles1.value.push({ name: compressedFile.name, size: fileSize });
                        coverPicture.value = [];
                    }
            }
        });

        const profileImg = response.data.cover_image;
        cover_photo.value = profileImg;
    } catch (error) {
        if (error.response) {
            errorMessage1.value = error.response.data.message || 'An error occurred during file upload.';
        } else if (error.request) {
            errorMessage1.value = 'No response received from server. Please try again later.';
        } else {
            errorMessage1.value = 'An error occurred. Please try again later.';
        }
    }
};
