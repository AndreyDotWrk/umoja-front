<template>
	<div class="px-4 px-md-6 py-5 my-4 my-md-0 py-md-10 bg-white">
		<p style="color: #000; font-size: 24px; font-weight: 600">Address Book</p>
		<p style="color: var(--carbon-3, #969696); font-family: Faktum; font-size: 14px; font-style: normal; font-weight: 500">
			Here you can manage all your delivery address.
		</p>
	</div>
	<div class="d-flex px-4 px-md-6 pb-4 pb-md-6 w-100 align-center">
		<v-text-field hide-details="" prepend-inner-icon="mdi mdi-magnify" placeholder="Search for Order ID or Product" density="compact"> </v-text-field>
		<v-btn
			rounded="xl"
			:width="$vuetify.display.mobile ? '116' : '154'"
			style="border: 1px solid #969696; color: #333; font-size: 14px; font-weight: 600"
			variant="outlined"
			class="textClass text-grey-darken-3 ml-3"
		>
			<v-img class="mr-2" width="14" height="14" src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990443/umoja/filtericon_ri5zov.svg" />
			Filter
		</v-btn>
	</div>
	<div class="mx-4 mx-md-6 mb-6" :class="$vuetify.display.mobile ? 'bg-white' : 'cardStyle'">
		<template v-if="shippingAddress.length >= 1">
			<div v-for="address in shippingAddress" :key="address.id">
				<div
					class="pa-4 mb-md-4 d-flex flex-column flex-md-row align-start justify-space-between"
					:class="$vuetify.display.mobile ? '' : 'cardStyle'"
				>
					<div class="d-flex">
						<div>
							<p style="font-size: 16px; font-weight: 600; color: #333" class="mb-2 my-0">{{ address.full_name }}</p>
							<p style="color: #969696; font-size: 14px; font-weight: 500" class="mb-0">{{ address.shipping_address }}</p>
							<p style="color: #969696; font-size: 14px; font-weight: 500" class="mb-0">{{ address.shipping_city }}, {{ address.shipping_region }}</p>
							<p style="color: #969696; font-size: 14px; font-weight: 500" class="mb-0">{{ address.shipping_country }}</p>
							<p style="color: #969696; font-size: 14px; font-weight: 500" class="mb-3">{{ address.phone_number }}</p>
							<p v-if="n == 1" style="color: #00966d; font-size: 14px; font-weight: 500" class="my-0">
								<v-icon size="18" icon="mdi mdi-information"></v-icon> Default Address
							</p>
						</div>
					</div>
					<div class="d-none d-md-block">
						<v-btn @click="editAddress(address)" flat style="border: 1px solid var(--carbon-2, #cecece)" class="ml-2" rounded="xl">
							<span style="color: #333; font-size: 14px; font-weight: 600" class="d-flex align-center">
								<v-img
									class="mx-2"
									height="24"
									width="24"
									src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990470/umoja/Pen_2_oztt3w_yitjgc.svg"
								/>
								Edit
							</span>
						</v-btn>
						<v-btn
							@click="deleteAdd(address.id)"
							variant="outlined"
							color="red"
							flat
							style="border: 1px solid var(--carbon-2, #cecece)"
							class="ml-2"
							rounded="xl"
						>
							<span style="font-size: 14px; font-weight: 600" class="d-flex align-center">
								<v-icon class="mr-2" icon="mdi mdi-trash-can-outline"></v-icon> Delete
							</span>
						</v-btn>
					</div>

					<v-row dense class="d-flex d-md-none py-4" style="border-top: 1px solid #ededed; width: 100%">
						<v-col cols="6">
							<v-btn
								@click="editAddress(address)"
								rounded="xl"
								block
								style="border: 1px solid #969696"
								variant="outlined"
								size="large"
								class="menubar text-grey-darken-3"
							>
								<span style="color: #333; font-size: 14px; font-weight: 600" class="d-flex align-center">
									<!-- <v-icon icon="mdi mdi-pencil-outline"></v-icon>  -->
									<v-img
										class="mx-2"
										height="24"
										width="24"
										src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1718888908/umoja-backup/Pen_2_oztt3w_p15qgq.svg"
									/>

									Edit
								</span>
							</v-btn>
						</v-col>
						<v-col cols="6">
							<v-btn
								@click="deleteAdd(address.id)"
								color="red"
								rounded="xl"
								style="border: 1px solid #969696"
								block
								variant="outlined"
								flat
								size="large"
								class="menubar text-grey-darken-3"
							>
								<span style="font-size: 14px; font-weight: 600" class="d-flex align-center">
									<v-icon class="mr-2" icon="mdi mdi-trash-can-outline"></v-icon> Delete
								</span>
							</v-btn>
						</v-col>
					</v-row>
				</div>
			</div>
		</template>
		<v-btn @click="dialog = true" class="textClass px-8 d-none d-md-block" rounded="xl" color="green" flat>Create New Address</v-btn>
	</div>
	<div class="d-flex justify-center justify-md-start py-5 py-md-0 bg-white d-md-none">
		<v-btn @click="dialog = true" class="textClass px-8" rounded="xl" color="green" flat>Create New Address</v-btn>
	</div>
	<v-dialog max-width="750" v-model="dialog">
		<v-sheet max-width="949" class="pa-md-6">
			<div class="d-flex align-center justify-space-between pa-4">
				<p style="color: var(--carbon-4, #333); font-size: 20px; font-weight: 600">Add New Address</p>
				<div>
					<v-img
						width="21"
						height="21"
						@click="dialog = false"
						src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1718888896/umoja-backup/close-icon_yomzpz.svg"
					/>
				</div>
			</div>
			<v-divider></v-divider>
			<v-card flat class="mt-4 bg-white rounded-lg pa-4 py-4">
				<v-form v-model="valid" @submit.prevent="addAddress">
					<v-row>
						<v-col class="pb-0" cols="12">
							<p class="inputLabel">Full Name<span class="mb-2">*</span></p>
							<v-text-field placeholder="Enter your full name" v-model="fullName" :rules="inputRules" density="comfortable"> </v-text-field>
						</v-col>
						<v-col cols="12" class="pt-0" md="6">
							<p class="inputLabel">Email Address<span class="mb-2">*</span></p>
							<v-text-field :rules="emailRules" v-model="email" placeholder="Enter your email address" density="comfortable"> </v-text-field
						></v-col>
						<v-col cols="12" md="6">
							<p class="inputLabel">Phone Number<span class="mb-2">*</span></p>
							<v-text-field :rules="phoneRules" v-model="phoneNumber" placeholder="Enter your phone number (only digits)" density="comfortable">
							</v-text-field
						></v-col>
					</v-row>
					
					<v-row class="">
						<v-col cols="12" md="6">
							<p class="inputLabel">Street Name and House Number*<span class="mb-2">*</span></p>
							<v-text-field :rules="inputRules" v-model="streetName" placeholder="Enter your Street Name and House Number" density="comfortable">
							</v-text-field>
						</v-col>
						<v-col cols="12" md="6">
							<p class="inputLabel">Region<span class="mb-2">*</span></p>
							<v-select
								v-model="shippingState"
								color="green"
								:items="states"
								:rules="inputRules"
								hint="**Make sure you select your country first**"
								:loading="loadingStates"
								placeholder="Select region"
								density="comfortable"
							>
							</v-select>
						</v-col>
					</v-row>
					<v-row class="">
						<v-col cols="12" md="6">
							<p class="inputLabel">City<span class="mb-2">*</span></p>
							<v-select
								v-model="shippingCity"
								:items="cities"
								color="green"
								:loading="loadingCities"
								:rules="inputRules"
								placeholder="Select City"
								density="comfortable"
							>
							</v-select>
						</v-col>
						<v-col cols="12" md="6">
							<p class="inputLabel">Postal code<span class="mb-2">*</span></p>
							<v-text-field v-model="zipcode" placeholder="Enter your zipcode" density="comfortable"> </v-text-field>
						</v-col>
					</v-row>
					<p style="color: red; font-size: 16px">{{ addressError }}</p>
					<div class="d-flex justify-center justify-md-start w-100">
						<v-btn class="textClass px-8" rounded="xl" type="submit" :disabled="!valid" color="green" flat>Create New Address</v-btn>
						<v-btn @click="dialog = false" variant="tonal" class="textClass ml-2 px-8" rounded="xl" color="green" flat>Cancel</v-btn>
					</div>
				</v-form>
			</v-card>
		</v-sheet>
	</v-dialog>
	<v-dialog max-width="750" v-model="dialog2">
		<v-sheet max-width="949" class="pa-md-6">
			<div class="d-flex align-center justify-space-between pa-4">
				<p style="color: var(--carbon-4, #333); font-size: 20px; font-weight: 600">Add New Address</p>
				<div>
					<v-img
						width="21"
						height="21"
						@click="dialog2 = false"
						src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1718888896/umoja-backup/close-icon_yomzpz.svg"
					/>
				</div>
			</div>
			<v-divider></v-divider>
			<v-card flat class="mt-4 bg-white rounded-lg pa-4 py-4">
				<v-form v-model="valid2" @submit.prevent="updateAddress">
					<v-row>
						<v-col class="pb-0" cols="12">
							<p class="inputLabel">Full Name<span class="mb-2">*</span></p>
							<v-text-field placeholder="Enter your full name" v-model="selectedEdit.full_name" :rules="inputRules" density="comfortable">
							</v-text-field>
						</v-col>
						<v-col cols="12" class="pt-0" md="6">
							<p class="inputLabel">Email Address<span class="mb-2">*</span></p>
							<v-text-field :rules="emailRules" v-model="selectedEdit.email" placeholder="Enter your email address" density="comfortable">
							</v-text-field
						></v-col>
						<v-col cols="12" md="6">
							<p class="inputLabel">Phone Number<span class="mb-2">*</span></p>
							<v-text-field
								:rules="phoneRules"
								v-model="selectedEdit.phone_number"
								placeholder="Enter your phone number (only digits)"
								density="comfortable"
							>
							</v-text-field
						></v-col>
					</v-row>
					<p class="inputLabel">Street Name and House Number*<span class="mb-2">*</span></p>
					<v-text-field
						:rules="inputRules"
						v-model="selectedEdit.shipping_address"
						placeholder="Enter your Street Name and House Number"
						density="comfortable"
					>
					</v-text-field>
					<v-row class="">
						<v-col cols="12" md="6">
							<p class="inputLabel">Country<span class="mb-2">*</span></p>
							<v-select
								v-model="selectedEdit.shipping_country"
								placeholder="Select Country"
								:items="allCountries"
								:rules="inputRules"
								@input="fetchStates(selectedEdit.shipping_country)"
								density="comfortable"
							>
							</v-select>
						</v-col>
						<v-col cols="12" md="6">
							<p class="inputLabel">Region<span class="mb-2">*</span></p>
							<v-select
								v-model="selectedEdit.shipping_region"
								color="green"
								:items="states"
								@input="fetchCities(selectedEdit.shipping_country, selectedEdit.shipping_region)"
								:rules="inputRules"
								hint="**Make sure you select your country first**"
								:loading="loadingStates"
								placeholder="Select region"
								density="comfortable"
							>
							</v-select>
						</v-col>
					</v-row>
					<v-row class="">
						<v-col cols="12" md="6">
							<p class="inputLabel">City<span class="mb-2">*</span></p>
							<v-select
								v-model="selectedEdit.shipping_city"
								:items="cities"
								color="green"
								:loading="loadingCities"
								:rules="inputRules"
								placeholder="Select City"
								density="comfortable"
							>
							</v-select>
						</v-col>
						<v-col cols="12" md="6">
							<p class="inputLabel">Postal code<span class="mb-2">*</span></p>
							<v-text-field v-model="selectedEdit.shipping_postal_code" placeholder="Enter your zipcode" density="comfortable"> </v-text-field>
						</v-col>
					</v-row>
					<div class="d-flex justify-center justify-md-start w-100">
						<v-btn class="textClass px-8" rounded="xl" type="submit" :disabled="!valid2" color="green" flat>Save Changes</v-btn>
						<!-- <v-btn @click="dialog2 = false" variant="tonal" class="textClass ml-2 px-8" rounded="xl" color="green" flat>Cancel</v-btn> -->
					</div>
				</v-form>
			</v-card>
		</v-sheet>
	</v-dialog>
	<v-dialog v-model="deleteDialog" persistent max-width="400">
		<v-card class="pa-5 text-center rounded-lg" style="align-items: center" flat tile>
			<v-card-title>
				<div
					class="d-flex align-center justify-center"
					style="width: 60px; height: 60px; border-radius: 50%; background-color: #f7edee; border: 1px solid #c20052"
				>
					<v-icon large color="red">mdi mdi-trash-can-outline</v-icon>
				</div>
			</v-card-title>
			<v-card-title style="font-weight: 700" class="text-h5 justify-center">Delete Address</v-card-title>
			<v-card-text class="text-center mb-5">Are you sure you want to delete this address?</v-card-text>
			<v-card-actions class="justify-center w-100">
				<v-btn rounded="xl" size="x-large" style="border: 1px solid #cecece; flex: 1" @click="deleteDialog = false">Cancel</v-btn>
				<v-btn rounded="xl" size="x-large" style="background-color: #c20052; color: #fff; flex: 1" @click="deleteShippingAddress(deleteId)"
					>Delete</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useApi } from "~/composables/useApi";
import { useUserStore } from "~/stores/userStore";
import { emailRules, inputRules, phoneRules } from "~/utils/formrules";
import { allCountries, fetchStates, fetchCities, states, cities, loadingStates, loadingCities } from "~/utils/countryapi";
import { fetchShippingAdress, updateShippingAddress, createShippingAddress, addressError } from "~/composables/useShippingAddress";

const dialog = ref(false);
const dialog2 = ref(false);
const shippingAddress = ref([]);
const deleteDialog = ref(false);
const shippingCity = ref("");
const userStore = useUserStore();
const shippingCountry = computed(() => userStore.userCountry);
const shippingState = ref("");
const fullName = ref("");
const phoneNumber = ref("");
const email = ref("");
const streetName = ref("");
const zipcode = ref("");
const valid = ref(false);
const valid2 = ref(false);
const selectedEdit = ref();
const deleteId = ref(null);

onMounted(async () => {
	shippingAddress.value = await fetchShippingAdress();
	fetchStates(shippingCountry.value);
});
watch(
	() => shippingCountry.value,
	() => {
		fetchStates(shippingCountry.value);
	}
);

watch(
	() => shippingState.value,
	() => {
		fetchCities(shippingCountry.value, shippingState.value);
	}
);

function editAddress(address) {
	selectedEdit.value = address;
	dialog2.value = true;
}
function deleteAdd(id) {
	deleteId.value = id;
	deleteDialog.value = true;
}
async function addAddress() {
	if (valid.value) {
		const data = {
			shipping_full_name: fullName.value,
			shipping_email: email.value,
			shipping_phone_number: phoneNumber.value,
			shipping_address: streetName.value,
			shipping_region: shippingState.value,
			shipping_city: shippingCity.value,
			shipping_postal_code: zipcode.value,
		};
		const response = await createShippingAddress(data);
		if (response) {
			shippingAddress.value = await fetchShippingAdress();
			dialog.value = false;

			fullName.value = "";
			email.value = "";
			phoneNumber.value = "";
			streetName.value = "";
			shippingState.value = "";
			shippingCity.value = "";
			zipcode.value = "";
		}
	}
}
async function updateAddress() {
	if (valid2.value) {
		const response = await updateShippingAddress(selectedEdit.value);
		if (response) {
			shippingAddress.value = await fetchShippingAdress();
			dialog2.value = false;
		}
	}
}

async function deleteShippingAddress(id) {
	const api = useApi();
	try {
		const response = await api({
			url: `customer/shippingAddresses/${id}`,
			method: "POST",
			data: {
				_method: "DELETE",
			},
		});
		shippingAddress.value = await fetchShippingAdress();
		deleteDialog.value = false;
	} catch (error) {
		console.error(error);
	}
}
</script>
