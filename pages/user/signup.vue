<template>
	<beta-test />
	<div class="authBg">
		<authHeader />
		<div class="d-flex justify-center py-md-12 px-md-2">
			<v-card flat class="pa-4 pa-md-12 rounded-lg" width="100%" max-width="562px">
				<h1 style="font-style: normal; font-weight: 900; font-size: 48px; line-height: 60px; letter-spacing: -0.03em; color: #333333">Sign Up</h1>
				<p class="font-weight-medium mb-6 mt-1">
					Already have an account? <span style="color: #0076ff; cursor: pointer" @click="$router.push('/user/login')">Sign In</span>
				</p>
				<v-row>
					<v-col cols="6">
						<v-btn @click="socialMediaLogin('google')" size="x-large" flat variant="outlined" block>
							<v-avatar rounded="0" size="24" class="mr-2">
								<v-img src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1718893024/umoja-backup2/flat-color-icons_google_vhnhqm_pcmc3e.png"></v-img> </v-avatar
							><span style="font-size: 12px; font-weight: 500">Sign Up with Google</span>
						</v-btn>
					</v-col>
					<v-col cols="6">
						<v-btn @click="socialMediaLogin('facebook')" size="x-large" flat color="black" block>
							<v-avatar rounded="0" size="24" class="mr-2">
								<v-img src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1719308202/bi_apple_qka2so_mvxwf1.png"></v-img> </v-avatar
							><span style="font-size: 12px; font-weight: 500">Sign Up with Facebook</span>
						</v-btn>
					</v-col>
				</v-row>
				<div class="d-flex py-8 px-5 justify-space-between align-center">
					<v-divider></v-divider>
					<p class="px-2 w-100 text-center" :style="{ fontSize: $vuetify.display.mobile ? '14px' : '16px' }">or sign up with</p>
					<v-divider></v-divider>
				</div>
				<v-form v-model="valid" @submit.prevent="handleSubmit">
					<v-row>
						<v-col>
							<p class="inputLabel">First Name</p>
							<v-text-field n v-model="first_name" :rules="firstNameRules" placeholder="First name" density="comfortable"></v-text-field>
						</v-col>
						<v-col>
							<p class="inputLabel">Last Name</p>
							<v-text-field v-model="last_name" :rules="lastNameRules" placeholder="Last name" density="comfortable"></v-text-field>
						</v-col>
					</v-row>
					<p class="inputLabel">Email Address</p>
					<v-text-field v-model="email" :rules="emailRules" placeholder="Enter email address" density="comfortable"></v-text-field>
					<p class="inputLabel">Password</p>
					<v-text-field
						:append-inner-icon="visible ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
						:type="visible ? 'text' : 'password'"
						placeholder="Enter Password"
						density="comfortable"
						@click:append-inner="visible = !visible"
						:rules="passwordRules"
						v-model="password"
					></v-text-field>
					<p class="inputLabel">Confirm Password</p>
					<v-text-field
						:append-inner-icon="visible1 ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
						:type="visible1 ? 'text' : 'password'"
						placeholder="Confirm Password"
						density="comfortable"
						@click:append-inner="visible1 = !visible1"
						:rules="confirmpasswordRules"
						v-model="confirmPassword"
					></v-text-field>
					<v-checkbox v-model="agree" :rules="agreeRule" @click="agree = !agree" color="green">
						<template v-slot:label>
							<div class="font-weight-medium" :style="{ fontSize: $vuetify.display.mobile ? '14px' : '16px' }">
								I agree to Umoja
								<a href="#" style="color: #0076ff; text-decoration: none" @click="privacyVisible = true">Privacy Policy</a> and
								<a href="#" style="color: #0076ff; text-decoration: none" @click="termsVisible = true">Terms of Use</a>
							</div>
						</template>
					</v-checkbox>
					<p v-if="signupError" style="color: red">{{ signupError }}</p>
					<v-btn type="submit" :disabled="!valid" block color="green" flat size="x-large" class="rounded-lg mt-6">
						<span class="mr-4" style="text-transform: none">Create an account</span>
						<v-progress-circular v-if="userStore.loading" indeterminate :width="2" :size="25"></v-progress-circular>
					</v-btn>
				</v-form>
			</v-card>
		</div>
	</div>
	<v-dialog max-width="800" v-model="privacyVisible" persistent>
		<privacyPolicy @closePrivacyVisible="closePrivacyVisible" />
	</v-dialog>

	<v-dialog max-width="800" v-model="termsVisible" persistent>
		<TermsOfUse @closeTermsVisible="closeTermsVisible" />
	</v-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useUserStore } from "~/stores/userStore";
import { useRouter } from "vue-router";
import { emailRules, passwordRules, firstNameRules, lastNameRules } from "~/utils/formrules";

const userStore = useUserStore();
const router = useRouter();
const visible = ref(false);
const visible1 = ref(false);
const privacyVisible = ref(false);
const termsVisible = ref(false);
const valid = ref(false);

const email = ref("");
const last_name = ref("");
const first_name = ref("");
const password = ref("");
const confirmPassword = ref("");
const agree = ref(false);
const signupError = ref("")

const agreeRule = [(v) => !!v || "You must agree to the terms and conditions"];

const confirmpasswordRules = [(v) => !!v || "Confirm Password is required", (v) => v === password.value || "Passwords do not match"];

async function socialMediaLogin(provider) {
			try {
				const response = await userStore.socialLogin(provider);
				window.location.href = response.data.url;
			} catch (error) {
				console.log(error);
			}
		}

async function handleSubmit() {
	if (valid.value) {
			const result= await userStore.signup({
				first_name: first_name.value,
				last_name: last_name.value,
				email: email.value,
				password: password.value,
				password_confirmation: confirmPassword.value,
				terms_accepted: 1,
			});
			if (result.success) {
				router.push("/");
				signupError.value = "";
				first_name.value = "";
				last_name.value = "";
				email.value = "";
				password.value = "";
				password_confirmation.value = "";
				agree.value = false;
			}else{
				signupError.value = result.message
			}
		} 
	}

const closePrivacyVisible = () => {
	privacyVisible.value = false;
};
const closeTermsVisible = () => {
	termsVisible.value = false;
};
</script>
