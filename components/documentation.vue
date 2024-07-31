<template>
	<div>
		<h1 style="font-weight: 600; font-size: 32px; color: #1a1d1f">Provide your business documents</h1>
		<p style="font-weight: 500; font-size: 16px; line-height: 24px; color: #9ea5ad">
			Please provide additional business information and upload business documents
		</p>
		<div class="pt-8 pb-12" style="max-width: 502px">
			<p class="inputLabel">BN Number</p>
			<v-text-field :rules="numRules" v-model="bnNumber" density="comfortable"></v-text-field>

			<p class="inputLabel">Tax Identification Number</p>
			<v-text-field v-model="taxIdNumber" :rules="numRules" density="comfortable"></v-text-field>

			<p class="inputLabel">Utility Bill</p>
			<v-select
				v-model="selectedUtilityBill"
				:items="typeOfUtilityBills"
				append-inner-icon="mdi mdi-chevron-down"
				placeholder="Select a utility bill"
				density="comfortable"
				:rules="inputRules"
			>
			</v-select>

			<p class="inputLabel">Copy of utility bill (Valid within 3 months)</p>
			<v-card
				flat
				class="mb-8"
				style="
					justify-content: center;
					align-items: center;
					padding: 27px;
					display: flex;
					width: 100%;
					height: 100px;
					background: #f8f8f8;
					border-radius: 6px;
				"
			>
			<div
          @dragenter.prevent
          @dragleave.prevent
          @dragover.prevent
          @drop.prevent="drop1"
          @change="upLoadFile1()"
          class="d-flex align-center"
        >
          <label for="utility-file">
            <v-icon color="#9EA5AD" class="mr-2" icon="mdi mdi-file-upload-outline"></v-icon>
          </label>
          <label for="utility-file">
            <p style="font-weight: 400; font-size: 16px; color: #9EA5AD;">Drag and drop document here or Browse Supported file types: JPEG, PNG, PDF. Max file size: 2mb</p>
          </label>
          <input class="utility" id="utility-file" type="file" style="display: none;" accept=".svg, .png, .jpeg, .jpg, .gif">
        </div>
			</v-card>

			<p style="color: red; font-size: 14px;" class="mb-8">{{ errorMessage1 }}</p>
			<ul class="my-7" v-if="showProgress">
        <li v-for="(file, index) in files1" :key="index" class="d-flex align-center py-2 rounded-lg px-4 mb-4" style="border: 1px solid #EAECF0; justify-content: space-between;">
          <fileUploading :file="file" />
        </li>
      </ul>

      <ul v-if="showProgress">
        <li v-for="(file, index) in upLoadedFiles1" :key="index" class="d-flex align-center py-2 rounded-lg px-4" style="border: 1px solid #EAECF0; justify-content: space-between;">
          <fileUploaded :file="file"/>
        </li>
      </ul>

			<p class="inputLabel">BN Document</p>
			<v-card
				flat
				class="mb-8"
				style="
					justify-content: center;
					align-items: center;
					padding: 27px;
					display: flex;
					width: 100%;
					height: 100px;
					background: #f8f8f8;
					border-radius: 6px;
				"
			>
			<div
          @dragenter.prevent
          @dragleave.prevent
          @dragover.prevent
          @drop.prevent="drop"
          @change="upLoadFile()"
          class="d-flex align-center"
        >
          <label for="bn-file">
            <v-icon color="#9EA5AD" class="mr-2" icon="mdi mdi-file-upload-outline"></v-icon>
          </label>
          <label for="bn-file">
            <p style="font-weight: 400; font-size: 16px; color: #9EA5AD;">Drag and drop document here or Browse Supported file types: JPEG, PNG, PDF. Max file size: 2mb</p>
          </label>
          <input class="bn-doc" id="bn-file" type="file" style="display: none;" accept=".svg, .png, .jpeg, .jpg, .gif">
        </div>
			</v-card>

			<p style="color: red; font-size: 14px;" class="mb-8">{{ errorMessage2 }}</p>

			<ul class="my-7" v-if="showProgress">
        <li v-for="(file, index) in files2" :key="index" class="d-flex align-center py-2 rounded-lg px-4 mb-4" style="border: 1px solid #EAECF0; justify-content: space-between;">
          <fileUploading :file="file" />
        </li>
      </ul>

      <ul v-if="showProgress">
        <li v-for="(file, index) in upLoadedFiles2" :key="index" class="d-flex align-center py-2 rounded-lg px-4" style="border: 1px solid #EAECF0; justify-content: space-between;">
          <fileUploaded :file="file"/>
        </li>
      </ul>

			<p style="color: red; font-size: 16px;" class="mb-4">{{ formError }}</p>
			<v-btn @click="submit()" flat style="border: 1px solid #e5e5e5" size="large" variant="outlined">Save and continue</v-btn>
		</div>
	</div>
</template>
<script setup>
import { ref, defineEmits } from 'vue';
import { useVendorStore } from '~/stores/vendorStore';
import axios from 'axios'
import {inputRules, numRules} from '~/utils/formrules'

const vendorStore = useVendorStore()

const typeOfUtilityBills = ref(["Electricity", "Water", "Gas", "Internet", "Telephone"]);

const bnNumber = ref("");
const taxIdNumber = ref("");
const selectedUtilityBill = ref("");
const config = useRuntimeConfig()
const baseURL = config.public.backendApiUrl;


const utility_photo = ref("")
const business_number_photo = ref("")

const files1 = ref([])
const files2 = ref([])
const upLoadedFiles1 = ref([])
const upLoadedFiles2 = ref([])

const emit = defineEmits(['submit']);
const formError = ref("")
const errorMessage1 = ref("")
const errorMessage2 = ref("")
const showProgress = ref(false)


function isFormValid() {
	if (
		bnNumber &&
		taxIdNumber &&
		selectedUtilityBill &&
		utility_photo.value &&
		business_number_photo.value
	) {
		return true;
	}else {
		return false
	}
}

const submit = () => {
	const businessDocs = {
		BN_Number: bnNumber.value,
		Tax_ID: taxIdNumber.value,
		Utility_Bill: selectedUtilityBill.value,
		utility_photo: utility_photo.value,
		business_number_photo: business_number_photo.value
	}
	if (!isFormValid()) {
		formError.value = "Please fill in all required fields."
		return
	} 
	formError.value = ""
	if (!vendorStore.isBusinessDocumentationComplete) {
		vendorStore.setBusinessDocumentation(businessDocs)
		console.log(vendorStore.businessDocumentation)
		vendorStore.markSectionComplete('isBusinessDocumentationComplete')
	}
	emit('submit')
};
function upLoadFile1() {
		if (utility_photo.value) {
			errorMessage1.value = "You can not upload more than one document";
			return;
		}
		const file = document.querySelector(".utility").files[0]
		if(!file) return;
		
    const allowedFiles = [".pdf", ".png", ".jpeg", ".jpg"]
    const maxAllowedWidth = 800;
    const maxAllowedHeight = 400;
    const maxFileSize = 2 * 1024 * 1024;
    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    if (!allowedFiles.includes("." + fileExtension)) {
          errorMessage1.value = "Please upload files having extensions: " + allowedFiles.join(', ');
          return;
      }

      errorMessage1.value = ""

    if (file.size > maxFileSize) {
      errorMessage1.value = "File size exceeds the maximum allowed size of 2MB";
      return;
    }
    errorMessage1.value = ""

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width > maxAllowedWidth || img.height > maxAllowedHeight) {
        errorMessage1.value = "Image dimensions exceeds the maximum allowed dimensions (800px x 400px)."
        return;
      }
      errorMessage1.value = "";
      const filename = file.name
      const formData = new FormData();
      formData.append("utility_photo", file);
      const form = {name: filename, loading: 0}
      files1.value = [...files1.value, form]
      showProgress.value = true;

	  axios.post(baseURL + "/auth/upload", formData, {
			onUploadProgress: ({loaded, total}) => {
				files1.value[files1.value.length - 1].loading = Math.floor((loaded / total) * 100);
				if (loaded == total) {
					const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
					upLoadedFiles1.value.push({name: filename, size: fileSize});
					files1.value = [];
				}
			}
			
			})
			.then(response => {
				utility_photo.value = response.data.utility_photo

			})
			.catch(error => {
				if (error.response) {
					errorMessage1.value = error.response.data.message || 'An error occurred during file upload.';
				} else if (error.request) {
					errorMessage1.value = 'No response received from server. Please try again later.';
				} else {
					errorMessage1.value = 'An error occurred. Please try again later.';
				}
			});
    };

    img.onerror = function () {
      errorMessage1.value = "Failed to load the image"
    };


}

function drop1(e) {
	if (utility_photo.value) {
			errorMessage1.value = "You can not upload more than one document";
			return;
		}
	const file= e.dataTransfer.files[0]
	if(!file) return;
		
    const allowedFiles = [".pdf", ".png", ".jpeg", ".jpg"]
    const maxAllowedWidth = 800;
    const maxAllowedHeight = 400;
    const maxFileSize = 2 * 1024 * 1024;
    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    if (!allowedFiles.includes("." + fileExtension)) {
          errorMessage1.value = "Please upload files having extensions: " + allowedFiles.join(', ');
          return;
      }

      errorMessage1.value = ""

    if (file.size > maxFileSize) {
      errorMessage1.value = "File size exceeds the maximum allowed size of 2MB";
      return;
    }
    errorMessage1.value = ""

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width > maxAllowedWidth || img.height > maxAllowedHeight) {
        errorMessage1.value = "Image dimensions exceeds the maximum allowed dimensions (800px x 400px)."
        return;
      }
      errorMessage1.value = "";
      const filename = file.name
      const formData = new FormData();
      formData.append("utility_photo", file);
      const form = {name: filename, loading: 0}
      files1.value = [...files1.value, form]
      showProgress.value = true;

	  axios.post(baseURL + "/auth/upload", formData, {
			onUploadProgress: ({loaded, total}) => {
				files1.value[files1.value.length - 1].loading = Math.floor((loaded / total) * 100);
				if (loaded == total) {
					const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
					upLoadedFiles1.value.push({name: filename, size: fileSize});
					files1.value = [];
				}
			}
			
			})
			.then(response => {
				utility_photo.value = response.data.utility_photo

			})
			.catch(error => {
				if (error.response) {
					errorMessage1.value = error.response.data.message || 'An error occurred during file upload.';
				} else if (error.request) {
					errorMessage1.value = 'No response received from server. Please try again later.';
				} else {
					errorMessage1.value = 'An error occurred. Please try again later.';
				}
			});
    };

    img.onerror = function () {
      errorMessage1.value = "Failed to load the image"
    };
	}

	function upLoadFile() {
		if (business_number_photo.value) {
			errorMessage2.value = "You can not upload more than one document";
			return;
		}
		const file = document.querySelector(".bn-doc").files[0]
		if(!file) return;
		
    const allowedFiles = [".pdf", ".png", ".jpeg", ".jpg"]
    const maxAllowedWidth = 800;
    const maxAllowedHeight = 400;
    const maxFileSize = 2 * 1024 * 1024;
    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    if (!allowedFiles.includes("." + fileExtension)) {
          errorMessage2.value = "Please upload files having extensions: " + allowedFiles.join(', ');
          return;
      }

      errorMessage2.value = ""

    if (file.size > maxFileSize) {
      errorMessage2.value = "File size exceeds the maximum allowed size of 2MB";
      return;
    }
    errorMessage2.value = ""

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width > maxAllowedWidth || img.height > maxAllowedHeight) {
        errorMessage2.value = "Image dimensions exceeds the maximum allowed dimensions (800px x 400px)."
        return;
      }
      errorMessage2.value = "";
      const filename = file.name
      const formData = new FormData();
      formData.append("business_number_photo", file);
      const form = {name: filename, loading: 0}
      files2.value = [...files2.value, form]
      showProgress.value = true;

	  axios.post(baseURL + "/auth/upload", formData, {
			onUploadProgress: ({loaded, total}) => {
				files2.value[files2.value.length - 1].loading = Math.floor((loaded / total) * 100);
				if (loaded == total) {
					const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
					upLoadedFiles2.value.push({name: filename, size: fileSize});
					files2.value = [];
				}
			}
			
			})
			.then(response => {
				business_number_photo.value = response.data.business_number_photo;
			})
			.catch(error => {
				if (error.response) {
					errorMessage2.value = error.response.data.message || 'An error occurred during file upload.';
				} else if (error.request) {
					errorMessage2.value = 'No response received from server. Please try again later.';
				} else {
					errorMessage2.value = 'An error occurred. Please try again later.';
				}
			});
    };

    img.onerror = function () {
      errorMessage2.value = "Failed to load the image"
    };

}

function drop(e) {
	if (business_number_photo.value) {
			errorMessage2.value = "You can not upload more than one document";
			return;
		}
	const file= e.dataTransfer.files[0]
	if(!file) return;
		
    const allowedFiles = [".pdf", ".png", ".jpeg", ".jpg"]
    const maxAllowedWidth = 800;
    const maxAllowedHeight = 400;
    const maxFileSize = 2 * 1024 * 1024;
    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    if (!allowedFiles.includes("." + fileExtension)) {
          errorMessage2.value = "Please upload files having extensions: " + allowedFiles.join(', ');
          return;
      }

      errorMessage2.value = ""

    if (file.size > maxFileSize) {
      errorMessage2.value = "File size exceeds the maximum allowed size of 2MB";
      return;
    }
    errorMessage2.value = ""

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width > maxAllowedWidth || img.height > maxAllowedHeight) {
        errorMessage2.value = "Image dimensions exceeds the maximum allowed dimensions (800px x 400px)."
        return;
      }
      errorMessage2.value = "";
      const filename = file.name
      const formData = new FormData();
      formData.append("business_number_photo", file);
      const form = {name: filename, loading: 0}
      files2.value = [...files2.value, form]
      showProgress.value = true;

	  axios.post(baseURL + "/auth/upload", formData, {
			onUploadProgress: ({loaded, total}) => {
				files2.value[files2.value.length - 1].loading = Math.floor((loaded / total) * 100);
				if (loaded == total) {
					const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
					upLoadedFiles2.value.push({name: filename, size: fileSize});
					files2.value = [];
				}
			}
			
			})
			.then(response => {
				business_number_photo.value = response.data.business_number_photo;
			})
			.catch(error => {
				if (error.response) {
					errorMessage2.value = error.response.data.message || 'An error occurred during file upload.';
				} else if (error.request) {
					errorMessage2.value = 'No response received from server. Please try again later.';
				} else {
					errorMessage2.value = 'An error occurred. Please try again later.';
				}
			});
    };

    img.onerror = function () {
      errorMessage2.value = "Failed to load the image"
    };
	}

</script>

