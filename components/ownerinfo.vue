<template>
	<div>
	  <h1 style="font-weight: 600; font-size: 32px; color: #1A1D1F;">Owner's Information</h1>
	  <p style="font-weight: 500; font-size: 16px; line-height: 24px; color: #9EA5AD;">Complete your company information</p>
  
	  <div class="pt-8 pb-12" style="max-width: 502px;">
		<v-row>
		  <v-col>
			<p class="inputLabel">First Name</p>
			<v-text-field v-model="firstName" :rules="firstNameRules" placeholder="First name" density="comfortable"></v-text-field>
		  </v-col>
		  <v-col>
			<p class="inputLabel">Last Name</p>
			<v-text-field v-model="lastName" :rules="lastNameRules" placeholder="Last name" density="comfortable"></v-text-field>
		  </v-col>
		</v-row>
  
		<p class="inputLabel">Email Address</p>
		<v-text-field v-model="email" :rules="emailRules" placeholder="Enter email address" density="comfortable"></v-text-field>
  
		<p class="inputLabel">Phone Number</p>
		<MazPhoneNumberInput style="width: 100%;"
		  show-code-on-list
		  :success="results?.isValid"
		  @update="results = $event"
		  dense
		  filled
		  placeholder="Enter Phone Number"
		  class="pt-3 pb-3"
		/>
		<p style="color: red; font-size: 14px;">{{ phoneError }}</p>
  
		<v-row>
		  <v-col>
			<p class="inputLabel">Gender</p>
			<v-select v-model="selectedGender" :rules="inputRules" :items="gender" append-inner-icon="" placeholder="Select gender" density="comfortable"></v-select>
		  </v-col>
		  <v-col>
			<p class="inputLabel">Date of Birth</p>
    		<v-menu open-on-hover>
      			<template v-slot:activator="{ props }">
					<v-text-field v-bind="props" v-model="formattedDate"></v-text-field>
      			</template>
	  			<v-date-picker v-model="selectedDateOfBirth"></v-date-picker>
    		</v-menu>
		  </v-col>
		</v-row>

  
		<p class="mt-4" style="font-weight: 600; font-size: 20px; line-height: 30px; color: #1A1D1F;">Identification</p>
		<p style="font-weight: 500; font-size: 16px; line-height: 24px; color: #9EA5AD;" class="mb-8">Verify business owner identity</p>
  
		<v-row>
		  <v-col>
			<p class="inputLabel">Form of ID</p>
			<v-select v-model="selectedFormOfId" :items="formOfId" append-inner-icon="" placeholder="Select" density="comfortable" :rules="inputRules"></v-select>
		  </v-col>
		  <v-col>
			<p class="inputLabel">ID Number</p>
			<v-text-field v-model="idNumber" placeholder="Enter ID Number" density="comfortable" :rules="idRules"></v-text-field>
		  </v-col>
		</v-row>
  
		<p class="inputLabel">Copy of ID</p>
		<v-card flat class="mb-5" style="justify-content: center; align-items: center; padding: 27px; display: flex; width: 100%; height: 100px; background: #F8F8F8; border-radius: 6px;">
		  <div
			@dragenter.prevent
			@dragleave.prevent
			@dragover.prevent
			@drop.prevent="drop"
			@change="upLoadFile"
			class="d-flex align-center"
		  >
			<label for="file-input">
			  <v-icon color="#9EA5AD" class="mr-2" icon="mdi mdi-file-upload-outline"></v-icon>
			</label>
			<label for="file-input">
			  <p style="font-weight: 400; font-size: 16px; color: #9EA5AD;">Drag and drop document here or Browse Supported file types: JPEG, PNG, PDF. Max file size: 2mb</p>
			</label>
			<input class="droppedFile" id="file-input" type="file" style="display: none;" accept=".svg, .png, .jpeg, .jpg, .gif">
		  </div>
		</v-card>
  
		<p style="color: red; font-size: 14px;" class="mb-8">{{ errorMessage }}</p>
  
		<ul class="my-7" v-if="showProgress">
		  <li v-for="(file, index) in files" :key="index" class="d-flex align-center py-2 rounded-lg px-4 mb-4" style="border: 1px solid #EAECF0; justify-content: space-between;">
			<fileUploading :file="file" />
		  </li>
		</ul>
  
		<ul v-if="showProgress">
		  <li v-for="(file, index) in upLoadedFiles" :key="index" class="d-flex align-center py-2 rounded-lg px-4" style="border: 1px solid #EAECF0; justify-content: space-between;">
			<fileUploaded :file="file"/>
		  </li>
		</ul>
		<p style="color: red; font-size: 16px;" class="mb-4">{{ formError }}</p>
		<v-btn @click="submit()" flat style="border: 1px solid #e5e5e5;" size="large" variant="outlined">Save and continue</v-btn>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  import { useVendorStore } from '~/stores/vendorStore';
  import {emailRules, firstNameRules, lastNameRules, inputRules, idRules} from '~/utils/formrules'
  import axios from 'axios'
  
  const vendorStore = useVendorStore()
  const config = useRuntimeConfig()
  const baseURL = config.public.backendApiUrl;

  const emit = defineEmits(['submit'])
  
  const results = ref()
  const files = ref([])
  const upLoadedFiles = ref([])
  const showProgress = ref(false)
  const errorMessage = ref("")
  const formError = ref("")
  const phoneError = ref("")
  
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const selectedGender = ref('');
  const selectedDateOfBirth = ref(new Date().toISOString().substr(0, 10));
  const selectedFormOfId = ref('');
  const idNumber = ref('');
  const picture_vendor_id_number = ref("")
  
  
  const gender = ref(['Male', 'Female']);
  const formOfId = ref(['National ID', 'International Passport', 'Driver’s License']);
  
  
  
  const formattedDate = computed(() => {
	// Format the date in the desired format (YYYY-MM-DD)
	const date = new Date(selectedDateOfBirth.value);
	return date.toISOString().substr(0, 10);
  });
  
  
  
  
  
  function isFormValid() {
	if (
	  firstName.value &&
	  lastName.value &&
	  email.value &&
	  results.value.isValid &&
	  selectedGender.value &&
	  formattedDate.value &&
	  selectedFormOfId.value &&
	  idNumber.value &&
	  picture_vendor_id_number.value
	) {
	  return true
	} else {
	  return false
	}
  }
  
  const submit = () => {
	const ownerInfo = {
	  firstName: firstName.value,
	  lastName: lastName.value,
	  email: email.value,
	  phoneNumber: results.value.phoneNumber,
	  Gender: selectedGender.value,
	  dateofBirth: formattedDate.value,
	  formofId: selectedFormOfId.value,
	  idNumber: idNumber.value,
	  picture_vendor_id_number: picture_vendor_id_number.value
	}
	if (!isFormValid()) {
	  formError.value = "Please fill in all required fields."
	  return;
	}
	formError.value = ""
	if (!vendorStore.isOwnerInfoComplete) {
		vendorStore.setOwnerInfo(ownerInfo)
		vendorStore.markSectionComplete('isOwnerInfoComplete')
	}
	emit('submit');
  };
  
  function upLoadFile() {
	if (picture_vendor_id_number.value) {
			errorMessage.value = "You can not upload more than one document"
			return;
		}
	const file = document.querySelector(".droppedFile").files[0]
	if(!file) return;
		  
	  const allowedFiles = [".pdf", ".png", ".jpeg", ".jpg"]
	  const maxAllowedWidth = 800;
	  const maxAllowedHeight = 400;
	  const maxFileSize = 2 * 1024 * 1024;
	  const fileExtension = file.name.split(".").pop().toLowerCase();
	  
	  if (!allowedFiles.includes("." + fileExtension)) {
			errorMessage.value = "Please upload files having extensions: " + allowedFiles.join(', ');
			return;
		}
  
		errorMessage.value = ""
  
	  if (file.size > maxFileSize) {
		errorMessage.value = "File size exceeds the maximum allowed size of 2MB";
		return;
	  }
	  errorMessage.value = ""
	  
  
	  const img = new Image();
	  img.src = URL.createObjectURL(file);
	  img.onload = function () {
		if (img.width > maxAllowedWidth || img.height > maxAllowedHeight) {
		  errorMessage.value = "Image dimensions exceeds the maximum allowed dimensions (800px x 400px)."
		  return;
		}
		errorMessage.value = "";
		const filename = file.name
		const formData = new FormData();
		formData.append("picture_vendor_id_number", file);
		const form = {name: filename, loading: 0}
		files.value = [...files.value, form]
		showProgress.value = true;

		axios.post(baseURL + "/auth/upload", formData, {
			onUploadProgress: ({loaded, total}) => {
				files.value[files.value.length - 1].loading = Math.floor((loaded / total) * 100);
				if (loaded == total) {
					const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
					upLoadedFiles.value.push({name: filename, size: fileSize});
					files.value = [];
				}
			}
			
			})
			.then(response => {
				picture_vendor_id_number.value = response.data.picture_vendor_id_number

			})
			.catch(error => {
				if (error.response) {
					errorMessage.value = error.response.data.message || 'An error occurred during file upload.';
				} else if (error.request) {
					errorMessage.value = 'No response received from server. Please try again later.';
				} else {
					errorMessage.value = 'An error occurred. Please try again later.';
				}
			});
			};
  
	  img.onerror = function () {
		errorMessage.value = "Failed to load the image"
	  };
  
  }
  
  function drop(e) {
	 if (picture_vendor_id_number.value) {
			errorMessage.value = "You can not upload more than one document"
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
			errorMessage.value = "Please upload files having extensions: " + allowedFiles.join(', ');
			return;
		}
  
		errorMessage.value = ""
  
	  if (file.size > maxFileSize) {
		errorMessage.value = "File size exceeds the maximum allowed size of 2MB";
		return;
	  }
	  errorMessage.value = ""
	  
  
	  const img = new Image();
	  img.src = URL.createObjectURL(file);
	  img.onload = function () {
		if (img.width > maxAllowedWidth || img.height > maxAllowedHeight) {
		  errorMessage.value = "Image dimensions exceeds the maximum allowed dimensions (800px x 400px)."
		  return;
		}
		errorMessage.value = "";
		const filename = file.name
		const formData = new FormData();
		formData.append("picture_vendor_id_number", file);
		const form = {name: filename, loading: 0}
		files.value = [...files.value, form]
		showProgress.value = true;

		axios.post(baseURL + "/auth/upload", formData, {
			onUploadProgress: ({loaded, total}) => {
				files.value[files.value.length - 1].loading = Math.floor((loaded / total) * 100);
				if (loaded == total) {
					const fileSize = (total < 1024) ? total + "KB" : (loaded / (1024 * 1024)).toFixed(2) + "MB";
					upLoadedFiles.value.push({name: filename, size: fileSize});
					files.value = [];
				}
			}
			
			})
			.then(response => {
				picture_vendor_id_number.value = response.data.picture_vendor_id_number

			})
			.catch(error => {
				if (error.response) {
				errorMessage.value = error.response.data.message || 'An error occurred during file upload.';
				} else if (error.request) {
				errorMessage.value = 'No response received from server. Please try again later.';
				} else {
				errorMessage.value = 'An error occurred. Please try again later.';
				}
			});
			};
  
	  img.onerror = function () {
		errorMessage.value = "Failed to load the image"
	  };
	  }
  
  
  
  
  </script>
  