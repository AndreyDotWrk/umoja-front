<template>
  <beta-test />
  <div class="authBg">
   <authHeader/>
   <div class="d-flex justify-center py-12 px-2">

       <v-card  flat class="pa-12 rounded-lg" width="100%" max-width="562px">
           <h1 style="
font-style: normal;
font-weight: 900;
font-size: 48px;
line-height: 60px;
letter-spacing: -0.03em;

/* Carbon/4 */

color: #333333;">Set new password</h1>
<p class="font-weight-medium mb-8 mt-1">Enter the email address associated with your account and we’ll send you a link to reset your password</p>


     <v-form v-model="valid" @submit.prevent="handleResetPassword()">
      <p class="inputLabel">Email Address</p>    
      <v-text-field
          placeholder="Enter your email address" 
          density="comfortable" 
          :rules="emailRules"
          v-model="email"
      ></v-text-field>
        <p class="inputLabel">New Password</p>             
        <v-text-field
          :append-inner-icon="visible ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
          :type="visible ? 'text' : 'password'"
          placeholder="Enter new Password" 
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
          v-model="c_password"
      ></v-text-field>
      <p color="red">{{error}}</p>
      <v-btn type="submit" :disabled="!valid"  block color="green" flat size="x-large" class="rounded-lg mr-1 mt-6"> 
            <span class="mr-4" style="text-transform: none;">Reset password</span>
            <v-progress-circular v-if="loading"
                indeterminate
                :width="2"
                :size="25" 
          ></v-progress-circular>
        </v-btn>
     </v-form>

        
       </v-card>
   </div>
     <v-dialog  v-model="showModal" persistent max-width="568">
       
       <!-- Modal content -->
      <div class="d-flex" style="gap: 10px;">
         <v-card style="width: 550px; justify-content: center; align-items: center; border-radius: 15px"  class="d-flex flex-column text-center pa-10">
     <v-avatar color="#FEF6ED" size="x-large" class="mb-5">
       <v-img src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990449/umoja/good_bs9qfy.svg"></v-img>
     </v-avatar>
     <h3 style="font-size: 32px; font-weight: 600; line-height: 40px; color: #2a2a2a">Successful Password Reset!</h3>
     <p class="mt-4" style="font-size: 16px; font-weight: 500; line-height: 22px; color: #333; width: 340px">
       You can now use your new password to login to your account 🙌🏽.
     </p>
     <v-card-actions class="d-flex justify-center align-center pt-10 w-100">
       <v-btn width="250" @click="toLogin" flat style="background-color: #2c6e63; color: #edf0ef; font-size: 16px; font-weight: 600; padding: 10px" size="x-large">Login</v-btn>
     </v-card-actions>
       </v-card>
       <v-icon @click="showModal = false" style="width: 30px; background-color: #B3B3B3; height: 30px; border-radius: 50%; font-weight: 900; cursor: pointer; font-size: 1.5rem;" icon="mdi mdi-window-close"></v-icon>
      </div>
     </v-dialog>
  </div> 
</template>
<script setup>
import { passwordRules, emailRules} from '~/utils/formrules'
import {vendorUseApi} from '~/composables/vendorApi'
import {ref} from '@vue/composition-api'
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'

const confirmpasswordRules = [
  v => !!v || 'Confirm Password is required',
  v => v === password.value || 'Passwords do not match'
]
const config = useRuntimeConfig()
const baseURL = config.public.backendApiUrl;

const api = vendorUseApi();
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false)
  const error = ref("")
    const showModal = ref(false)
    const valid = ref(false)

 const visible = ref(false)
 const visible1 = ref(false)
 const password = ref("")
 const c_password = ref("")
 const email = ref("")

 function toLogin(){
  showModal.value = false
  router.push('/vendor/login')
 }

  async function handleResetPassword() {
      const token = route.params.token
      if(valid.value) {
        try {
          const resetPass = await resetPassWord({token: token, email: email.value, password: password.value, password_confirmation: c_password.value })
          if (resetPass) {
            showModal.value = true
          }
        } catch(error) {
          console.error(error)
        }
      }
    }

     async function resetPassWord({token, email, password, password_confirmation}) {
      loading.value = true;
        try {
        const response = await axios.post(baseURL + '/auth/reset_vendor_password', {
          token,
          email,
          password,
          password_confirmation
        });
        error.value = "";
        return true
      } catch (error) {
            if (error.response) {
              error.value = error.response.data.message || 'An error occurred during set password request.';
            } else if (error.request) {
              error.value = 'No response received from server. Please try again later.';
            } else {
              error.value = 'An error occurred. Please try again later.';
            }
            return false;
      } finally {
        loading.value = false;
      }
    } 
</script>